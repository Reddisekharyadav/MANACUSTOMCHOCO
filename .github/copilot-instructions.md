<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# MANACUSTOMCHOCO Project Instructions

This is a Next.js 15 TypeScript project for a custom chocolate wrapper gallery website with the following key features:

## Technology Stack
- Next.js 15 with App Router
- TypeScript
- Tailwind CSS for styling
- MongoDB for database
- Framer Motion for animations
- NextAuth for authentication
- Multer for file uploads

## Project Structure
- `/src/app` - Next.js App Router pages and API routes
- `/src/components` - Reusable React components
- `/src/lib` - Utility functions and database connections
- `/src/types` - TypeScript type definitions
- `/public/uploads` - Uploaded wrapper images

## Key Features
1. Interactive wrapper gallery with hover animations
2. Lightbox modal for full wrapper view
3. Like system for wrappers
4. Late-night specials (after 10 PM IST)
5. Admin dashboard for content management
6. Image upload and scheduling system

## Database Collections
- `admins` - Admin user credentials
- `wrappers` - Wrapper data with images, names, prices, likes, and scheduling

## API Routes
- `/api/auth` - Authentication endpoints
- `/api/wrappers` - Wrapper CRUD operations
- `/api/upload` - Image upload handling
- `/api/like` - Like system

## Styling Guidelines
- Use Tailwind CSS classes
- Implement responsive design (mobile-first)
- Use warm colors reflecting chocolate theme
- Add smooth animations with Framer Motion
- Ensure accessibility standards

## Business Context
This is a startup project for custom chocolate wrappers, focusing on personalized birthday and celebration wrappers. The design should be impressive and professional to attract customers.
