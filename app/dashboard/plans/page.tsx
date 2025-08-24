'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'
import { Textarea } from '@/app/components/ui/textarea'
import { 
  CreditCard, 
  Users, 
  CheckCircle,
  XCircle,
  Edit,
  Save,
  X,
  User,
  Plus,
  Trash2
} from 'lucide-react'

interface MembershipPlan {
  id: string
  name: string
  duration: number
  price: number
  description: string
  features: string[]
  isActive: boolean
  members: {
    id: string
    name: string
    email: string
    paymentStatus: string
    endDate: string
  }[]
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
}

interface PlanModalData {
  id: string
  name: string
  duration: number
  price: number
  description: string
  features: string[]
  isActive: boolean
}

export default function PlansPage() {
  const [plans, setPlans] = useState<MembershipPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [showMemberModal, setShowMemberModal] = useState(false)
  const [showPlanModal, setShowPlanModal] = useState(false)
  const [memberModalData, setMemberModalData] = useState<MemberModalData | null>(null)
  const [planModalData, setPlanModalData] = useState<PlanModalData | null>(null)
  const [isEditingMember, setIsEditingMember] = useState(false)

  const [stats, setStats] = useState({
    totalPlans: 0,
    activeMembers: 0,
    paidMembers: 0,
    unpaidMembers: 0
  })

  useEffect(() => {
    fetchPlans()
  }, [])

  const fetchPlans = async () => {
    try {
      const response = await fetch('/api/plans')
      if (response.ok) {
        const data = await response.json()
        setPlans(data)
        calculateStats(data)
      }
    } catch (error) {
      console.error('Error fetching plans:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (plansData: MembershipPlan[]) => {
    const totalPlans = plansData.length
    let activeMembers = 0
    let paidMembers = 0
    let unpaidMembers = 0

    plansData.forEach(plan => {
      plan.members.forEach(member => {
        activeMembers++
        if (member.paymentStatus === 'PAID') {
          paidMembers++
        } else {
          unpaidMembers++
        }
      })
    })

    setStats({
      totalPlans,
      activeMembers,
      paidMembers,
      unpaidMembers
    })
  }

  const handleMemberClick = (member: { id: string; name: string; email: string; phone?: string; age?: number; gender?: string; address?: string; emergencyContact?: string; planId?: string; startDate?: string; endDate?: string; paymentStatus?: string }) => {
    setMemberModalData({
      id: member.id,
      name: member.name,
      email: member.email,
      phone: member.phone || '',
      age: member.age || 0,
      gender: member.gender || '',
      address: member.address || '',
      emergencyContact: member.emergencyContact || '',
      planId: member.planId || '',
      startDate: member.startDate || '',
      endDate: member.endDate || '',
      paymentStatus: member.paymentStatus || 'UNPAID'
    })
    setShowMemberModal(true)
    setIsEditingMember(false)
  }

  const handlePlanEdit = (plan: MembershipPlan) => {
    setPlanModalData({
      id: plan.id,
      name: plan.name,
      duration: plan.duration,
      price: plan.price,
      description: plan.description,
      features: [...plan.features],
      isActive: plan.isActive
    })
    setShowPlanModal(true)
  }

  const handlePaymentDone = async () => {
    if (!memberModalData) return

    try {
      const response = await fetch(`/api/members/${memberModalData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...memberModalData,
          paymentStatus: 'PAID'
        }),
      })

      if (response.ok) {
        setMemberModalData(prev => prev ? { ...prev, paymentStatus: 'PAID' } : null)
        fetchPlans() // Refresh the data
        alert('Payment marked as completed!')
      } else {
        alert('Error updating payment status')
      }
    } catch (error) {
      console.error('Error updating payment:', error)
      alert('Error updating payment status')
    }
  }

  const handleSaveMemberChanges = async () => {
    if (!memberModalData) return

    try {
      const response = await fetch(`/api/members/${memberModalData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(memberModalData),
      })

      if (response.ok) {
        fetchPlans() // Refresh the data
        setIsEditingMember(false)
        alert('Member details updated successfully!')
      } else {
        alert('Error updating member details')
      }
    } catch (error) {
      console.error('Error updating member:', error)
      alert('Error updating member details')
    }
  }

  const handleSavePlanChanges = async () => {
    if (!planModalData) return

    try {
      const response = await fetch(`/api/plans/${planModalData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(planModalData),
      })

      if (response.ok) {
        fetchPlans() // Refresh the data
        setShowPlanModal(false)
        alert('Plan updated successfully!')
      } else {
        alert('Error updating plan')
      }
    } catch (error) {
      console.error('Error updating plan:', error)
      alert('Error updating plan')
    }
  }

  const addFeature = () => {
    if (planModalData) {
      setPlanModalData({
        ...planModalData,
        features: [...planModalData.features, '']
      })
    }
  }

  const removeFeature = (index: number) => {
    if (planModalData) {
      const newFeatures = planModalData.features.filter((_, i) => i !== index)
      setPlanModalData({
        ...planModalData,
        features: newFeatures
      })
    }
  }

  const updateFeature = (index: number, value: string) => {
    if (planModalData) {
      const newFeatures = [...planModalData.features]
      newFeatures[index] = value
      setPlanModalData({
        ...planModalData,
        features: newFeatures
      })
    }
  }

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
          <CreditCard className="h-8 w-8 text-orange-500 mx-auto mb-2 animate-spin" />
          <p className="text-gray-300">Loading plans...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Plans & Payments</h1>
          <p className="text-gray-300">Manage membership plans and track payments</p>
        </div>
        <Button className="bg-orange-600 hover:bg-orange-700 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Add Plan
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Total Plans</CardTitle>
            <CreditCard className="h-4 w-4 text-gray-300" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.totalPlans}</div>
            <p className="text-xs text-gray-400">Available plans</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Active Members</CardTitle>
            <Users className="h-4 w-4 text-gray-300" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.activeMembers}</div>
            <p className="text-xs text-gray-400">Total members</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Paid Members</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">{stats.paidMembers}</div>
            <p className="text-xs text-gray-400">Payment completed</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Unpaid Members</CardTitle>
            <XCircle className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-400">{stats.unpaidMembers}</div>
            <p className="text-xs text-gray-400">Payment pending</p>
          </CardContent>
        </Card>
      </div>

      {/* Plans */}
      <div className="space-y-6">
        {plans.map((plan) => (
          <Card key={plan.id} className="bg-gray-800 border-gray-700">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-white">{plan.name}</CardTitle>
                  <CardDescription className="text-gray-300">{plan.description}</CardDescription>
                </div>
                                <div className="flex items-center space-x-2">
                  <div className="text-right">
                    <div className="text-2xl font-bold text-orange-400">₹{plan.price}</div>
                    <div className="text-sm text-gray-400">per month</div>
                  </div>
                  <Button
                    onClick={() => handlePlanEdit(plan)}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Features */}
                <div>
                  <h4 className="font-semibold text-white mb-3">Features</h4>
                  <ul className="space-y-2">
                    {plan.features.map((feature: string, index: number) => (
                      <li key={index} className="flex items-center text-gray-300">
                        <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Members */}
                <div>
                  <h4 className="font-semibold text-white mb-3">Members ({plan.members.length})</h4>
                  <div className="space-y-3">
                    {plan.members.map((member) => (
                      <div 
                        key={member.id} 
                        className="flex items-center justify-between p-3 border border-gray-700 rounded-lg bg-gray-700 cursor-pointer hover:bg-gray-600"
                        onClick={() => handleMemberClick(member)}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="h-8 w-8 rounded-full bg-orange-500 flex items-center justify-center">
                            <User className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <div className="text-white font-medium">{member.name}</div>
                            <div className="text-gray-400 text-sm">{member.email}</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(member.paymentStatus)}`}>
                            {member.paymentStatus === 'PAID' ? <CheckCircle className="h-3 w-3 mr-1" /> : <XCircle className="h-3 w-3 mr-1" />}
                            {member.paymentStatus}
                          </span>
                          <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getMembershipStatusColor(member.endDate)}`}>
                            {getMembershipStatus(member.endDate)}
                          </span>
                        </div>
                      </div>
                    ))}
                    {plan.members.length === 0 && (
                      <div className="text-center py-4 text-gray-400">
                        No members on this plan
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Member Details Modal */}
      {showMemberModal && memberModalData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Member Details</h2>
                <div className="flex space-x-2">
                  {!isEditingMember && (
                    <Button
                      onClick={() => setIsEditingMember(true)}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  )}
                  <Button
                    onClick={() => setShowMemberModal(false)}
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
                    value={memberModalData.name}
                    onChange={(e) => setMemberModalData({...memberModalData, name: e.target.value})}
                    disabled={!isEditingMember}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                  <Input
                    value={memberModalData.email}
                    onChange={(e) => setMemberModalData({...memberModalData, email: e.target.value})}
                    disabled={!isEditingMember}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Phone</label>
                  <Input
                    value={memberModalData.phone}
                    onChange={(e) => setMemberModalData({...memberModalData, phone: e.target.value})}
                    disabled={!isEditingMember}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Age</label>
                  <Input
                    type="number"
                    value={memberModalData.age}
                    onChange={(e) => setMemberModalData({...memberModalData, age: parseInt(e.target.value)})}
                    disabled={!isEditingMember}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Gender</label>
                  <select
                    value={memberModalData.gender}
                    onChange={(e) => setMemberModalData({...memberModalData, gender: e.target.value})}
                    disabled={!isEditingMember}
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
                    value={memberModalData.emergencyContact}
                    onChange={(e) => setMemberModalData({...memberModalData, emergencyContact: e.target.value})}
                    disabled={!isEditingMember}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Start Date</label>
                  <Input
                    type="date"
                    value={memberModalData.startDate}
                    onChange={(e) => setMemberModalData({...memberModalData, startDate: e.target.value})}
                    disabled={!isEditingMember}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">End Date</label>
                  <Input
                    type="date"
                    value={memberModalData.endDate}
                    onChange={(e) => setMemberModalData({...memberModalData, endDate: e.target.value})}
                    disabled={!isEditingMember}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Payment Status</label>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-3 py-2 text-sm font-semibold rounded-full ${getPaymentStatusColor(memberModalData.paymentStatus)}`}>
                      {memberModalData.paymentStatus}
                    </span>
                    {memberModalData.paymentStatus === 'UNPAID' && (
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
                  value={memberModalData.address}
                  onChange={(e) => setMemberModalData({...memberModalData, address: e.target.value})}
                  disabled={!isEditingMember}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                {isEditingMember && (
                  <>
                    <Button
                      onClick={() => setIsEditingMember(false)}
                      variant="outline"
                      className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSaveMemberChanges}
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

      {/* Plan Edit Modal */}
      {showPlanModal && planModalData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Edit Plan</h2>
                <Button
                  onClick={() => setShowPlanModal(false)}
                  variant="ghost"
                  className="text-gray-300 hover:text-white hover:bg-gray-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Plan Name</label>
                  <Input
                    value={planModalData.name}
                    onChange={(e) => setPlanModalData({...planModalData, name: e.target.value})}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Price (₹)</label>
                  <Input
                    type="number"
                    value={planModalData.price}
                    onChange={(e) => setPlanModalData({...planModalData, price: parseFloat(e.target.value)})}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Duration (months)</label>
                  <Input
                    type="number"
                    value={planModalData.duration}
                    onChange={(e) => setPlanModalData({...planModalData, duration: parseInt(e.target.value)})}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                  <select
                    value={planModalData.isActive ? 'active' : 'inactive'}
                    onChange={(e) => setPlanModalData({...planModalData, isActive: e.target.value === 'active'})}
                    className="w-full px-3 py-2 rounded-md border border-gray-600 bg-gray-700 text-white"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <Textarea
                  value={planModalData.description}
                  onChange={(e) => setPlanModalData({...planModalData, description: e.target.value})}
                  className="bg-gray-700 border-gray-600 text-white"
                  rows={3}
                />
              </div>

              <div className="mt-6">
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-sm font-medium text-gray-300">Features</label>
                  <Button
                    onClick={addFeature}
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Feature
                  </Button>
                </div>
                <div className="space-y-2">
                  {planModalData.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input
                        value={feature}
                        onChange={(e) => updateFeature(index, e.target.value)}
                        placeholder="Enter feature description"
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                      <Button
                        onClick={() => removeFeature(index)}
                        size="sm"
                        variant="ghost"
                        className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <Button
                  onClick={() => setShowPlanModal(false)}
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSavePlanChanges}
                  className="bg-orange-600 hover:bg-orange-700 text-white"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
