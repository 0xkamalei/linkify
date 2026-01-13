# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Linkify is a social link aggregation platform (similar to Reddit/Hacker News) where users can submit links under topics, comment on them, and vote. Built with React frontend and Hono backend, using Firebase for authentication and data storage.

## Development Commands

### Running the Application

```bash
# Run frontend and backend concurrently (recommended for development)
bun run dev:all

# Run only frontend (port 5173)
bun run dev

# Run only backend API server (port 3000)
bun run backend
```

### Build and Quality

```bash
# Build for production
bun run build

# Run linter
bun run lint

# Run tests
bun test

# Preview production build
bun run preview
```

## Architecture

### Project Structure

```
/src/                  # React frontend (Vite + TypeScript)
  /components/         # Reusable UI components
  /contexts/           # React contexts (AuthContext for Firebase Auth)
  /layouts/            # Layout components (SiteLayout wraps all routes)
  /lib/                # Client-side Firebase initialization
  /pages/              # Route pages (HomePage, TopicPage, LinkDetailPage, etc.)
  /types/              # TypeScript type definitions

/api/
  index.ts             # Hono app entry point, API route definitions

/server/
  /lib/                # Server-side Firebase Admin initialization
  /services/           # Business logic services (linkService, topicService, etc.)
```

### Frontend-Backend Communication

- **Development**: Frontend dev server (Vite on :5173) proxies `/api/*` requests to backend (:3000)
  - Configured in vite.config.ts
- **Production**: Vercel routing configuration (`vercel.json`) routes `/api/*` to `/api/index.ts`

### Firebase Setup

The application uses Firebase in two contexts:

1. **Client-side** (`src/lib/firebaseClient.ts`): Firebase SDK for authentication and client operations
   - Environment variables: `VITE_FIREBASE_*`
   - Used by AuthContext for user authentication

2. **Server-side** (`server/lib/firebaseAdmin.ts`): Firebase Admin SDK for secure backend operations
   - Environment variables: `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`
   - Used by all services for Firestore database operations

### Data Model

Core entities defined in `src/types/index.ts`:

- **Topic**: Categories for organizing links (has shortCode for URLs)
- **Link**: User-submitted URLs with title, description, votes (agree/disagree), and score
- **Comment**: Discussions on links with voting capabilities

All entities use Firestore timestamps for `createTime` and `updateTime`.

### Service Layer Pattern

Backend logic is organized into services (`server/services/`):

- `linkService.ts`: CRUD operations for links, includes automatic content sanitization
- `topicService.ts`: Topic management and retrieval
- `commentService.ts`: Comment CRUD operations
- `voteService.ts`: Handles voting logic for links and comments
- `sensitiveService.ts`: Content moderation using mint-filter library
  - Auto-loads sensitive word dictionaries on initialization
  - Filters user-generated content (titles, descriptions, comments)

### Routing

React Router v7 routes (defined in `src/App.tsx`):

- `/` - Home page
- `/t/:topicId` - Topic page with links
- `/links/:id` - Individual link detail with comments
- `/share` - Submit new link
- `/recent` - Recent links across all topics
- `/account` - User account settings
- `/space/:userId` - User profile/space
- `/login`, `/register` - Authentication pages

All routes wrapped in `<SiteLayout>` and `<AuthProvider>`.

### Authentication Flow

- Uses Firebase Authentication (email/password)
- `AuthContext` (`src/contexts/AuthContext.tsx`) provides:
  - `user`: Current authenticated user
  - `loading`: Auth state loading status
  - `signIn`, `signUp`, `logout`: Auth methods
- All pages can access auth state via `useAuth()` hook
- AuthProvider blocks rendering until auth state is determined

### Content Moderation

All user-submitted text goes through `sensitiveService`:
- `safeUserText()`: Replaces sensitive words with asterisks
- `isAllowText()`: Checks if text contains sensitive content
- Applied automatically in linkService and commentService before saving

## Environment Configuration

Copy `.env.example` to `.env` and configure:

- Firebase Admin credentials (server-side)
- Firebase client config (prefixed with `VITE_` for frontend access)

## Testing

Tests use Vitest with jsdom environment. Service tests are in `server/services/*.test.ts`.

## Deployment

Configured for Vercel deployment:
- Frontend builds to static files via Vite
- Backend runs as Vercel serverless functions (Hono handles HTTP methods)
- `vercel.json` configures API routing
