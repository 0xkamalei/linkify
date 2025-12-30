# Linkify

Linkify is a social link aggregation platform built with a modern tech stack.

## Architecture

- **Frontend:** React, TypeScript, Vite, TailwindCSS
- **Backend:** Hono (running on Bun), Firebase (Firestore for DB, Auth)
- **Deployment:** Vercel (planned/compatible)

## Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [Bun](https://bun.sh/) (for backend runtime)

## Getting Started

### 1. Installation

Install dependencies:

```bash
npm install
# or
bun install
```

### 2. Configuration

Copy the example environment file:

```bash
cp .env.example .env
```

Fill in your Firebase credentials in `.env`.

### 3. Development

To run both frontend and backend in development mode:

**Backend:**
```bash
npm run backend
```
The API server runs on port 3000 (default).

**Frontend:**
```bash
npm run dev
```
The frontend runs on port 5173 (default).

## Testing

Run unit and integration tests:

```bash
npm test
```

## Features

- **Links:** Submit and view links under topics.
- **Topics:** Categorized discussions.
- **Comments:** Discuss links.
- **Votes:** Upvote/downvote content.
- **Safety:** Sensitive word filtering (auto-moderation).

## License

MIT
