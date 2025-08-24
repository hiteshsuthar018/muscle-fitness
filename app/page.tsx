import { Button } from '@/app/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card'
import { 
  Dumbbell, 
  Users, 
  Clock, 
  Award, 
  CheckCircle, 
  Star, 
  ArrowRight, 
  Phone, 
  Mail, 
  MapPin,
  User,
  Shield
} from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900">
      {/* Navigation */}
      <nav className="bg-gray-800 shadow-lg border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Dumbbell className="h-8 w-8 text-orange-500" />
              <span className="text-xl font-bold text-white">Muscle Fitness</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/auth/signin">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                  Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-gray-900 via-orange-900 to-red-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Welcome to <span className="text-orange-400">Muscle Fitness</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-gray-200">
            Transform your body and mind with our state-of-the-art facilities and expert trainers
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signin">
              <Button size="lg" className="bg-orange-500 text-white hover:bg-orange-600">
                <User className="mr-2 h-5 w-5" />
                Member Login
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/auth/signin">
              <Button size="lg" variant="outline" className="border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-white">
                <Shield className="mr-2 h-5 w-5" />
                Admin Login
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-orange-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-orange-400" />
              </div>
              <h3 className="text-2xl font-bold text-white">500+</h3>
              <p className="text-gray-300">Active Members</p>
            </div>
            <div className="text-center">
              <div className="bg-orange-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-orange-400" />
              </div>
              <h3 className="text-2xl font-bold text-white">24/7</h3>
              <p className="text-gray-300">Open Hours</p>
            </div>
            <div className="text-center">
              <div className="bg-orange-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-orange-400" />
              </div>
              <h3 className="text-2xl font-bold text-white">10+</h3>
              <p className="text-gray-300">Expert Trainers</p>
            </div>
            <div className="text-center">
              <div className="bg-orange-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-orange-400" />
              </div>
              <h3 className="text-2xl font-bold text-white">5.0</h3>
              <p className="text-gray-300">Member Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Our Services</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              We offer comprehensive fitness solutions to help you achieve your goals
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <div className="bg-orange-900 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Dumbbell className="h-6 w-6 text-orange-400" />
                </div>
                <CardTitle className="text-white">Strength Training</CardTitle>
                <CardDescription className="text-gray-300">
                  Build muscle and increase strength with our comprehensive weight training programs
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <div className="bg-orange-900 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-orange-400" />
                </div>
                <CardTitle className="text-white">Personal Training</CardTitle>
                <CardDescription className="text-gray-300">
                  Get personalized attention and guidance from our certified personal trainers
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <div className="bg-orange-900 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6 text-orange-400" />
                </div>
                <CardTitle className="text-white">Group Classes</CardTitle>
                <CardDescription className="text-gray-300">
                  Join our energetic group classes including yoga, Zumba, and HIIT workouts
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Membership Plans</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Choose the perfect plan that fits your fitness goals and budget
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-gray-900 border-gray-700 relative">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-white">Basic</CardTitle>
                <div className="text-4xl font-bold text-orange-400">₹1000</div>
                <CardDescription className="text-gray-300">per month</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                    <span className="text-gray-200">Access to gym equipment</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                    <span className="text-gray-200">Basic fitness assessment</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                    <span className="text-gray-200">Locker room access</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            <Card className="relative border-orange-500 bg-gray-900">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </span>
              </div>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-white">Premium</CardTitle>
                <div className="text-4xl font-bold text-orange-400">₹1200</div>
                <CardDescription className="text-gray-300">per month</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                    <span className="text-gray-200">All Basic features</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                    <span className="text-gray-200">Group classes included</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                    <span className="text-gray-200">Monthly fitness consultation</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                    <span className="text-gray-200">Guest passes (2/month)</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            <Card className="bg-gray-900 border-gray-700 relative">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-white">Elite</CardTitle>
                <div className="text-4xl font-bold text-orange-400">₹1400</div>
                <CardDescription className="text-gray-300">per month</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                    <span className="text-gray-200">All Premium features</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                    <span className="text-gray-200">Personal training sessions</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                    <span className="text-gray-200">Nutrition consultation</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                    <span className="text-gray-200">Unlimited guest passes</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Contact Us</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Get in touch with us for any questions about our services or membership
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-orange-900 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Phone className="h-6 w-6 text-orange-400" />
              </div>
              <h3 className="font-semibold text-white mb-2">Phone</h3>
              <p className="text-gray-300">+91 98765 43210</p>
            </div>
            <div className="text-center">
              <div className="bg-orange-900 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Mail className="h-6 w-6 text-orange-400" />
              </div>
              <h3 className="font-semibold text-white mb-2">Email</h3>
              <p className="text-gray-300">info@musclefitness.com</p>
            </div>
            <div className="text-center">
              <div className="bg-orange-900 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-6 w-6 text-orange-400" />
              </div>
              <h3 className="font-semibold text-white mb-2">Address</h3>
              <p className="text-gray-300">123 Fitness Street, Mumbai, Maharashtra</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 text-white py-8 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Dumbbell className="h-6 w-6 text-orange-500" />
              <span className="text-lg font-bold">Muscle Fitness</span>
            </div>
            <div className="text-gray-400">
              © 2024 Muscle Fitness. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
