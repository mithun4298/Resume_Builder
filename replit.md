# ResumeAI - AI-Powered Resume Builder

## Overview

ResumeAI is a modern, full-stack web application that helps users create professional resumes with AI assistance. The application features real-time collaboration, ATS-friendly templates, AI-powered content generation, and PDF export capabilities. Built with a React frontend, Express backend, and PostgreSQL database using modern web technologies.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized production builds
- **UI Framework**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design system variables
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query for server state management
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Authentication**: Replit Auth with OpenID Connect integration
- **Session Management**: Express sessions with PostgreSQL store
- **API Design**: RESTful endpoints with proper error handling
- **Development**: Hot reload with tsx for development server

### Database Architecture
- **Database**: PostgreSQL (configured for Neon serverless)
- **ORM**: Drizzle ORM with type-safe queries
- **Schema Management**: Drizzle Kit for migrations
- **Connection**: Connection pooling with @neondatabase/serverless

## Key Components

### Authentication System
- **Provider**: Replit Auth with OAuth2/OpenID Connect
- **Session Storage**: PostgreSQL-backed sessions using connect-pg-simple
- **User Management**: Automatic user creation and profile synchronization
- **Security**: HTTP-only cookies with secure session management

### Resume Management
- **Data Structure**: JSON-based resume data with TypeScript interfaces
- **Templates**: Modular template system supporting multiple layouts
- **Real-time Editing**: Live preview with automatic saving
- **Version Control**: Timestamped updates with created/modified tracking

### AI Integration
- **Provider**: OpenAI GPT-4o for content generation
- **Features**: 
  - Professional summary generation based on experience and skills
  - Bullet point generation for job descriptions
  - ATS optimization suggestions
- **Error Handling**: Graceful fallbacks when AI services are unavailable

### PDF Generation
- **Engine**: Puppeteer for server-side PDF rendering
- **Templates**: HTML/CSS templates for professional formatting
- **Styling**: Responsive design optimized for print media
- **Performance**: On-demand generation with potential for caching

## Data Flow

### User Authentication Flow
1. User accesses protected route
2. Middleware checks session validity
3. Redirects to Replit Auth if unauthenticated
4. OAuth callback creates/updates user record
5. Session established with encrypted cookies

### Resume Creation/Editing Flow
1. User creates new resume or loads existing
2. Frontend fetches resume data via API
3. Real-time editing updates local state
4. Debounced auto-save to backend
5. Changes persisted to PostgreSQL
6. Live preview updated instantly

### AI Content Generation Flow
1. User requests AI assistance
2. Frontend sends context (experience, skills, job title)
3. Backend formats prompt for OpenAI API
4. AI response processed and validated
5. Generated content returned to frontend
6. User can accept, modify, or regenerate

### PDF Export Flow
1. User requests PDF download
2. Backend generates HTML from resume data
3. Puppeteer renders HTML to PDF
4. PDF returned as downloadable file
5. Optional: PDF cached for performance

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL connection and pooling
- **drizzle-orm**: Type-safe database queries and schema management
- **@tanstack/react-query**: Server state management and caching
- **@radix-ui/**: Accessible UI component primitives
- **wouter**: Lightweight React routing
- **openai**: AI content generation API client

### Development Dependencies
- **vite**: Build tool and development server
- **tsx**: TypeScript execution for Node.js
- **tailwindcss**: Utility-first CSS framework
- **zod**: Runtime type validation
- **puppeteer**: Headless browser for PDF generation

### Authentication Dependencies
- **openid-client**: OpenID Connect client implementation
- **passport**: Authentication middleware
- **express-session**: Session management
- **connect-pg-simple**: PostgreSQL session store

## Deployment Strategy

### Development Environment
- **Local Development**: Vite dev server with Express backend
- **Hot Reload**: Frontend and backend hot reloading
- **Database**: Local PostgreSQL or cloud development instance
- **Environment Variables**: DATABASE_URL, OPENAI_API_KEY, SESSION_SECRET

### Production Build
- **Frontend**: Vite production build with optimized assets
- **Backend**: ESBuild compilation to single Node.js file
- **Static Assets**: Served by Express with proper caching headers
- **Database**: Production PostgreSQL with connection pooling

### Environment Configuration
- **Required Variables**:
  - `DATABASE_URL`: PostgreSQL connection string
  - `SESSION_SECRET`: Session encryption key
  - `OPENAI_API_KEY`: OpenAI API access token
  - `REPL_ID`: Replit environment identifier
- **Optional Variables**:
  - `NODE_ENV`: Environment mode (development/production)
  - `ISSUER_URL`: Custom OIDC issuer URL

### Scalability Considerations
- **Database**: Connection pooling for concurrent users
- **Sessions**: PostgreSQL-backed for horizontal scaling
- **Static Assets**: CDN-ready with proper cache headers
- **API Rate Limiting**: Prepared for rate limiting implementation
- **Error Monitoring**: Structured logging for production debugging