'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'
import { 
  Plus, 
  Search, 
  Eye,
  Edit,
  Trash2,
  User,
  CheckCircle,
  XCircle,
  EyeOff,
  Save,
  X
} from 'lucide-react'
import Link from 'next/link'

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
  profileImage?: string
  createdAt: string
  updatedAt: string
  membershipPlan: {
    id: string
    name: string
    price: number
  }
}

interface MemberModalData {
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
  password: string
  showPassword: boolean
}

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [modalData, setModalData] = useState<MemberModalData | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    fetchMembers()
  }, [])

  const fetchMembers = async () => {
    try {
      const response = await fetch('/api/members')
      if (response.ok) {
        const data = await response.json()
        setMembers(data)
      }
    } catch (error) {
      console.error('Error fetching members:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleMemberClick = (member: Member) => {
    setModalData({
      id: member.id,
      name: member.name,
      email: member.email,
      phone: member.phone,
      age: member.age,
      gender: member.gender,
      address: member.address,
      emergencyContact: member.emergencyContact,
      planId: member.planId,
      startDate: member.startDate,
      endDate: member.endDate,
      paymentStatus: member.paymentStatus,
      password: '********', // We'll need to fetch this from API
      showPassword: false
    })
    setShowModal(true)
    setIsEditing(false)
  }

  const handlePaymentDone = async () => {
    if (!modalData) return

    try {
      const response = await fetch(`/api/members/${modalData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...modalData,
          paymentStatus: 'PAID'
        }),
      })

      if (response.ok) {
        setModalData(prev => prev ? { ...prev, paymentStatus: 'PAID' } : null)
        fetchMembers() // Refresh the list
        alert('Payment marked as completed!')
      } else {
        alert('Error updating payment status')
      }
    } catch (error) {
      console.error('Error updating payment:', error)
      alert('Error updating payment status')
    }
  }

  const handleSaveChanges = async () => {
    if (!modalData) return

    try {
      const response = await fetch(`/api/members/${modalData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(modalData),
      })

      if (response.ok) {
        fetchMembers() // Refresh the list
        setIsEditing(false)
        alert('Member details updated successfully!')
      } else {
        alert('Error updating member details')
      }
    } catch (error) {
      console.error('Error updating member:', error)
      alert('Error updating member details')
    }
  }

  const handleDeleteMember = async (memberId: string) => {
    if (!confirm('Are you sure you want to delete this member?')) return

    try {
      const response = await fetch(`/api/members/${memberId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchMembers() // Refresh the list
        setShowModal(false)
        alert('Member deleted successfully!')
      } else {
        alert('Error deleting member')
      }
    } catch (error) {
      console.error('Error deleting member:', error)
      alert('Error deleting member')
    }
  }

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.phone.includes(searchTerm)
    
    const matchesFilter = filterStatus === 'all' ||
                         (filterStatus === 'active' && member.isActive) ||
                         (filterStatus === 'inactive' && !member.isActive) ||
                         (filterStatus === 'paid' && member.paymentStatus === 'PAID') ||
                         (filterStatus === 'unpaid' && member.paymentStatus === 'UNPAID')

    return matchesSearch && matchesFilter
  })

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'bg-green-900 text-green-400'
      case 'UNPAID':
        return 'bg-red-900 text-red-400'
      case 'PENDING':
        return 'bg-yellow-900 text-yellow-400'
      default:
        return 'bg-gray-700 text-gray-300'
    }
  }

  const getMembershipStatus = (endDate: string) => {
    const today = new Date()
    const end = new Date(endDate)
    return end > today ? 'Active' : 'Expired'
  }

  const getMembershipStatusColor = (endDate: string) => {
    const status = getMembershipStatus(endDate)
    return status === 'Active' ? 'bg-green-900 text-green-400' : 'bg-red-900 text-red-400'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <User className="h-8 w-8 text-orange-500 mx-auto mb-2 animate-spin" />
          <p className="text-gray-300">Loading members...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Members</h1>
          <p className="text-gray-300">Manage gym members and their details</p>
        </div>
        <Link href="/dashboard/members/new">
          <Button className="bg-orange-600 hover:bg-orange-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Add Member
          </Button>
        </Link>
      </div>

      {/* Search and Filter */}
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 rounded-md border border-gray-600 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="all">All Members</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="paid">Paid</option>
                <option value="unpaid">Unpaid</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Members Table */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">All Members ({filteredMembers.length})</CardTitle>
          <CardDescription className="text-gray-300">
            Double-click on any row to view member details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left p-3 text-gray-300 font-semibold">Name</th>
                  <th className="text-left p-3 text-gray-300 font-semibold">Age</th>
                  <th className="text-left p-3 text-gray-300 font-semibold">Email</th>
                  <th className="text-left p-3 text-gray-300 font-semibold">Phone</th>
                  <th className="text-left p-3 text-gray-300 font-semibold">Plan</th>
                  <th className="text-left p-3 text-gray-300 font-semibold">Payment</th>
                  <th className="text-left p-3 text-gray-300 font-semibold">Status</th>
                  <th className="text-left p-3 text-gray-300 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map((member) => (
                  <tr 
                    key={member.id} 
                    className="border-b border-gray-700 hover:bg-gray-700 cursor-pointer"
                    onDoubleClick={() => handleMemberClick(member)}
                  >
                    <td className="p-3">
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 rounded-full bg-orange-500 flex items-center justify-center">
                          <User className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <div className="text-white font-medium">{member.name}</div>
                          <div className="text-gray-400 text-sm">{member.gender}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-white">{member.age}</td>
                    <td className="p-3 text-white">{member.email}</td>
                    <td className="p-3 text-white">{member.phone}</td>
                    <td className="p-3">
                      <div>
                        <div className="text-white">{member.membershipPlan.name}</div>
                        <div className="text-gray-400 text-sm">₹{member.membershipPlan.price}</div>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(member.paymentStatus)}`}>
                        {member.paymentStatus === 'PAID' ? <CheckCircle className="h-3 w-3 mr-1" /> : <XCircle className="h-3 w-3 mr-1" />}
                        {member.paymentStatus}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getMembershipStatusColor(member.endDate)}`}>
                        {getMembershipStatus(member.endDate)}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleMemberClick(member)
                          }}
                          className="text-gray-300 hover:text-white hover:bg-gray-700"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteMember(member.id)
                          }}
                          className="text-red-400 hover:text-red-300 hover:bg-gray-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredMembers.length === 0 && (
              <div className="text-center py-8">
                <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">No members found</h3>
                <p className="text-gray-300">
                  {searchTerm || filterStatus !== 'all' 
                    ? 'Try adjusting your search or filter criteria.'
                    : 'Get started by adding your first member.'
                  }
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Member Details Modal */}
      {showModal && modalData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Member Details</h2>
                <div className="flex space-x-2">
                  {!isEditing && (
                    <Button
                      onClick={() => setIsEditing(true)}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  )}
                  <Button
                    onClick={() => setShowModal(false)}
                    variant="ghost"
                    className="text-gray-300 hover:text-white hover:bg-gray-700"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                  <Input
                    value={modalData.name}
                    onChange={(e) => setModalData({...modalData, name: e.target.value})}
                    disabled={!isEditing}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                  <Input
                    value={modalData.email}
                    onChange={(e) => setModalData({...modalData, email: e.target.value})}
                    disabled={!isEditing}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Phone</label>
                  <Input
                    value={modalData.phone}
                    onChange={(e) => setModalData({...modalData, phone: e.target.value})}
                    disabled={!isEditing}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Age</label>
                  <Input
                    type="number"
                    value={modalData.age}
                    onChange={(e) => setModalData({...modalData, age: parseInt(e.target.value)})}
                    disabled={!isEditing}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Gender</label>
                  <select
                    value={modalData.gender}
                    onChange={(e) => setModalData({...modalData, gender: e.target.value})}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 rounded-md border border-gray-600 bg-gray-700 text-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Emergency Contact</label>
                  <Input
                    value={modalData.emergencyContact}
                    onChange={(e) => setModalData({...modalData, emergencyContact: e.target.value})}
                    disabled={!isEditing}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Start Date</label>
                  <Input
                    type="date"
                    value={modalData.startDate}
                    onChange={(e) => setModalData({...modalData, startDate: e.target.value})}
                    disabled={!isEditing}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">End Date</label>
                  <Input
                    type="date"
                    value={modalData.endDate}
                    onChange={(e) => setModalData({...modalData, endDate: e.target.value})}
                    disabled={!isEditing}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                  <div className="relative">
                    <Input
                      type={modalData.showPassword ? "text" : "password"}
                      value={modalData.password}
                      readOnly
                      className="bg-gray-700 border-gray-600 text-white pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setModalData({...modalData, showPassword: !modalData.showPassword})}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {modalData.showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Payment Status</label>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-3 py-2 text-sm font-semibold rounded-full ${getPaymentStatusColor(modalData.paymentStatus)}`}>
                      {modalData.paymentStatus}
                    </span>
                    {modalData.paymentStatus === 'UNPAID' && (
                      <Button
                        onClick={handlePaymentDone}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        Mark as Paid
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">Address</label>
                <Input
                  value={modalData.address}
                  onChange={(e) => setModalData({...modalData, address: e.target.value})}
                  disabled={!isEditing}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                {isEditing && (
                  <>
                    <Button
                      onClick={() => setIsEditing(false)}
                      variant="outline"
                      className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSaveChanges}
                      className="bg-orange-600 hover:bg-orange-700 text-white"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
