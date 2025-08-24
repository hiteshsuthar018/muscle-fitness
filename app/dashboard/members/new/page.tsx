'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'
import { Label } from '@/app/components/ui/label'
import { ArrowLeft, Save, UserPlus, Eye, EyeOff, RefreshCw } from 'lucide-react'
import Link from 'next/link'

interface MembershipPlan {
  id: string
  name: string
  duration: number
  price: number
  description: string
}

export default function AddMemberPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [plans, setPlans] = useState<MembershipPlan[]>([])
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    gender: '',
    address: '',
    emergencyContact: '',
    planId: '',
    startDate: '',
    endDate: '',
    password: ''
  })

  useEffect(() => {
    fetchPlans()
    generatePassword()
  }, [])

  const fetchPlans = async () => {
    try {
      const response = await fetch('/api/plans')
      if (response.ok) {
        const data = await response.json()
        setPlans(data)
      }
    } catch (error) {
      console.error('Error fetching plans:', error)
    }
  }

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let password = ''
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setFormData(prev => ({ ...prev, password }))
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Auto-calculate end date when plan or start date changes
    if (name === 'planId' || name === 'startDate') {
      const plan = plans.find(p => p.id === (name === 'planId' ? value : formData.planId))
      const startDate = name === 'startDate' ? value : formData.startDate
      
      if (plan && startDate) {
        const endDate = new Date(startDate)
        endDate.setMonth(endDate.getMonth() + plan.duration)
        setFormData(prev => ({
          ...prev,
          endDate: endDate.toISOString().split('T')[0]
        }))
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/members', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const result = await response.json()
        alert(`Member added successfully!\n\nLogin Credentials:\nEmail: ${formData.email}\nPassword: ${formData.password}\n\nPlease save these credentials for the member.`)
        router.push('/dashboard/members?message=Member added successfully!')
      } else {
        const data = await response.json()
        alert(data.message || 'Error adding member')
      }
    } catch (error) {
      console.error('Error adding member:', error)
      alert('Error adding member')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link href="/dashboard/members">
          <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-gray-700">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Members
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-white">Add New Member</h1>
          <p className="text-gray-300">Register a new gym member with login credentials</p>
        </div>
      </div>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <UserPlus className="h-5 w-5" />
            <span>Member Information</span>
          </CardTitle>
          <CardDescription className="text-gray-300">
            Fill in the member&apos;s details below. A password will be generated automatically.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-300">Full Name *</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500 focus:ring-orange-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500 focus:ring-orange-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-gray-300">Phone *</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500 focus:ring-orange-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="age" className="text-gray-300">Age *</Label>
                <Input
                  id="age"
                  name="age"
                  type="number"
                  placeholder="Enter age"
                  value={formData.age}
                  onChange={handleChange}
                  min="16"
                  max="100"
                  required
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500 focus:ring-orange-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender" className="text-gray-300">Gender *</Label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full h-10 rounded-md border border-gray-600 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-700 text-white"
                  required
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="emergencyContact" className="text-gray-300">Emergency Contact</Label>
                <Input
                  id="emergencyContact"
                  name="emergencyContact"
                  type="tel"
                  placeholder="Emergency contact number"
                  value={formData.emergencyContact}
                  onChange={handleChange}
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500 focus:ring-orange-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="text-gray-300">Address</Label>
              <Input
                id="address"
                name="address"
                type="text"
                placeholder="Enter address"
                value={formData.address}
                onChange={handleChange}
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500 focus:ring-orange-500"
              />
            </div>

            {/* Password Section */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300">Member Password *</Label>
              <div className="flex space-x-2">
                <div className="relative flex-1">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500 focus:ring-orange-500 pr-10"
                    readOnly
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <Button
                  type="button"
                  onClick={generatePassword}
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-gray-400">This password will be used by the member to login to their account.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="planId" className="text-gray-300">Membership Plan *</Label>
                <select
                  id="planId"
                  name="planId"
                  value={formData.planId}
                  onChange={handleChange}
                  className="w-full h-10 rounded-md border border-gray-600 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-700 text-white"
                  required
                >
                  <option value="">Select a plan</option>
                  {plans.map((plan) => (
                    <option key={plan.id} value={plan.id}>
                      {plan.name} - ₹{plan.price}/month
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="startDate" className="text-gray-300">Start Date *</Label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                  className="bg-gray-700 border-gray-600 text-white focus:border-orange-500 focus:ring-orange-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate" className="text-gray-300">End Date *</Label>
                <Input
                  id="endDate"
                  name="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                  readOnly
                  className="bg-gray-700 border-gray-600 text-white focus:border-orange-500 focus:ring-orange-500"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Link href="/dashboard/members">
                <Button type="button" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={loading} className="bg-orange-600 hover:bg-orange-700 text-white">
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Adding Member...' : 'Add Member'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
