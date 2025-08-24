import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/lib/db'

export async function GET() {
  try {
    const plans = await prisma.membershipPlan.findMany({
      where: {
        isActive: true,
      },
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
      orderBy: {
        price: 'asc',
      },
    })

    return NextResponse.json(plans)
  } catch (error) {
    console.error('Error fetching plans:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, duration, price, description, features } = body

    if (!name || !duration || !price) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      )
    }

    const plan = await prisma.membershipPlan.create({
      data: {
        name,
        duration: parseInt(duration),
        price: parseFloat(price),
        description,
        features: features || [],
      },
    })

    return NextResponse.json(plan, { status: 201 })
  } catch (error) {
    console.error('Error creating plan:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
