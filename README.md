# Modern Blog Platform

A modern, production-ready blog platform built with the latest technologies:

- **Next.js 15** with App Router
- **React 19** with hooks
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **shadcn/ui** for beautiful components
- **Prisma ORM** with PostgreSQL database
- **NextAuth.js v5** for authentication
- **Zod** for form validation

## Features

### Public Features
- ✅ Modern, responsive blog homepage
- ✅ Blog post listing and individual post pages
- ✅ Category and tag filtering
- ✅ SEO-optimized with proper metadata
- ✅ Beautiful design with modern UI components

### Admin Dashboard Features
- ✅ Secure authentication with register/login
- ✅ Dashboard overview with statistics
- ✅ Create, edit, and delete blog posts
- ✅ Manage categories and tags
- ✅ Draft and publish functionality
- ✅ Rich text content editing
- ✅ Modern sidebar navigation

## Prerequisites

Before running this application, make sure you have:

- Node.js 18+ installed
- PostgreSQL database running
- npm or yarn package manager

## Environment Setup

Create a `.env.local` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://admin:password@localhost:5432/company-01"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here-change-in-production"
NEXTAUTH_URL="http://localhost:3000"
```

## Database Setup

1. Make sure your PostgreSQL server is running
2. Create the database:
   ```sql
   CREATE DATABASE "company-01";
   CREATE USER admin WITH PASSWORD 'password';
   GRANT ALL PRIVILEGES ON DATABASE "company-01" TO admin;
   ```

3. Run the database migration:
   ```bash
   npx prisma migrate dev --name init
   ```

4. Generate the Prisma client:
   ```bash
   npx prisma generate
   ```

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up the database (see Database Setup section above)

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Creating an Admin Account

1. Visit `/auth/signup` to create an admin account
2. Fill in your details and submit the form
3. All registered users are automatically given admin privileges
4. Sign in at `/auth/signin` with your credentials

### Managing Content

- **Dashboard**: Access at `/dashboard` after signing in
- **Posts**: Create, edit, and manage blog posts
- **Categories**: Organize content with categories
- **Tags**: Add tags for better content discovery
- **Publishing**: Toggle between draft and published states

### Public Blog

- **Homepage**: Shows recent blog posts and site overview
- **Blog Listing**: View all published posts at `/blog`
- **Individual Posts**: Read full posts at `/blog/[slug]`
- **Categories/Tags**: Filter content by categories and tags

## Project Structure

```
├── app/                      # Next.js App Router
│   ├── auth/                # Authentication pages
│   ├── blog/                # Public blog pages
│   ├── dashboard/           # Admin dashboard
│   └── api/                 # API routes
├── components/              # Reusable components
│   ├── ui/                  # shadcn/ui components
│   └── dashboard/           # Dashboard-specific components
├── lib/                     # Utility libraries
├── prisma/                  # Database schema and migrations
└── types/                   # TypeScript type definitions
```

## Key Technologies

### Frontend
- **Next.js 15**: Latest React framework with App Router
- **React 19**: Latest React with new hooks and features
- **TypeScript**: Full type safety
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Beautiful, accessible UI components

### Backend
- **Prisma ORM**: Type-safe database operations
- **PostgreSQL**: Robust relational database
- **NextAuth.js v5**: Secure authentication
- **Zod**: Runtime type validation

### Development
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **TypeScript**: Static type checking

## API Endpoints

- `POST /api/auth/signup` - User registration
- `GET|POST /api/auth/[...nextauth]` - NextAuth.js authentication
- `GET|POST|PUT|DELETE /api/posts/*` - Post management
- `GET|POST|PUT|DELETE /api/categories/*` - Category management
- `GET|POST|PUT|DELETE /api/tags/*` - Tag management

## Security Features

- ✅ Secure password hashing with bcrypt
- ✅ JWT-based session management
- ✅ Protected API routes
- ✅ Input validation with Zod
- ✅ SQL injection protection with Prisma
- ✅ XSS protection with React
- ✅ CSRF protection with NextAuth.js

## Production Deployment

1. Set up a PostgreSQL database
2. Update environment variables for production
3. Build the application:
   ```bash
   npm run build
   ```
4. Deploy to your preferred platform (Vercel, AWS, etc.)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please create an issue in the repository or contact the development team.

---

Built with ❤️ using modern web technologies for a fast, secure, and beautiful blogging experience.
