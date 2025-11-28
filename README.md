# Frontend - React + TypeScript + Tailwind CSS

This is the frontend application built with React, TypeScript, Tailwind CSS, React Query, and React Router.

## Features

- **Users Table Page**: Displays paginated users (4 per page) with full name, email, and formatted address
- **User Posts Page**: Shows user details and all their posts with ability to create and delete posts
- **React Query**: Efficient data fetching, caching, and state management
- **Responsive Design**: Clean, modern UI built with Tailwind CSS
- **Error Handling**: Graceful handling of loading and error states

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS v4
- React Query (@tanstack/react-query)
- React Router
- Vitest (for testing)

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn
- Backend server running on port 3001

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or the next available port).

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Running Tests

```bash
npm test
```

Or with UI:
```bash
npm run test:ui
```

## Project Structure

```
src/
├── api/              # API client and service functions
├── components/       # Reusable React components
├── hooks/           # Custom React hooks
├── pages/           # Page components
├── types/           # TypeScript type definitions
└── test/            # Test setup files
```

## API Endpoints

The frontend expects the backend to be running on `http://localhost:3001` with the following endpoints:

- `GET /users?pageNumber={page}&pageSize={size}` - Get paginated users
- `GET /users/count` - Get total user count
- `GET /posts?userId={userId}` - Get posts for a user
- `POST /posts` - Create a new post
- `DELETE /posts/{postId}` - Delete a post

## Features Implementation

### Users Table
- Pagination with 4 users per page
- Click on a user row to navigate to their posts
- Address column with fixed width (392px) and text truncation
- Loading and error states

### User Posts
- Display user information and post count
- List all posts for the user
- Create new posts with a form
- Delete posts with optimistic updates
- Real-time UI updates without page refresh
