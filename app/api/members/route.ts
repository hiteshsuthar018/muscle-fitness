import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/lib/db'
import bcrypt from 'bcryptjs'

export async function GET() {
  try {
    const members = await prisma.member.findMany({
      include: {
        membershipPlan: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(members)
  } catch (error) {
    console.error('Error fetching members:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      email,
      phone,
      age,
      gender,
      address,
      emergencyContact,
      planId,
      startDate,
      endDate,
      password,
    } = body

    // Validate required fields
    if (!name || !email || !phone || !age || !gender || !planId || !startDate || !endDate || !password) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if email already exists in users table
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { message: 'User with this email already exists' },
        { status: 400 }
      )
    }

    // Check if email already exists in members table
    const existingMember = await prisma.member.findUnique({
      where: { email }
    })

    if (existingMember) {
      return NextResponse.json(
        { message: 'Member with this email already exists' },
        { status: 400 }
      )
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user account for the member
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'MEMBER',
      },
    })

    // Create member
    const member = await prisma.member.create({
      data: {
        name,
        email,
        phone,
        age: parseInt(age),
        gender,
        address,
        emergencyContact,
        planId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        createdById: user.id,
      },
      include: {
        membershipPlan: true,
      },
    })

    return NextResponse.json(member, { status: 201 })
  } catch (error) {
    console.error('Error creating member:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
