<h1 align="left">
  <img src="public/logo_transparent.png" alt="CampusFlow Teacher" height="40" "/>
  CampusFlow Teacher
</h1>

A modern, comprehensive teacher portal designed to streamline academic management with intuitive course administration, attendance tracking, and notes and assignments creation features. Built with Next.js and featuring a sleek dark theme with glassmorphism design elements.

## ✨ Features

### 🎯 Core Features
- **Teacher Dashboard** - Personalized teacher dashboard with upcoming sessions and teaching statistics
- **Subject Management** - Manage assigned subjects with detailed information and student enrollment
- **Session Management** - Create, schedule, and manage class sessions with date, time, and subject details
- **Assignment Creation** - Create and manage assignments with file upload capabilities using EdgeStore integration
- **Attendance Management** - Mark and track student attendance with calendar view and analytics
- **Notes Management** - Upload, organize, and share course materials and notes with students
- **Student Monitoring** - View student profiles, submissions, and academic progress
- **Profile Management** - Edit teacher details and profile information

### 🔐 Authentication & Security
- **NextAuth Integration** - Secure authentication with email/password
- **Session Management** - Persistent login sessions with automatic redirects
- **Role-based Access** - Teacher-specific portal with administrative permissions

### 🎨 User Experience
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Dark Theme** - Modern dark interface with purple accent colors
- **Smooth Animations** - Framer Motion animations for enhanced UX
- **Glassmorphism UI** - Contemporary glass-effect components
- **Toast Notifications** - Real-time feedback with react-toastify

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15.3.1 (React 19.0.0)
- **Styling**: Tailwind CSS 4.1.4
- **Animations**: Framer Motion 12.6.3
- **Icons**: Lucide React 0.487.0
- **Notifications**: React Toastify 11.0.5
- **Charts**: Recharts 2.15.2
- **Date Handling**: Day.js 1.11.13

### Backend & Database
- **Database**: PostgreSQL with Prisma ORM 6.6.0
- **Authentication**: NextAuth.js 4.24.11
- **Password Hashing**: bcrypt 5.1.1
- **HTTP Client**: Axios 1.8.4

### File Storage & Tools
- **File Storage**: EdgeStore 0.3.3
- **Code Formatting**: Prettier 3.5.3
- **Development**: Next.js Dev Server


## 🚀 Installation & Setup

### Prerequisites
- Node.js 18+ and npm/yarn
- PostgreSQL database
- EdgeStore account for file storage

### 1. Clone the Repository
```bash
git clone https://github.com/sujalkyal/CampusFlow-Teacher.git
cd CampusFlow-Teacher
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Environment Configuration
Create a `.env` file in the root directory:
```bash
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXT_PUBLIC_BACKEND_URL=http://localhost:3000
EDGE_STORE_ACCESS_KEY=your_edge_store_access_key
EDGE_STORE_SECRET_KEY=your_edge_store_secret_key
DATABASE_URL=postgresql://username:password@localhost:5432/campusflow_teacher
```
Create a `.env` file in the db directory:
```bash
DATABASE_URL=postgresql://username:password@localhost:5432/campusflow_teacher
```

### 4. Database Setup
```bash
# Generate Prisma client
npx prisma generate --schema=./db/prisma/schema.prisma

# Run database migrations
cd db
npx prisma migrate dev
cd ..
```

### 5. Start Development Server
```bash
npm run dev
# or
yarn dev
```
Visit `http://localhost:3000` to see the application.

## 📱 Usage

### Getting Started
1. **Create Account**: Visit `/auth/signup` to register as a new teacher
2. **Login**: Access `/auth/signin` with your credentials
3. **Dashboard**: Upon login, you'll be redirected to the teacher dashboard
4. **Profile Setup**: Complete your teacher profile information in the dashboard

### Key Features Usage
- **Manage Subjects**: Access subject management to view and administer your assigned courses
- **Create Sessions**: Schedule new class sessions with date, time, and subject details
- **Create Assignments**: Design and publish assignments with file upload capabilities
- **Mark Attendance**: Use the attendance system to mark and track student presence
- **Upload Notes**: Share course materials and notes with your students
- **Monitor Students**: Track student progress, submissions, and academic performance

### Demo Credentials
Contact the administrator for demo teacher login credentials.


## 🌐 Deployment

### Vercel Deployment (Recommended)
1. **Connect Repository**: Link your GitHub repository to Vercel
2. **Environment Variables**: Set all required environment variables in Vercel dashboard
3. **Deploy**: Vercel will automatically build and deploy your application

### Manual Deployment
```bash
# Build the application
npm run build

# Start production server
npm start
```
**Live Demo**: [Deploy your own instance on Vercel](https://vercel.com/)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Sujal Kyal**
- GitHub: [@sujalkyal](https://github.com/sujalkyal)
- Full Project Repository: [CampusFlow](https://github.com/sujalkyal/CampusFlow.git)

## 📞 Contact

For questions, suggestions, or support:
- **Email**: sujalkyal.dev@gmail.com
- **Website**: [sujalkyal.dev.in](https://sujaldev-ten.vercel.app/)

## 🙏 Acknowledgments

- **Next.js** team for the excellent framework
- **Vercel** for hosting and deployment platform
- **Prisma** for the powerful ORM
- **EdgeStore** for file storage solutions
- **Tailwind CSS** for the utility-first CSS framework

---

⭐ **Star this repository if you find it helpful!**