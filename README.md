# Bala G Pet Clinic - Public Website

A modern, production-grade Next.js frontend for Bala G Pet Clinic featuring veterinary services and pet shop e-commerce.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Validation**: Zod

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm, yarn, or pnpm

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (public)/          # Public website routes
│   │   ├── page.tsx       # Homepage
│   │   └── layout.tsx     # Public layout with header/footer
│   ├── layout.tsx         # Root layout
│   ├── error.tsx          # Error boundary
│   ├── loading.tsx        # Loading state
│   ├── not-found.tsx      # 404 page
│   └── global-error.tsx   # Global error boundary
├── components/
│   ├── ui/                # Shared UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Container.tsx
│   │   ├── Input.tsx
│   │   └── ...
│   └── layout/            # Layout components
│       ├── Header/
│       └── Footer/
├── config/                # Configuration files
│   ├── site.ts           # Site configuration
│   ├── navigation.ts     # Navigation items
│   ├── seo.ts            # SEO configuration
│   └── env.ts            # Environment validation
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions
├── providers/             # React Context providers
├── services/              # API services
├── styles/               # Global styles
└── types/                # TypeScript type definitions
```

## Available Scripts

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run start     # Start production server
npm run lint      # Run ESLint
npm run lint:fix  # Fix ESLint errors
npm run type-check # Run TypeScript type checking
npm run format    # Format code with Prettier
```

## Environment Variables

Create a `.env.local` file with the following variables:

```env
NEXT_PUBLIC_SITE_URL=https://balagpetclinic.com
NEXT_PUBLIC_API_URL=https://api.balagpetclinic.com
NEXT_PUBLIC_GA_ID=your-ga-id
NEXT_PUBLIC_GOOGLE_MAPS_KEY=your-maps-key
```

## Features

- **SEO Optimized**: Built-in metadata, Open Graph, and structured data
- **Mobile-First**: Responsive design with Tailwind CSS
- **Dark Mode**: System preference detection and manual toggle
- **Type-Safe**: Strict TypeScript configuration
- **Performance**: Optimized images, fonts, and code splitting
- **Accessible**: WCAG compliant components

## License

Private - All rights reserved.
