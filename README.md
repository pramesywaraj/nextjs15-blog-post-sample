# Modern Blog Platform

A complete, production-ready blog platform built with the latest technologies and comprehensive features:

- **Next.js 15** with App Router and React 19
- **TypeScript** for full type safety
- **Tailwind CSS** with **shadcn/ui** components
- **Prisma ORM** with PostgreSQL database
- **NextAuth.js v5** for secure authentication
- **Rich Markdown Editor** with live preview
- **Docker** containerization support
- **SEO Optimized** with dynamic sitemaps and structured data

## Features

### 🌐 Public Features
- ✅ **Modern Blog Homepage** with featured posts and categories
- ✅ **Blog Post Listings** with search and filtering
- ✅ **Individual Post Pages** with full content, reading time, and social sharing
- ✅ **Category Pages** for organized content browsing
- ✅ **Tag System** for content discovery
- ✅ **Responsive Design** optimized for all devices
- ✅ **Custom 404 Page** with helpful navigation
- ✅ **SEO Optimized** with meta tags, OpenGraph, and Twitter Cards

### 📊 Admin Dashboard Features
- ✅ **Secure Authentication** with register/login system
- ✅ **Dashboard Overview** with statistics and quick actions
- ✅ **Post Management** - Create, edit, delete, and publish posts
- ✅ **Rich Markdown Editor** with live preview and syntax highlighting
- ✅ **Category Management** - Full CRUD operations with post counting
- ✅ **Tag Management** - Lightweight tagging system with statistics
- ✅ **Draft/Publish Workflow** - Save drafts and publish when ready
- ✅ **Content Organization** - Many-to-many relationships between posts, categories, and tags
- ✅ **Modern Sidebar Navigation** with intuitive UX

### 🔧 Technical Features
- ✅ **Docker Support** with complete containerization setup
- ✅ **Database Migrations** with Prisma schema management
- ✅ **API Routes** with proper authentication and validation
- ✅ **Form Validation** using Zod schemas
- ✅ **Error Handling** with user-friendly messages
- ✅ **Loading States** and optimistic updates
- ✅ **Type Safety** throughout the entire application

### 🚀 SEO & Performance
- ✅ **Dynamic Sitemap** generation (`/sitemap.xml`)
- ✅ **Robots.txt** for search engine directives
- ✅ **Structured Data** (JSON-LD) for rich snippets
- ✅ **Meta Tags** with OpenGraph and Twitter Cards
- ✅ **Reading Time Estimation** for blog posts
- ✅ **Clean URLs** with slug-based routing
- ✅ **Mobile-First Design** with responsive layouts

## Prerequisites

Before running this application, make sure you have:

- **Node.js 18+** installed
- **PostgreSQL database** running (or use Docker)
- **npm or yarn** package manager
- **Docker & Docker Compose** (optional, for containerized setup)

## Quick Start Options

### Option 1: Docker Setup (Recommended)

1. Clone the repository
2. Copy environment file:
   ```bash
   cp .env.example .env
   ```
3. Start with Docker:
   ```bash
   npm run docker:dev
   ```
