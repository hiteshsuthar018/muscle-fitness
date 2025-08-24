import { NextResponse } from 'next/server'
import { prisma } from '@/app/lib/db'

export async function GET() {
  try {
    // Get today's date
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    // Get start of current month
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)

    // Fetch statistics
    const [
      totalMembers,
      activeMembers,
      attendanceToday,
      newMembersThisMonth,
      activeMembersWithPlans
    ] = await Promise.all([
      // Total members
      prisma.member.count(),
      
      // Active members (membership not expired)
      prisma.member.count({
        where: {
          endDate: {
            gte: today
          },
          isActive: true
        }
      }),
      
      // Today's attendance
      prisma.attendance.count({
        where: {
          checkIn: {
            gte: today,
            lt: tomorrow
          }
        }
      }),
      
      // New members this month
      prisma.member.count({
        where: {
          createdAt: {
            gte: startOfMonth
          }
        }
      }),
      
      // Active members with their plans for revenue calculation
      prisma.member.findMany({
        where: {
          endDate: {
            gte: today
          },
          isActive: true
        },
        include: {
          membershipPlan: true
        }
      })
    ])

    // Calculate attendance rate (simplified - could be more sophisticated)
    const attendanceRate = totalMembers > 0 ? Math.round((attendanceToday / totalMembers) * 100) : 0

    // Calculate revenue by summing up active members' plan prices
    const revenue = activeMembersWithPlans.reduce((total, member) => {
      return total + (member.membershipPlan?.price || 0)
    }, 0)

    return NextResponse.json({
      totalMembers,
      activeMembers,
      attendanceToday,
      revenue,
      newMembersThisMonth,
      attendanceRate
    })
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
