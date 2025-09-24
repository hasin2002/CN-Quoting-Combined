# Connected Networks - Combined Application

## Overview

This is the combined application that merges the CN Quoting API (backend) and CN Quoting FE (frontend) into a single Next.js application.

## Architecture

### API Routes

- **`/api/quote-retail`** - Frontend API route that provides customer-facing quotes with margin calculations
- **`/api/wholesale-pricing`** - Backend API route that provides raw wholesale pricing data
- **`/api/addresses`** - Address lookup and validation services

### Key Features

- **Multi-step Quote Form**: Address → Service Type → Network Config → Security → User Info → Quote
- **Margin Calculations**: 10% overhead + 45% margin applied server-side
- **Address Lookup**: Real-time address validation
- **Security Pricing**: Optional security services pricing
- **Responsive Design**: Modern UI with Tailwind CSS and Radix UI

## Technology Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Backend**: Hono (for API routes)
- **Database**: PostgreSQL with Prisma ORM
- **Caching**: Redis
- **External APIs**: BT, Colt, Zoho

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Redis instance

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your database and API credentials
   ```

4. Set up the database:
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:3000`.

## API Documentation

When running locally, API documentation is available at:
- `http://localhost:3000/api/reference` - OpenAPI documentation

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── quote-retail/          # Customer-facing quotes with margins
│   │   ├── wholesale-pricing/     # Raw wholesale pricing
│   │   └── addresses/             # Address lookup
│   ├── (pages)/                   # Frontend pages
│   └── layout.tsx                 # Root layout
├── components/                    # React components
├── hooks/                        # Custom React hooks
├── lib/                          # Utility functions
├── src/
│   └── app/
│       ├── lib/                  # Backend utilities and schemas
│       └── routes/               # Backend route definitions
├── types/                        # TypeScript type definitions
└── prisma/                       # Database schema and migrations
```

## Development

### Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm test` - Run tests

### Database

- `npx prisma studio` - Open Prisma Studio
- `npx prisma migrate dev` - Create and apply migrations
- `npx prisma generate` - Generate Prisma client

## Deployment

The application is configured for deployment on Vercel. The `vercel.json` file contains the deployment configuration.

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

Private - Connected Networks