4. Visit [http://localhost:3000](http://localhost:3000)

### Option 2: Local Development

## Environment Setup

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://admin:password@localhost:5432/company-01"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here-change-in-production"
NEXTAUTH_URL="http://localhost:3000"
AUTH_TRUST_HOST=true

# Optional: For production
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
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

## Installation (Local Development)

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up the database (see Database Setup section above)

4. Run database migrations:
   ```bash
   npm run db:migrate
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Docker Commands

```bash
# Start development environment
npm run docker:dev

# Build and start production
npm run docker:build
npm run docker:start

# Stop containers
npm run docker:stop

# View logs
npm run docker:logs

# Clean up
npm run docker:clean
```

## Usage

### 🔐 Getting Started

1. **Create Admin Account**: Visit `/auth/signup` to create your first admin account
2. **Sign In**: Access the dashboard at `/auth/signin`
3. **Set Up Content**: Create categories and tags before writing posts
4. **Create Posts**: Use the rich markdown editor to write your first blog post

### 📝 Content Management

#### Posts Management (`/dashboard/posts`)
- **Create New Posts**: Rich markdown editor with live preview
- **Draft System**: Save drafts and publish when ready  
- **Content Organization**: Assign multiple categories and tags
- **SEO Optimization**: Auto-generated slugs and meta descriptions
- **Bulk Actions**: Filter, search, and manage posts efficiently

#### Categories Management (`/dashboard/categories`)
- **Hierarchical Organization**: Create and manage content categories
- **Post Counting**: See how many posts are in each category
- **SEO Friendly**: Auto-generated slugs for category pages
- **Bulk Operations**: Create, edit, and delete categories

#### Tags Management (`/dashboard/tags`)
- **Flexible Tagging**: Add descriptive tags to posts
- **Usage Statistics**: Track which tags are most popular
- **Quick Management**: Easy tag creation and editing

### 🌍 Public Features

#### Blog Experience
- **Homepage** (`/`): Modern landing page with featured content
- **Blog Listing** (`/blog`): All published posts with search and filtering
- **Post Pages** (`/blog/[slug]`): Full articles with reading time and social sharing
- **Category Pages** (`/blog/category/[slug]`): Posts filtered by category
- **SEO Features**: Dynamic sitemaps, structured data, and meta tags

#### Navigation & Discovery
- **Search Functionality**: Find posts by title and content
- **Category Filtering**: Browse posts by topic
- **Tag System**: Discover related content
- **Responsive Design**: Perfect experience on all devices

## Project Structure

```
├── app/                      # Next.js 15 App Router
│   ├── auth/                # Authentication pages (signin/signup)
│   ├── blog/                # Public blog pages
│   │   ├── [slug]/          # Individual blog post pages
│   │   └── category/[slug]/ # Category listing pages
│   ├── dashboard/           # Admin dashboard
│   │   ├── posts/           # Post management
│   │   ├── categories/      # Category management
│   │   └── tags/            # Tag management
│   ├── api/                 # API routes
│   │   ├── auth/            # Authentication endpoints
│   │   └── admin/           # Protected admin endpoints
│   ├── sitemap.ts           # Dynamic sitemap generation
│   ├── robots.ts            # Search engine directives
│   └── not-found.tsx        # Custom 404 page
├── components/              # Reusable React components
│   ├── ui/                  # shadcn/ui base components
│   ├── dashboard/           # Dashboard-specific components
│   └── blog/                # Blog-specific components
├── lib/                     # Utility libraries and configurations
│   ├── prisma.ts           # Database client
│   ├── auth.ts             # NextAuth configuration
│   └── validations.ts      # Zod validation schemas
├── prisma/                  # Database schema and migrations
│   ├── schema.prisma       # Database schema
│   └── migrations/         # Database migration files
├── docker/                  # Docker configuration
│   └── startup.sh          # Container startup script
├── docker-compose.yml       # Multi-container setup
├── Dockerfile              # Application container
└── DOCKER.md               # Docker deployment guide
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

### Authentication
- `POST /api/auth/signup` - User registration
- `GET|POST /api/auth/[...nextauth]` - NextAuth.js authentication

### Posts Management
- `GET /api/admin/posts` - List all posts
- `POST /api/admin/posts` - Create new post
- `GET /api/admin/posts/[id]` - Get specific post
- `PATCH /api/admin/posts/[id]` - Update post
- `DELETE /api/admin/posts/[id]` - Delete post

### Categories Management
- `GET /api/admin/categories` - List all categories
- `POST /api/admin/categories` - Create new category
- `GET /api/admin/categories/[id]` - Get specific category
- `PATCH /api/admin/categories/[id]` - Update category
- `DELETE /api/admin/categories/[id]` - Delete category

### Tags Management
- `GET /api/admin/tags` - List all tags
- `POST /api/admin/tags` - Create new tag
- `GET /api/admin/tags/[id]` - Get specific tag
- `PATCH /api/admin/tags/[id]` - Update tag
- `DELETE /api/admin/tags/[id]` - Delete tag

### Public Endpoints
- `GET /sitemap.xml` - Dynamic sitemap for SEO
- `GET /robots.txt` - Search engine directives

## Security Features

- ✅ Secure password hashing with bcrypt
- ✅ JWT-based session management
- ✅ Protected API routes
- ✅ Input validation with Zod
- ✅ SQL injection protection with Prisma
- ✅ XSS protection with React
- ✅ CSRF protection with NextAuth.js

## Production Deployment

### Docker Deployment (Recommended)

1. **Build production image**:
   ```bash
   npm run docker:build
   ```

2. **Start production containers**:
   ```bash
   npm run docker:start
   ```

3. **Environment Variables**: Update your `.env` file with production values

### Manual Deployment

1. **Set up PostgreSQL database**
2. **Update environment variables** for production
3. **Install dependencies**:
   ```bash
   npm ci --only=production
   ```
4. **Run database migrations**:
   ```bash
   npm run db:deploy
   ```
5. **Build the application**:
   ```bash
   npm run build
   ```
6. **Start the application**:
   ```bash
   npm start
   ```

### Platform Deployment

- **Vercel**: Connect your repository and deploy automatically
- **AWS/GCP/Azure**: Use the Docker image with your container service
- **VPS**: Use Docker Compose for easy deployment

### Performance Tips

- ✅ **Database Connection Pooling**: Configured with Prisma
- ✅ **Image Optimization**: Next.js automatic optimization
- ✅ **Static Generation**: Blog pages are statically generated
- ✅ **CDN Ready**: Optimized for edge deployment

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
