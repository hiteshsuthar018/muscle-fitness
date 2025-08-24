import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/lib/db'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as any
    
    if (!session?.user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Only members can access their own attendance
    if (session.user.role !== 'MEMBER') {
      return NextResponse.json(
        { message: 'Forbidden' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    
    if (!startDate || !endDate) {
      return NextResponse.json(
        { message: 'Start date and end date are required' },
        { status: 400 }
      )
    }

    // Find the member record for the current user
    const member = await prisma.member.findUnique({
      where: { email: session.user.email! },
    })

    if (!member) {
      return NextResponse.json(
        { message: 'Member not found' },
        { status: 404 }
      )
    }

    const attendance = await prisma.attendance.findMany({
      where: {
        memberId: member.id,
        checkIn: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      },
      orderBy: {
        checkIn: 'desc',
      },
    })

    return NextResponse.json(attendance)
  } catch (error) {
    console.error('Error fetching member attendance:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
