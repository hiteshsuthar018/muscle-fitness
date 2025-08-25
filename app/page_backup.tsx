'use client'

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
  Play,
  Instagram,
  Facebook,
  Twitter,
  Youtube
} from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function Home() {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % 3)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Fitness Enthusiast",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face",
      text: "Muscle Fitness transformed my life! The trainers are amazing and the community is so supportive. I've lost 30 pounds and gained so much confidence."
    },
    {
      name: "Mike Chen",
      role: "Bodybuilder",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
      text: "Best gym I've ever been to! The equipment is top-notch and the personal training sessions helped me achieve my competition goals."
    },
    {
      name: "Emma Rodriguez",
      role: "Yoga Instructor",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
      text: "The group classes are incredible! I love the variety and the energy. The facility is always clean and well-maintained."
    }
  ]

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-gray-900/95 backdrop-blur-md shadow-lg border-b border-gray-700 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Dumbbell className="h-8 w-8 text-orange-500" />
              <span className="text-xl font-bold text-white">Muscle Fitness</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#about" className="text-gray-300 hover:text-orange-400 transition-colors">About</a>
              <a href="#services" className="text-gray-300 hover:text-orange-400 transition-colors">Services</a>
              <a href="#pricing" className="text-gray-300 hover:text-orange-400 transition-colors">Pricing</a>
              <a href="#contact" className="text-gray-300 hover:text-orange-400 transition-colors">Contact</a>
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

      {/* Hero Section with Video Background */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
            poster="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1920&h=1080&fit=crop"
          >
            <source src="https://player.vimeo.com/external/434045526.sd.mp4?s=c27eecc69a27dbc4ff2b87d38afc35f1a9e7c02d&profile_id=164&oauth2_token_id=57447761" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Transform Your <span className="text-orange-400">Body</span><br />
            Transform Your <span className="text-orange-400">Life</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-gray-200 leading-relaxed">
            Join the ultimate fitness experience with state-of-the-art equipment, expert trainers, and a supportive community that will push you to your limits.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signin">
              <Button size="lg" className="bg-orange-500 text-white hover:bg-orange-600 text-lg px-8 py-4">
                <User className="mr-2 h-6 w-6" />
                Start Your Journey
                <ArrowRight className="ml-2 h-6 w-6" />
              </Button>
            </Link>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-gray-900 text-lg px-8 py-4"
              onClick={() => setIsVideoPlaying(!isVideoPlaying)}
            >
              <Play className="mr-2 h-6 w-6" />
              Watch Our Story
            </Button>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-800 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-900/20 to-red-900/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="bg-orange-900 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Users className="h-10 w-10 text-orange-400" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-2">500+</h3>
              <p className="text-gray-300">Active Members</p>
            </div>
            <div className="text-center group">
              <div className="bg-orange-900 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Clock className="h-10 w-10 text-orange-400" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-2">24/7</h3>
              <p className="text-gray-300">Open Hours</p>
            </div>
            <div className="text-center group">
              <div className="bg-orange-900 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Award className="h-10 w-10 text-orange-400" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-2">15+</h3>
              <p className="text-gray-300">Expert Trainers</p>
            </div>
            <div className="text-center group">
              <div className="bg-orange-900 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Star className="h-10 w-10 text-orange-400" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-2">4.9</h3>
              <p className="text-gray-300">Member Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-white mb-6">Why Choose Muscle Fitness?</h2>
              <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                We&apos;re not just a gym - we&apos;re a community dedicated to helping you achieve your fitness goals. 
                With cutting-edge equipment, personalized training programs, and a supportive environment, 
                we provide everything you need to transform your body and mind.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <CheckCircle className="h-6 w-6 text-orange-400 mr-3" />
                  <span className="text-gray-200">State-of-the-art equipment</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-6 w-6 text-orange-400 mr-3" />
                  <span className="text-gray-200">Certified personal trainers</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-6 w-6 text-orange-400 mr-3" />
                  <span className="text-gray-200">24/7 access for members</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-6 w-6 text-orange-400 mr-3" />
                  <span className="text-gray-200">Nutrition consultation</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop" 
                alt="Gym Equipment" 
                className="rounded-lg shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-orange-500 p-4 rounded-lg">
                <div className="text-white text-center">
                  <div className="text-2xl font-bold">10+</div>
                  <div className="text-sm">Years Experience</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Our Premium Services</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Comprehensive fitness solutions designed to help you achieve your goals faster and more effectively
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-gray-900 border-gray-700 hover:border-orange-500 transition-colors duration-300 group">
              <div className="relative overflow-hidden rounded-t-lg">
                <img 
                  src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=250&fit=crop" 
                  alt="Strength Training" 
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <CardHeader>
                <div className="bg-orange-900 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Dumbbell className="h-6 w-6 text-orange-400" />
                </div>
                <CardTitle className="text-white text-xl">Strength Training</CardTitle>
                <CardDescription className="text-gray-300">
                  Build muscle and increase strength with our comprehensive weight training programs designed by certified trainers.
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="bg-gray-900 border-gray-700 hover:border-orange-500 transition-colors duration-300 group">
              <div className="relative overflow-hidden rounded-t-lg">
                <img 
                  src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=250&fit=crop" 
                  alt="Personal Training" 
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <CardHeader>
                <div className="bg-orange-900 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-orange-400" />
                </div>
                <CardTitle className="text-white text-xl">Personal Training</CardTitle>
                <CardDescription className="text-gray-300">
                  Get personalized attention and guidance from our certified personal trainers who will create custom programs for you.
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="bg-gray-900 border-gray-700 hover:border-orange-500 transition-colors duration-300 group">
              <div className="relative overflow-hidden rounded-t-lg">
                <img 
                  src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=250&fit=crop" 
                  alt="Group Classes" 
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <CardHeader>
                <div className="bg-orange-900 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6 text-orange-400" />
                </div>
                <CardTitle className="text-white text-xl">Group Classes</CardTitle>
                <CardDescription className="text-gray-300">
                  Join our energetic group classes including yoga, Zumba, HIIT, spinning, and more to keep your workouts exciting.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">What Our Members Say</h2>
            <p className="text-xl text-gray-300">Real stories from real people who transformed their lives with us</p>
          </div>
          <div className="relative">
            <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentTestimonial * 100}%)` }}>
              {testimonials.map((testimonial, index) => (
                <div key={index} className="w-full flex-shrink-0 px-4">
                  <div className="bg-gray-800 rounded-2xl p-8 md:p-12 text-center max-w-4xl mx-auto">
                    <div className="flex justify-center mb-6">
                      <img 
                        src={testimonial.image} 
                        alt={testimonial.name}
                        className="w-20 h-20 rounded-full object-cover border-4 border-orange-500"
                      />
                    </div>
                    <p className="text-xl text-gray-200 mb-6 italic">&quot;{testimonial.text}&quot;</p>
                    <h4 className="text-white font-semibold text-lg">{testimonial.name}</h4>
                    <p className="text-orange-400">{testimonial.role}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentTestimonial ? 'bg-orange-500' : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Choose Your Plan</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Flexible membership options designed to fit your lifestyle and fitness goals
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-gray-900 border-gray-700 hover:border-orange-500 transition-colors duration-300 group">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-white">Basic</CardTitle>
                <div className="text-5xl font-bold text-orange-400 mb-2">₹1000</div>
                <CardDescription className="text-gray-300">per month</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4 mb-8">
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
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                    <span className="text-gray-200">Free WiFi</span>
                  </li>
                </ul>
                <Button className="w-full bg-gray-700 hover:bg-gray-600 text-white">
                  Get Started
                </Button>
              </CardContent>
            </Card>
            
            <Card className="relative border-orange-500 bg-gray-900 group transform hover:scale-105 transition-transform duration-300">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-orange-500 text-white px-6 py-2 rounded-full text-sm font-semibold">
                  Most Popular
                </span>
              </div>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-white">Premium</CardTitle>
                <div className="text-5xl font-bold text-orange-400 mb-2">₹1200</div>
                <CardDescription className="text-gray-300">per month</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                    <span className="text-gray-200">All Basic features</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                    <span className="text-gray-200">Unlimited group classes</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                    <span className="text-gray-200">Monthly fitness consultation</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                    <span className="text-gray-200">Guest passes (2/month)</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                    <span className="text-gray-200">Sauna & Steam room</span>
                  </li>
                </ul>
                <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                  Get Started
                </Button>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-900 border-gray-700 hover:border-orange-500 transition-colors duration-300 group">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-white">Elite</CardTitle>
                <div className="text-5xl font-bold text-orange-400 mb-2">₹1400</div>
                <CardDescription className="text-gray-300">per month</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4 mb-8">
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
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                    <span className="text-gray-200">Priority booking</span>
                  </li>
                </ul>
                <Button className="w-full bg-gray-700 hover:bg-gray-600 text-white">
                  Get Started
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-4xl font-bold text-white mb-6">Get In Touch</h2>
              <p className="text-lg text-gray-300 mb-8">
                Ready to start your fitness journey? Contact us today and let&apos;s discuss how we can help you achieve your goals.
              </p>
              <div className="space-y-6">
                <div className="flex items-center">
                  <div className="bg-orange-900 w-12 h-12 rounded-lg flex items-center justify-center mr-4">
                    <Phone className="h-6 w-6 text-orange-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Phone</h3>
                    <p className="text-gray-300">+91 98765 43210</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="bg-orange-900 w-12 h-12 rounded-lg flex items-center justify-center mr-4">
                    <Mail className="h-6 w-6 text-orange-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Email</h3>
                    <p className="text-gray-300">info@musclefitness.com</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="bg-orange-900 w-12 h-12 rounded-lg flex items-center justify-center mr-4">
                    <MapPin className="h-6 w-6 text-orange-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Address</h3>
                    <p className="text-gray-300">123 Fitness Street, Mumbai, Maharashtra 400001</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="bg-orange-900 w-12 h-12 rounded-lg flex items-center justify-center mr-4">
                    <Clock className="h-6 w-6 text-orange-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Hours</h3>
                    <p className="text-gray-300">24/7 - Open All Day, Every Day</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop" 
                alt="Gym Interior" 
                className="rounded-lg shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-lg"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 text-white py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <Dumbbell className="h-8 w-8 text-orange-500" />
                <span className="text-2xl font-bold">Muscle Fitness</span>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                Transform your body and mind with our state-of-the-art facilities and expert trainers. 
                Join our community and start your fitness journey today.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">
                  <Instagram className="h-6 w-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">
                  <Facebook className="h-6 w-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">
                  <Twitter className="h-6 w-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">
                  <Youtube className="h-6 w-6" />
                </a>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#about" className="text-gray-400 hover:text-orange-400 transition-colors">About Us</a></li>
                <li><a href="#services" className="text-gray-400 hover:text-orange-400 transition-colors">Services</a></li>
                <li><a href="#pricing" className="text-gray-400 hover:text-orange-400 transition-colors">Pricing</a></li>
                <li><a href="#contact" className="text-gray-400 hover:text-orange-400 transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Services</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">Personal Training</a></li>
                <li><a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">Group Classes</a></li>
                <li><a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">Nutrition Planning</a></li>
                <li><a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">Recovery Services</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 Muscle Fitness. All rights reserved. | Made with ❤️ for fitness enthusiasts
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
