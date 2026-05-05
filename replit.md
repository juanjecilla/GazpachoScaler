# Overview

This is a full-stack TypeScript web application for a gazpacho recipe calculator. The app provides an interactive interface for calculating ingredient proportions for the traditional Andalusian gazpacho recipe, supporting both original proportions and custom adjustments. It features multilingual support, recipe sharing capabilities, and community engagement through a counter tracking how many people have made the recipe.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

- **Framework**: React 18 with TypeScript using Vite for development and build tooling
- **UI Components**: Shadcn/ui component library built on Radix UI primitives with Tailwind CSS for styling
- **Routing**: Wouter for client-side routing (lightweight React router alternative)
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Styling**: Tailwind CSS with custom CSS variables for theming, supporting both light and dark modes
- **Custom Theme**: Parchment-inspired color scheme with warm, traditional colors

## Backend Architecture

- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with dedicated routes for gazpacho counter operations
- **Development Server**: Custom Vite integration for SSR-like development experience
- **Error Handling**: Centralized error middleware with structured JSON responses

## Data Storage Solutions

- **Primary Database**: PostgreSQL configured through Drizzle ORM
- **Schema Management**: Drizzle Kit for migrations and schema synchronization
- **Development Storage**: In-memory storage implementation for local development
- **Session Management**: Connect-pg-simple for PostgreSQL session storage

## Database Schema

- **Users Table**: Basic user authentication with username/password
- **Gazpacho Counter Table**: Community engagement tracking with timestamps
- **Validation**: Zod schemas for runtime type validation integrated with Drizzle

## Authentication and Authorization

- **Storage Interface**: Abstracted storage layer supporting both memory and database implementations
- **User Management**: Basic username/password authentication structure
- **Session Handling**: Express sessions with PostgreSQL backing store

## Key Features

- **Recipe Calculator**: Proportional ingredient scaling based on traditional gazpacho ratios
- **Multi-language Support**: i18n implementation with English, Spanish, French, and German
- **Recipe Modes**: Toggle between original proportions and custom ingredient adjustments
- **Community Features**: Global counter of people who have made the recipe
- **Export/Sharing**: Recipe export functionality with social sharing capabilities
- **Responsive Design**: Mobile-first responsive layout with theme switching

# External Dependencies

## Core Frontend Dependencies

- **React Ecosystem**: React 18, React DOM, React Hook Form with Zod resolvers
- **UI Framework**: Radix UI primitives for accessible components
- **Styling**: Tailwind CSS with PostCSS and Autoprefixer
- **State Management**: TanStack React Query for server state
- **Routing**: Wouter for lightweight client-side routing
- **Utilities**: clsx, class-variance-authority for conditional styling

## Backend Dependencies

- **Server Framework**: Express.js with TypeScript support
- **Database**: Drizzle ORM with PostgreSQL dialect, Neon Database serverless driver
- **Development**: tsx for TypeScript execution, esbuild for production builds
- **Session Management**: express-session with connect-pg-simple

## Development Tools

- **Build System**: Vite with React plugin and custom Replit integration
- **TypeScript**: Configured for strict mode with path mapping
- **Database Tooling**: Drizzle Kit for schema management and migrations
- **Replit Integration**: Custom cartographer plugin and runtime error modal

## External Services

- **Database Hosting**: Configured for Neon Database (PostgreSQL-compatible serverless)
- **Font Loading**: Google Fonts integration (Playfair Display, Inter, Crimson Text)
- **Development Environment**: Replit-specific tooling and banner integration
