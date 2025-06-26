# Chosn - Premium Developer Talent Marketplace

A modern platform connecting elite developers with industry-leading companies. Built with Next.js, Supabase, and TypeScript.

## Features

- **Elite Developer Profiles**: Comprehensive profiles with skills, projects, and experience
- **AI-Powered Matching**: Smart algorithms to connect developers with perfect opportunities
- **Real-time Analytics**: Detailed insights into profile performance and market trends
- **Secure Authentication**: Supabase-powered auth with role-based access control
- **Responsive Design**: Beautiful, accessible UI that works on all devices

## Tech Stack

- **Frontend**: Next.js 13, React, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **State Management**: Redux Toolkit, React Query
- **UI Components**: Shadcn/ui, Radix UI
- **Animations**: Framer Motion
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/chosn-platform.git
cd chosn-platform
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

4. Update `.env.local` with your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

5. Set up the database:
   - Go to your Supabase dashboard
   - Navigate to the SQL Editor
   - Run the migration script from `supabase/migrations/create_initial_schema.sql`

6. Start the development server:
```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser

## Database Schema

The platform uses a comprehensive PostgreSQL schema with the following main tables:

- `profiles` - User profiles (developers and companies)
- `developer_profiles` - Extended developer information
- `company_profiles` - Extended company information
- `skills` - Master skills list
- `user_skills` - User-skill relationships
- `projects` - Developer portfolio projects
- `matches` - Job matches between developers and companies
- `match_responses` - Developer responses to matches
- `analytics_events` - User activity tracking

## API Endpoints

The platform provides several API services:

- **Authentication**: Login, signup, logout, session management
- **Profiles**: CRUD operations for developer and company profiles
- **Matching**: AI-powered job matching and response handling
- **Analytics**: Performance metrics and market insights

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@chosn.com or join our Discord community.