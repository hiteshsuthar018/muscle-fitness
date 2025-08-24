'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Button } from '@/app/components/ui/button'
import { 
  Users, 
  UserCheck, 
  Calendar, 
  DollarSign, 
  Plus,
  TrendingUp,
  TrendingDown,
  Activity,
  Home,
  Clock,
  CreditCard,
  CheckCircle,
  XCircle
} from 'lucide-react'
import Link from 'next/link'
import { formatCurrency, formatDate } from '@/app/lib/utils'

interface DashboardStats {
  totalMembers: number
  activeMembers: number
  attendanceToday: number
  revenue: number
  newMembersThisMonth: number
  attendanceRate: number
}

interface MemberStats {
  totalAttendance: number
  thisMonthAttendance: number
  lastPaymentDate: string
  nextPaymentDate: string
  paymentStatus: string
  membershipEndDate: string
}

export default function Dashboard() {
  const { data: session } = useSession()
  const [stats, setStats] = useState<DashboardStats>({
    totalMembers: 0,
    activeMembers: 0,
    attendanceToday: 0,
    revenue: 0,
    newMembersThisMonth: 0,
    attendanceRate: 0
  })
  const [memberStats, setMemberStats] = useState<MemberStats>({
    totalAttendance: 0,
    thisMonthAttendance: 0,
    lastPaymentDate: '',
    nextPaymentDate: '',
    paymentStatus: 'PAID',
    membershipEndDate: ''
  })
  const [loading, setLoading] = useState(true)

  const isMember = session?.user?.role === 'MEMBER'

  useEffect(() => {
    if (isMember) {
      fetchMemberStats()
    } else {
      fetchDashboardStats()
    }
  }, [isMember])

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('/api/dashboard/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchMemberStats = async () => {
    try {
      // For now, we'll use mock data. In a real app, you'd fetch from API
      setMemberStats({
        totalAttendance: 45,
        thisMonthAttendance: 12,
        lastPaymentDate: '2024-08-01',
        nextPaymentDate: '2024-09-01',
        paymentStatus: 'PAID',
        membershipEndDate: '2024-12-31'
      })
    } catch (error) {
      console.error('Error fetching member stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const quickActions = [
    {
      title: 'Add Member',
      description: 'Register a new gym member',
      icon: Plus,
      href: '/dashboard/members/new',
      color: 'bg-blue-500'
    },
    {
      title: 'Check Attendance',
      description: 'Record member check-ins',
      icon: UserCheck,
      href: '/dashboard/attendance',
      color: 'bg-green-500'
    },
    {
      title: 'View Members',
      description: 'Manage member profiles',
      icon: Users,
      href: '/dashboard/members',
      color: 'bg-purple-500'
    },
    {
      title: 'Payment Status',
      description: 'Check payment status',
      icon: DollarSign,
      href: '/dashboard/plans',
      color: 'bg-orange-500'
    }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Activity className="h-8 w-8 text-orange-500 mx-auto mb-2 animate-spin" />
          <p className="text-gray-300">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (isMember) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white">Welcome, {session?.user?.name}!</h1>
          <p className="text-gray-300">Track your fitness journey and membership details</p>
        </div>

        {/* Member Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Total Visits</CardTitle>
              <Activity className="h-4 w-4 text-gray-300" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{memberStats.totalAttendance}</div>
              <p className="text-xs text-gray-400">
                {memberStats.thisMonthAttendance} this month
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Payment Status</CardTitle>
              <CreditCard className="h-4 w-4 text-gray-300" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {memberStats.paymentStatus === 'PAID' ? (
                  <span className="text-green-400">Paid</span>
                ) : (
                  <span className="text-red-400">Unpaid</span>
                )}
              </div>
              <p className="text-xs text-gray-400">
                Next payment: {formatDate(new Date(memberStats.nextPaymentDate))}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Membership</CardTitle>
              <Home className="h-4 w-4 text-gray-300" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">Active</div>
              <p className="text-xs text-gray-400">
                Expires: {formatDate(new Date(memberStats.membershipEndDate))}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Last Visit</CardTitle>
              <Clock className="h-4 w-4 text-gray-300" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">Today</div>
              <p className="text-xs text-gray-400">
                <CheckCircle className="inline h-3 w-3 text-green-400" /> Checked in
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions for Members */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link href="/dashboard/attendance">
              <Card className="hover:shadow-md transition-shadow cursor-pointer bg-gray-800 border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 rounded-lg bg-green-500">
                      <Activity className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">View Attendance</h3>
                      <p className="text-sm text-gray-300">Check your visit history</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/dashboard/payments">
              <Card className="hover:shadow-md transition-shadow cursor-pointer bg-gray-800 border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 rounded-lg bg-blue-500">
                      <CreditCard className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">Payment History</h3>
                      <p className="text-sm text-gray-300">View payment records</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/dashboard/announcements">
              <Card className="hover:shadow-md transition-shadow cursor-pointer bg-gray-800 border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 rounded-lg bg-orange-500">
                      <Calendar className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">Announcements</h3>
                      <p className="text-sm text-gray-300">Latest gym updates</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Recent Visits</CardTitle>
              <CardDescription className="text-gray-300">Your last 5 gym visits</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <div className="h-10 w-10 rounded-full bg-green-900 flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-green-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">Gym Visit {i}</p>
                      <p className="text-xs text-gray-400">2 hours • {i} day{i > 1 ? 's' : ''} ago</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Payment History</CardTitle>
              <CardDescription className="text-gray-300">Your recent payments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <div className="h-10 w-10 rounded-full bg-blue-900 flex items-center justify-center">
                      <CreditCard className="h-5 w-5 text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">₹1200 Payment</p>
                      <p className="text-xs text-gray-400">Premium Plan • {i} month{i > 1 ? 's' : ''} ago</p>
                    </div>
                    <div className="text-green-400">
                      <CheckCircle className="h-4 w-4" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Admin/Staff Dashboard
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-300">Welcome to Muscle Fitness management system</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Total Members</CardTitle>
            <Users className="h-4 w-4 text-gray-300" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.totalMembers}</div>
            <p className="text-xs text-gray-400">
              +{stats.newMembersThisMonth} this month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Active Members</CardTitle>
            <UserCheck className="h-4 w-4 text-gray-300" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.activeMembers}</div>
            <p className="text-xs text-gray-400">
              {Math.round((stats.activeMembers / stats.totalMembers) * 100)}% of total
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Today&apos;s Attendance</CardTitle>
            <Calendar className="h-4 w-4 text-gray-300" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.attendanceToday}</div>
            <p className="text-xs text-gray-400">
              {stats.attendanceRate}% attendance rate
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-300" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">₹{stats.revenue.toLocaleString()}</div>
            <p className="text-xs text-gray-400">
              <TrendingUp className="inline h-3 w-3 text-green-400" /> +12% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon
            return (
              <Link key={action.title} href={action.href}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer bg-gray-800 border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-lg ${action.color}`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{action.title}</h3>
                        <p className="text-sm text-gray-300">{action.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Recent Members</CardTitle>
            <CardDescription className="text-gray-300">Latest member registrations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center">
                    <Users className="h-5 w-5 text-gray-300" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">New Member {i}</p>
                    <p className="text-xs text-gray-400">Joined today</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Today&apos;s Attendance</CardTitle>
            <CardDescription className="text-gray-300">Members who checked in today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div className="h-10 w-10 rounded-full bg-green-900 flex items-center justify-center">
                    <UserCheck className="h-5 w-5 text-green-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">Member {i}</p>
                    <p className="text-xs text-gray-400">Checked in at 9:00 AM</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
