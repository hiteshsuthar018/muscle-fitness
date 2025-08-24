'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'
import { 
  Calendar, 
  Users, 
  CheckCircle, 
  XCircle, 
  Clock,
  TrendingUp,
  CalendarDays,
  User
} from 'lucide-react'
import { formatDate } from '@/app/lib/utils'
import { useSession } from 'next-auth/react'

interface Member {
  id: string
  name: string
  email: string
  phone: string
  age: number
  gender: string
  address: string
  emergencyContact: string
  planId: string
  startDate: string
  endDate: string
  paymentStatus: string
  isActive: boolean
  profileImage: string
  createdAt: string
  updatedAt: string
  createdById: string
  membershipPlan: {
    id: string
    name: string
    duration: number
    price: number
    description: string
    features: string[]
    isActive: boolean
  }
}

interface Attendance {
  id: string
  memberId: string
  checkIn: string
  checkOut: string | null
  recordedBy: string | null
  createdAt: string
  updatedAt: string
}

interface MemberAttendance {
  id: string
  memberId: string
  checkIn: string
  checkOut: string | null
  recordedBy: string | null
  createdAt: string
  updatedAt: string
}

export default function AttendancePage() {
  const { data: session } = useSession()
  const [members, setMembers] = useState<Member[]>([])
  const [attendance, setAttendance] = useState<Attendance[]>([])
  const [memberAttendance, setMemberAttendance] = useState<MemberAttendance[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [searchTerm, setSearchTerm] = useState('')
  const [stats, setStats] = useState({
    totalMembers: 0,
    presentToday: 0,
    absentToday: 0,
    attendanceRate: 0
  })

  const isMember = session?.user?.role === 'MEMBER'

  useEffect(() => {
    if (isMember) {
      fetchMemberAttendance()
    } else {
      fetchAttendance()
      fetchMembers()
    }
  }, [selectedDate, isMember])

  const fetchMembers = async () => {
    try {
      const response = await fetch('/api/members')
      if (response.ok) {
        const data = await response.json()
        setMembers(data)
        calculateStats(data)
      }
    } catch (error) {
      console.error('Error fetching members:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchAttendance = async () => {
    try {
      const response = await fetch(`/api/attendance?date=${selectedDate}`)
      if (response.ok) {
        const data = await response.json()
        setAttendance(data)
      }
    } catch (error) {
      console.error('Error fetching attendance:', error)
    }
  }

  const fetchMemberAttendance = async () => {
    try {
      // For members, fetch their own attendance for the current month
      const currentDate = new Date()
      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
      const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
      
      const response = await fetch(`/api/members/attendance?startDate=${startOfMonth.toISOString()}&endDate=${endOfMonth.toISOString()}`)
      if (response.ok) {
        const data = await response.json()
        setMemberAttendance(data)
      }
    } catch (error) {
      console.error('Error fetching member attendance:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (membersData: Member[]) => {
    const totalMembers = membersData.length
    const presentToday = attendance.length
    const absentToday = totalMembers - presentToday
    const attendanceRate = totalMembers > 0 ? Math.round((presentToday / totalMembers) * 100) : 0

    setStats({
      totalMembers,
      presentToday,
      absentToday,
      attendanceRate
    })
  }

  const handleAttendanceToggle = async (memberId: string, isPresent: boolean) => {
    try {
      if (isPresent) {
        // Mark as present
        const response = await fetch('/api/attendance', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            memberId,
            date: selectedDate,
          }),
        })

        if (response.ok) {
          fetchAttendance()
          fetchMembers()
        } else {
          alert('Error marking attendance')
        }
      } else {
        // Mark as absent - find and delete attendance record
        const attendanceRecord = attendance.find(a => a.memberId === memberId)
        if (attendanceRecord) {
          const response = await fetch(`/api/attendance/${attendanceRecord.id}`, {
            method: 'DELETE',
          })

          if (response.ok) {
            fetchAttendance()
            fetchMembers()
          } else {
            alert('Error removing attendance')
          }
        }
      }
    } catch (error) {
      console.error('Error toggling attendance:', error)
      alert('Error updating attendance')
    }
  }

  const handleMarkAllPresent = async () => {
    try {
      const promises = members.map(member => 
        fetch('/api/attendance', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            memberId: member.id,
            date: selectedDate,
          }),
        })
      )

      await Promise.all(promises)
      fetchAttendance()
      fetchMembers()
      alert('All members marked as present!')
    } catch (error) {
      console.error('Error marking all present:', error)
      alert('Error marking all members present')
    }
  }

  const handleMarkAllAbsent = async () => {
    try {
      const promises = attendance.map(record =>
        fetch(`/api/attendance/${record.id}`, {
          method: 'DELETE',
        })
      )

      await Promise.all(promises)
      fetchAttendance()
      fetchMembers()
      alert('All members marked as absent!')
    } catch (error) {
      console.error('Error marking all absent:', error)
      alert('Error marking all members absent')
    }
  }

  const isMemberPresent = (memberId: string) => {
    return attendance.some(a => a.memberId === memberId)
  }

  const getMemberAttendancePercentage = () => {
    if (memberAttendance.length === 0) return 0
    
    const currentDate = new Date()
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
    
    const totalDays = Math.ceil((endOfMonth.getTime() - startOfMonth.getTime()) / (1000 * 60 * 60 * 24))
    const presentDays = memberAttendance.length
    
    return Math.round((presentDays / totalDays) * 100)
  }

  const getCalendarDays = () => {
    const currentDate = new Date()
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const firstDayOfMonth = new Date(year, month, 1).getDay()
    
    const days = []
    
    // Add empty days for padding
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null)
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      const dateString = date.toISOString().split('T')[0]
      const hasAttendance = memberAttendance.some(a => 
        a.checkIn.startsWith(dateString)
      )
      days.push({ day, date: dateString, hasAttendance })
    }
    
    return days
  }

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.phone.includes(searchTerm)
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Calendar className="h-8 w-8 text-orange-500 mx-auto mb-2 animate-spin" />
          <p className="text-gray-300">Loading attendance...</p>
        </div>
      </div>
    )
  }

  // Member View - Calendar and Personal Stats
  if (isMember) {
    const attendancePercentage = getMemberAttendancePercentage()
    const calendarDays = getCalendarDays()
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

    return (
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white">My Attendance</h1>
          <p className="text-gray-300">Track your gym attendance and progress</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">This Month</CardTitle>
              <CalendarDays className="h-4 w-4 text-gray-300" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{memberAttendance.length}</div>
              <p className="text-xs text-gray-400">Days attended</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Attendance Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-gray-300" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">{attendancePercentage}%</div>
              <p className="text-xs text-gray-400">Monthly average</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Last Visit</CardTitle>
              <Clock className="h-4 w-4 text-gray-300" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {memberAttendance.length > 0 
                  ? formatDate(new Date(memberAttendance[0].checkIn))
                  : 'No visits yet'
                }
              </div>
              <p className="text-xs text-gray-400">Most recent check-in</p>
            </CardContent>
          </Card>
        </div>

        {/* Calendar View */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Attendance Calendar</CardTitle>
            <CardDescription className="text-gray-300">
              Green dots indicate days you attended the gym
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1 mb-4">
              {weekDays.map(day => (
                <div key={day} className="text-center text-sm font-medium text-gray-400 p-2">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((dayData, index) => (
                <div
                  key={index}
                  className={`aspect-square p-2 text-center text-sm border border-gray-700 ${
                    dayData === null
                      ? 'bg-gray-900'
                      : dayData.hasAttendance
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-700 text-gray-300'
                  }`}
                >
                  {dayData?.day || ''}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Attendance History */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Recent Attendance History</CardTitle>
            <CardDescription className="text-gray-300">
              Your last 10 gym visits
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {memberAttendance.slice(0, 10).map((record) => (
                <div
                  key={record.id}
                  className="flex items-center justify-between p-3 border border-gray-700 rounded-lg bg-gray-700"
                >
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 rounded-full bg-green-600 flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-white" />
                    </div>
                    <div>
                                             <div className="text-white font-medium">
                         {formatDate(new Date(record.checkIn))}
                       </div>
                      <div className="text-gray-400 text-sm">
                        Check-in: {new Date(record.checkIn).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-green-400 text-sm font-medium">
                    Present
                  </div>
                </div>
              ))}
              {memberAttendance.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-600" />
                  <p>No attendance records found</p>
                  <p className="text-sm">Start visiting the gym to see your attendance here</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Admin/Staff View - Full Attendance Management
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Attendance Management</h1>
        <p className="text-gray-300">Track and manage member attendance</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Total Members</CardTitle>
            <Users className="h-4 w-4 text-gray-300" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.totalMembers}</div>
            <p className="text-xs text-gray-400">Active members</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Present Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">{stats.presentToday}</div>
            <p className="text-xs text-gray-400">Members checked in</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Absent Today</CardTitle>
            <XCircle className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-400">{stats.absentToday}</div>
            <p className="text-xs text-gray-400">Members not present</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Attendance Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400">{stats.attendanceRate}%</div>
            <p className="text-xs text-gray-400">Today&apos;s rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Date</label>
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Search Members</label>
            <Input
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleMarkAllPresent}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            Mark All Present
          </Button>
          <Button
            onClick={handleMarkAllAbsent}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Mark All Absent
          </Button>
        </div>
      </div>

      {/* Members Table */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Member Attendance</CardTitle>
          <CardDescription className="text-gray-300">
                         Click the toggle buttons to mark attendance for {formatDate(new Date(selectedDate))}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left p-3 text-gray-300 font-medium">Member</th>
                  <th className="text-left p-3 text-gray-300 font-medium">Contact</th>
                  <th className="text-left p-3 text-gray-300 font-medium">Plan</th>
                  <th className="text-left p-3 text-gray-300 font-medium">Status</th>
                  <th className="text-left p-3 text-gray-300 font-medium">Check-in Time</th>
                  <th className="text-left p-3 text-gray-300 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map((member) => {
                  const isPresent = isMemberPresent(member.id)
                  const attendanceRecord = attendance.find(a => a.memberId === member.id)
                  
                  return (
                    <tr
                      key={member.id}
                      className={`border-b border-gray-700 ${
                        isPresent ? 'bg-green-900/20' : 'bg-red-900/20'
                      }`}
                    >
                      <td className="p-3">
                        <div className="flex items-center space-x-3">
                          <div className="h-8 w-8 rounded-full bg-orange-500 flex items-center justify-center">
                            <User className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <div className="text-white font-medium">{member.name}</div>
                            <div className="text-gray-400 text-sm">{member.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 text-gray-300">{member.phone}</td>
                      <td className="p-3 text-gray-300">₹{member.membershipPlan.price}</td>
                      <td className="p-3">
                        <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${
                          isPresent 
                            ? 'bg-green-900 text-green-400' 
                            : 'bg-red-900 text-red-400'
                        }`}>
                          {isPresent ? (
                            <>
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Present
                            </>
                          ) : (
                            <>
                              <XCircle className="h-3 w-3 mr-1" />
                              Absent
                            </>
                          )}
                        </span>
                      </td>
                      <td className="p-3 text-gray-300">
                        {attendanceRecord 
                          ? new Date(attendanceRecord.checkIn).toLocaleTimeString()
                          : '-'
                        }
                      </td>
                      <td className="p-3">
                        <Button
                          onClick={() => handleAttendanceToggle(member.id, !isPresent)}
                          size="sm"
                          className={
                            isPresent
                              ? 'bg-red-600 hover:bg-red-700 text-white'
                              : 'bg-green-600 hover:bg-green-700 text-white'
                          }
                        >
                          {isPresent ? 'Mark Absent' : 'Mark Present'}
                        </Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          {filteredMembers.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              <Users className="h-12 w-12 mx-auto mb-4 text-gray-600" />
              <p>No members found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}


