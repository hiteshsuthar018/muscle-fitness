import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Create admin user only
  const adminPassword = await bcrypt.hash('admin123', 12)
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@musclefitness.com' },
    update: {},
    create: {
      email: 'admin@musclefitness.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN',
    },
  })

  console.log('✅ Admin user created:', adminUser.email)

  // Create membership plans
  const basicPlan = await prisma.membershipPlan.create({
    data: {
      name: 'Basic Plan',
      duration: 1,
      price: 1000,
      description: 'Perfect for beginners with basic gym access',
      features: [
        'Access to gym equipment',
        'Basic workout guidance',
        'Locker room access',
        'Free water dispenser'
      ],
      isActive: true,
    },
  })

  const premiumPlan = await prisma.membershipPlan.create({
    data: {
      name: 'Premium Plan',
      duration: 1,
      price: 1200,
      description: 'Advanced features with personal training sessions',
      features: [
        'All Basic Plan features',
        'Personal training sessions',
        'Nutrition consultation',
        'Group fitness classes',
        'Towel service',
        'Priority booking'
      ],
      isActive: true,
    },
  })

  const elitePlan = await prisma.membershipPlan.create({
    data: {
      name: 'Elite Plan',
      duration: 1,
      price: 1400,
      description: 'Ultimate fitness experience with premium amenities',
      features: [
        'All Premium Plan features',
        'Unlimited personal training',
        'Spa and sauna access',
        'Guest passes',
        'Exclusive events',
        '24/7 gym access',
        'Premium locker rooms'
      ],
      isActive: true,
    },
  })

  console.log('✅ Membership plans created')

  // Create sample announcements
  await prisma.announcement.create({
    data: {
      title: 'Welcome to Muscle Fitness!',
      content: 'We are excited to welcome all our new members to Muscle Fitness. Our state-of-the-art facilities and expert trainers are here to help you achieve your fitness goals.',
      authorId: adminUser.id,
      isActive: true,
    },
  })

  await prisma.announcement.create({
    data: {
      title: 'New Equipment Arrival',
      content: 'We have just received new cardio equipment including treadmills, ellipticals, and stationary bikes. Come check them out!',
      authorId: adminUser.id,
      isActive: true,
    },
  })

  console.log('✅ Sample announcements created')

  console.log('🎉 Database seeding completed successfully!')
  console.log('')
  console.log('📋 Login Credentials:')
  console.log('Admin: admin@musclefitness.com / admin123')
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
