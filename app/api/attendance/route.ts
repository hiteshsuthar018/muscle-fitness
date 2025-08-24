import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')
    
    if (!date) {
      return NextResponse.json(
        { message: 'Date parameter is required' },
        { status: 400 }
      )
    }

    const startDate = new Date(date)
    const endDate = new Date(date)
    endDate.setDate(endDate.getDate() + 1)

    const attendance = await prisma.attendance.findMany({
      where: {
        checkIn: {
          gte: startDate,
          lt: endDate,
        },
      },
      orderBy: {
        checkIn: 'desc',
      },
    })

    return NextResponse.json(attendance)
  } catch (error) {
    console.error('Error fetching attendance:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { memberId, date } = body

    if (!memberId || !date) {
      return NextResponse.json(
        { message: 'Member ID and date are required' },
        { status: 400 }
      )
    }

    // Check if member exists and is active
    const member = await prisma.member.findUnique({
      where: { id: memberId },
    })

    if (!member) {
      return NextResponse.json(
        { message: 'Member not found' },
        { status: 404 }
      )
    }

    if (!member.isActive) {
      return NextResponse.json(
        { message: 'Member is not active' },
        { status: 400 }
      )
    }

    // Check if attendance already exists for this member on this date
    const startDate = new Date(date)
    const endDate = new Date(date)
    endDate.setDate(endDate.getDate() + 1)

    const existingAttendance = await prisma.attendance.findFirst({
      where: {
        memberId,
        checkIn: {
          gte: startDate,
          lt: endDate,
        },
      },
    })

    if (existingAttendance) {
      return NextResponse.json(
        { message: 'Attendance already recorded for this member today' },
        { status: 400 }
      )
    }

    // Create attendance record
    const attendance = await prisma.attendance.create({
      data: {
        memberId,
        checkIn: new Date(),
      },
    })

    return NextResponse.json(attendance, { status: 201 })
  } catch (error) {
    console.error('Error creating attendance:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
