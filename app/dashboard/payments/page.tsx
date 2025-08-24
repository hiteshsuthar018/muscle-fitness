'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card'
import { 
  CreditCard, 
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign
} from 'lucide-react'
import { formatDate } from '@/app/lib/utils'

interface Payment {
  id: string
  amount: number
  status: string
  date: string
  plan: string
  method: string
}

export default function MemberPaymentsPage() {
  const { data: session } = useSession()
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [memberInfo, setMemberInfo] = useState({
    name: '',
    plan: '',
    nextPayment: '',
    totalPaid: 0,
    outstandingAmount: 0
  })

  useEffect(() => {
    fetchMemberPayments()
  }, [])

  const fetchMemberPayments = useCallback(async () => {
    try {
      // For now, using mock data. In a real app, you'd fetch from API
      setPayments([
        {
          id: '1',
          amount: 1200,
          status: 'PAID',
          date: '2024-08-01',
          plan: 'Premium',
          method: 'Cash'
        },
        {
          id: '2',
          amount: 1200,
          status: 'PAID',
          date: '2024-07-01',
          plan: 'Premium',
          method: 'Cash'
        },
        {
          id: '3',
          amount: 1200,
          status: 'PAID',
          date: '2024-06-01',
          plan: 'Premium',
          method: 'Cash'
        }
      ])

      setMemberInfo({
        name: session?.user?.name || '',
        plan: 'Premium',
        nextPayment: '2024-09-01',
        totalPaid: 3600,
        outstandingAmount: 0
      })
    } catch (error) {
      console.error('Error fetching payments:', error)
    } finally {
      setLoading(false)
    }
  }, [session?.user?.name])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'bg-green-900 text-green-400'
      case 'PENDING':
        return 'bg-yellow-900 text-yellow-400'
      case 'OVERDUE':
        return 'bg-red-900 text-red-400'
      default:
        return 'bg-gray-700 text-gray-300'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PAID':
        return <CheckCircle className="h-4 w-4" />
      case 'PENDING':
        return <Clock className="h-4 w-4" />
      case 'OVERDUE':
        return <XCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <CreditCard className="h-8 w-8 text-orange-500 mx-auto mb-2 animate-spin" />
          <p className="text-gray-300">Loading payments...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">My Payments</h1>
        <p className="text-gray-300">Track your payment history and membership status</p>
      </div>

      {/* Member Info */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Membership Information</CardTitle>
          <CardDescription className="text-gray-300">
            Your current membership details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-orange-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                <CreditCard className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-white mb-1">Current Plan</h3>
              <p className="text-gray-300">{memberInfo.plan}</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-white mb-1">Total Paid</h3>
              <p className="text-gray-300">₹{memberInfo.totalPaid.toLocaleString()}</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-white mb-1">Next Payment</h3>
              <p className="text-gray-300">{formatDate(new Date(memberInfo.nextPayment))}</p>
            </div>
            <div className="text-center">
              <div className="bg-red-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="font-semibold text-white mb-1">Outstanding</h3>
              <p className="text-gray-300">₹{memberInfo.outstandingAmount.toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment History */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Payment History</CardTitle>
          <CardDescription className="text-gray-300">
            Your complete payment records
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {payments.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between p-4 border border-gray-700 rounded-lg bg-gray-700">
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 rounded-full bg-blue-900 flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">₹{payment.amount.toLocaleString()}</h3>
                    <p className="text-sm text-gray-300">{payment.plan} Plan</p>
                    <p className="text-xs text-gray-400">Paid on {formatDate(new Date(payment.date))}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-300">{payment.method}</span>
                  <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(payment.status)}`}>
                    {getStatusIcon(payment.status)}
                    <span className="ml-1">{payment.status}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>

          {payments.length === 0 && (
            <div className="text-center py-8">
              <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No payments found</h3>
              <p className="text-gray-300">
                Your payment history will appear here once you make your first payment.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Payment Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-300">Total Payments:</span>
                <span className="text-white font-semibold">{payments.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Total Amount:</span>
                <span className="text-white font-semibold">₹{payments.reduce((sum, p) => sum + p.amount, 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Paid Payments:</span>
                <span className="text-green-400 font-semibold">{payments.filter(p => p.status === 'PAID').length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Pending Payments:</span>
                <span className="text-yellow-400 font-semibold">{payments.filter(p => p.status === 'PENDING').length}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Next Payment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">₹1,200</div>
              <p className="text-gray-300 mb-4">Premium Plan</p>
              <div className="bg-blue-900 text-blue-400 px-3 py-1 rounded-full text-sm font-semibold inline-block">
                Due: {formatDate(new Date(memberInfo.nextPayment))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
