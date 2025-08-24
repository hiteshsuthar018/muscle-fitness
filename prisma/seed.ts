import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@musclefitness.com' },
    update: {},
    create: {
      email: 'admin@musclefitness.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN',
    },
  })

  // Create staff user
  const staffPassword = await bcrypt.hash('staff123', 12)
  const staff = await prisma.user.upsert({
    where: { email: 'staff@musclefitness.com' },
    update: {},
    create: {
      email: 'staff@musclefitness.com',
      name: 'Staff User',
      password: staffPassword,
      role: 'STAFF',
    },
  })

  console.log('✅ Users created')

  // Create membership plans with Indian pricing
  const basicPlan = await prisma.membershipPlan.create({
    data: {
      name: 'Basic',
      duration: 1,
      price: 1000,
      description: 'Perfect for beginners',
      features: [
        'Access to gym equipment',
        'Basic fitness assessment',
        'Locker room access',
        'Free Wi-Fi'
      ],
      isActive: true,
    },
  })

  const premiumPlan = await prisma.membershipPlan.create({
    data: {
      name: 'Premium',
      duration: 1,
      price: 1200,
      description: 'Most popular choice',
      features: [
        'All Basic features',
        'Group classes included',
        'Monthly fitness consultation',
        'Guest passes (2/month)',
        'Towel service'
      ],
      isActive: true,
    },
  })

  const elitePlan = await prisma.membershipPlan.create({
    data: {
      name: 'Elite',
      duration: 1,
      price: 1400,
      description: 'Ultimate fitness experience',
      features: [
        'All Premium features',
        'Personal training sessions',
        'Nutrition consultation',
        'Unlimited guest passes',
        'Priority booking',
        'Spa access'
      ],
      isActive: true,
    },
  })

  console.log('✅ Membership plans created')

  // Create sample members with user accounts
  const member1Password = await bcrypt.hash('member123', 12)
  const member1User = await prisma.user.create({
    data: {
      name: 'Rahul Sharma',
      email: 'rahul@example.com',
      password: member1Password,
      role: 'MEMBER',
    },
  })

  const member1 = await prisma.member.create({
    data: {
      name: 'Rahul Sharma',
      email: 'rahul@example.com',
      phone: '+91 98765 43210',
      age: 28,
      gender: 'Male',
      address: 'Mumbai, Maharashtra',
      emergencyContact: '+91 98765 43211',
      planId: premiumPlan.id,
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      paymentStatus: 'PAID',
      isActive: true,
      createdById: member1User.id,
    },
  })

  const member2Password = await bcrypt.hash('member123', 12)
  const member2User = await prisma.user.create({
    data: {
      name: 'Priya Patel',
      email: 'priya@example.com',
      password: member2Password,
      role: 'MEMBER',
    },
  })

  const member2 = await prisma.member.create({
    data: {
      name: 'Priya Patel',
      email: 'priya@example.com',
      phone: '+91 98765 43212',
      age: 25,
      gender: 'Female',
      address: 'Mumbai, Maharashtra',
      emergencyContact: '+91 98765 43213',
      planId: basicPlan.id,
      startDate: new Date('2024-02-01'),
      endDate: new Date('2024-12-31'),
      paymentStatus: 'PAID',
      isActive: true,
      createdById: member2User.id,
    },
  })

  const member3Password = await bcrypt.hash('member123', 12)
  const member3User = await prisma.user.create({
    data: {
      name: 'Amit Kumar',
      email: 'amit@example.com',
      password: member3Password,
      role: 'MEMBER',
    },
  })

  const member3 = await prisma.member.create({
    data: {
      name: 'Amit Kumar',
      email: 'amit@example.com',
      phone: '+91 98765 43214',
      age: 32,
      gender: 'Male',
      address: 'Mumbai, Maharashtra',
      emergencyContact: '+91 98765 43215',
      planId: elitePlan.id,
      startDate: new Date('2024-03-01'),
      endDate: new Date('2024-12-31'),
      paymentStatus: 'UNPAID',
      isActive: true,
      createdById: member3User.id,
    },
  })

  console.log('✅ Sample members created')

  // Create sample attendance records
  await prisma.attendance.create({
    data: {
      memberId: member1.id,
      checkIn: new Date('2024-08-23T09:00:00Z'),
      checkOut: new Date('2024-08-23T11:00:00Z'),
      recordedBy: admin.id,
    },
  })

  await prisma.attendance.create({
    data: {
      memberId: member2.id,
      checkIn: new Date('2024-08-23T10:00:00Z'),
      recordedBy: admin.id,
    },
  })

  await prisma.attendance.create({
    data: {
      memberId: member3.id,
      checkIn: new Date('2024-08-22T08:00:00Z'),
      checkOut: new Date('2024-08-22T10:30:00Z'),
      recordedBy: staff.id,
    },
  })

  console.log('✅ Sample attendance records created')

  // Create sample announcements
  await prisma.announcement.create({
    data: {
      title: 'Welcome to Muscle Fitness!',
      content: 'We are excited to welcome all our new members. Please make sure to attend the orientation session this Saturday.',
      authorId: admin.id,
      isActive: true,
    },
  })

  await prisma.announcement.create({
    data: {
      title: 'New Equipment Arrival',
      content: 'We have added new cardio machines and weight training equipment. Come check them out!',
      authorId: staff.id,
      isActive: true,
    },
  })

  console.log('✅ Sample announcements created')

  console.log('🎉 Database seeding completed!')
  console.log('\n📋 Login Credentials:')
  console.log('Admin: admin@musclefitness.com / admin123')
  console.log('Staff: staff@musclefitness.com / staff123')
  console.log('Member 1: rahul@example.com / member123')
  console.log('Member 2: priya@example.com / member123')
  console.log('Member 3: amit@example.com / member123')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
