# Muscle Fitness - Gym Management System

A comprehensive gym management web application built with Next.js, TypeScript, Prisma, and NextAuth. This system provides complete management capabilities for gym operations including member management, attendance tracking, payment processing, and more.

## 🏋️ Features

### Core Features
- **Modern Landing Page**: Attractive, responsive design with gym introduction, services, pricing plans, and contact information
- **Authentication System**: Secure login/signup with email/password and Google OAuth support
- **Role-Based Access Control**: Admin, Staff, and Member roles with appropriate permissions
- **Dashboard**: Overview statistics and quick actions for gym management
- **Member Management**: Complete CRUD operations for gym members
- **Attendance Tracking**: Check-in/check-out system with real-time tracking
- **Membership Plans**: Flexible pricing plans (Monthly, Quarterly, Yearly)
- **Payment Management**: Track payment status and manage dues
- **Announcements**: Post and manage gym announcements
- **Responsive Design**: Mobile-friendly interface with modern UI/UX

### Technical Features
- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Prisma ORM** with PostgreSQL
- **NextAuth.js** for authentication
- **TailwindCSS** for styling
- **shadcn/ui** components
- **Server Actions** and API routes
- **Real-time updates**

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd gym-management
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/muscle_fitness"

   # NextAuth
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here"

   # Google OAuth (optional)
   GOOGLE_CLIENT_ID=""
   GOOGLE_CLIENT_SECRET=""
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npx prisma generate

   # Run database migrations
   npx prisma migrate dev

   # Seed the database with sample data
   npm run db:seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 👤 Default Users

After running the seed script, you'll have these default users:

- **Admin User**
  - Email: `admin@musclefitness.com`
  - Password: `admin123`

- **Staff User**
  - Email: `staff@musclefitness.com`
  - Password: `staff123`

## 📁 Project Structure

```
gym-management/
├── app/
│   ├── api/                    # API routes
│   │   ├── auth/              # Authentication endpoints
│   │   ├── dashboard/         # Dashboard API
│   │   ├── members/           # Member management API
│   │   ├── attendance/        # Attendance tracking API
│   │   └── plans/             # Membership plans API
│   ├── auth/                  # Authentication pages
│   │   ├── signin/           # Sign in page
│   │   └── signup/           # Sign up page
│   ├── dashboard/             # Dashboard pages
│   │   ├── members/          # Member management
│   │   ├── attendance/       # Attendance tracking
│   │   ├── plans/            # Plans & payments
│   │   └── announcements/    # Announcements
│   ├── components/           # Reusable components
│   │   ├── ui/              # shadcn/ui components
│   │   ├── dashboard/       # Dashboard components
│   │   └── forms/           # Form components
│   └── lib/                 # Utility functions
│       ├── auth.ts          # NextAuth configuration
│       ├── db.ts            # Prisma client
│       └── utils.ts         # Utility functions
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── seed.ts             # Database seed script
└── public/                 # Static assets
```

## 🗄️ Database Schema

The application uses the following main entities:

- **Users**: Admin, Staff, and Member accounts
- **Members**: Gym member profiles with personal and membership information
- **MembershipPlans**: Different pricing tiers and durations
- **Attendance**: Check-in/check-out records
- **Payments**: Payment tracking and status
- **Announcements**: Gym announcements and notices
- **WorkoutPlans**: Custom workout plans for members

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:seed` - Seed database with sample data

## 🎨 UI Components

The application uses a custom design system built with:
- **TailwindCSS** for utility-first styling
- **shadcn/ui** for pre-built components
- **Lucide React** for icons
- **Custom components** for gym-specific functionality

## 🔐 Authentication & Authorization

- **NextAuth.js** handles authentication
- **Role-based access control** (Admin, Staff, Member)
- **Secure password hashing** with bcrypt
- **Session management** with JWT tokens
- **Google OAuth** integration (optional)

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones
- All modern browsers

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set up environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms
The application can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues or have questions:
1. Check the documentation
2. Search existing issues
3. Create a new issue with detailed information

## 🔮 Future Enhancements

- [ ] Mobile app development
- [ ] Advanced analytics and reporting
- [ ] Integration with payment gateways
- [ ] Equipment management system
- [ ] Class scheduling and booking
- [ ] Member progress tracking
- [ ] Integration with fitness trackers
- [ ] Multi-location support

---

**Built with ❤️ for gym management**
