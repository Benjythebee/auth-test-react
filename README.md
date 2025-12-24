# Interactive Image Web App

A full-stack TypeScript application for creating interactive images with draggable triggers that can open links or modals.

## Features

- Upload images and create interactive hotspots
- Draggable zones and buttons on images
- Link and modal actions for interactive elements
- PostgreSQL database storage
- React frontend with Tailwind CSS and DaisyUI

## Tech Stack

**Frontend:**
- React 19 with TypeScript
- Vite for build tooling
- Tailwind CSS + DaisyUI for styling
- React Draggable for interactive elements

**Backend:**
- Express.js server
- Multer for file uploads
- PostgreSQL database
- Vite-Express for SSR integration

## Setup

1. Install dependencies:
```bash
pnpm install
```

2. Set up PostgreSQL database and run migration:
```sql
-- See src/server/lib/migration.sql
```

3. Configure environment variables in `.env`

4. Start development server:
```bash
pnpm dev
```

5. Build for production:
```bash
pnpm build
pnpm start
```

## Project Structure

```
src/
├── client/          # React frontend
│   ├── components/  # React components
│   └── context/     # React context providers
├── server/          # Express backend
│   └── lib/         # Database and utilities
└── common/          # Shared types and APIs
```