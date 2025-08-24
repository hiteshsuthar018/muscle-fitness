import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/lib/db'

export async function GET(
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const plan = await prisma.membershipPlan.findUnique({
      where: { id },
      include: {
        members: {
          select: {
            id: true,
            name: true,
            email: true,
            paymentStatus: true,
            endDate: true,
          },
        },
      },
    })

    if (!plan) {
      return NextResponse.json(
        { message: 'Plan not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(plan)
  } catch (error) {
    console.error('Error fetching plan:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  { params, body }: { params: Promise<{ id: string }>, body: Promise<any> }
) {
  try {
    const { id } = await params
    const data = await body

    const updatedPlan = await prisma.membershipPlan.update({
      where: { id },
      data: {
        name: data.name,
        duration: data.duration,
        price: data.price,
        description: data.description,
        features: data.features,
        isActive: data.isActive,
      },
    })

    return NextResponse.json(updatedPlan)
  } catch (error) {
    console.error('Error updating plan:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Check if plan has members
    const planWithMembers = await prisma.membershipPlan.findUnique({
      where: { id },
      include: {
        members: true,
      },
    })

    if (planWithMembers && planWithMembers.members.length > 0) {
      return NextResponse.json(
        { message: 'Cannot delete plan with active members' },
        { status: 400 }
      )
    }

    await prisma.membershipPlan.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Plan deleted successfully' })
  } catch (error) {
    console.error('Error deleting plan:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
