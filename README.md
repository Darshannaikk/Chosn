# Chosn Platform

A modern talent matching platform connecting verified developers with top companies.

## 🚀 Quick Start

```bash
git clone <repo-url>
cd chosn
npm install
cp env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📁 Project Structure

```
chosn/
├── app/                    # Next.js App Router (Pages & API)
│   ├── auth/              # Authentication pages (/auth/login, /auth/signup)
│   ├── dashboard/         # Dashboard pages (/dashboard/*)
│   ├── pages/            # Main pages (/pages/developers, /pages/companies)
│   ├── api/              # API routes (/api/*)
│   ├── page.tsx          # Home page (/)
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Global styles
│
├── components/            # Reusable UI Components
│   ├── ui/               # Base components (buttons, inputs, cards)
│   ├── layout/           # Layout components (header, footer, sidebar)
│   └── features/         # Feature-specific components
│
├── lib/                  # Utilities & Business Logic
│   ├── api/              # API client functions
│   ├── hooks/            # Custom React hooks
│   ├── store/            # Redux/Zustand store
│   ├── validations/      # Zod schemas
│   └── utils.ts          # Helper functions
│
├── docs/                 # Documentation
│   ├── setup.md          # Setup guide
│   ├── api.md            # API documentation
│   └── deployment.md     # Deployment guide
│
├── tests/                # All Tests
│   ├── components/       # Component tests
│   ├── api/              # API tests
│   └── e2e/              # End-to-end tests
│
└── public/               # Static Assets
```

## 🛠️ Technology Stack

- **Framework**: Next.js 13+ (App Router)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth + GitHub OAuth
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: Redux Toolkit
- **Payments**: Stripe
- **Email**: Resend
- **Deployment**: Vercel

## 🔧 Development

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run test         # Run tests
npm run lint         # Lint code
npm run test:e2e     # Run end-to-end tests
```

## 📚 Documentation

- [Setup Guide](./docs/setup.md) - Complete setup instructions
- [API Documentation](./docs/api.md) - API endpoints and usage
- [Deployment Guide](./docs/deployment.md) - Production deployment

## 🚢 Deployment

The application is configured for deployment on:
- **Vercel** (recommended)
- **Railway**
- **Docker**

See [deployment guide](./docs/deployment.md) for detailed instructions.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is proprietary and confidential.