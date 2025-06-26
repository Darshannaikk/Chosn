# Technical Implementation Roadmap 🛠️

## Immediate Fixes (This Week)

### 1. Fix Authentication System ⚡ **CRITICAL**

**Problem**: Currently using mock auth, causing runtime errors.

**Solution**: Replace mock AuthService with real Supabase auth

```typescript
// Update lib/api/auth.ts
import { createClient } from '@/lib/supabase/client'

class AuthService {
  private supabase = createClient()

  async login(credentials: LoginCredentials) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    })
    
    if (error) throw error
    await this.upsertProfile(data.user)
    return data
  }

  onAuthStateChange(callback: (event: string, session: any) => void) {
    return this.supabase.auth.onAuthStateChange(callback)
  }
}
```

### 2. Fix Next.js Warnings

**Add metadataBase to app/layout.tsx:**
```typescript
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NODE_ENV === 'production' 
    ? 'https://your-domain.com' 
    : 'http://localhost:3000'
  ),
  // ... rest of metadata
}
```

**Fix Redux-persist storage in lib/store/index.ts:**
```typescript
const createNoopStorage = () => ({
  getItem: () => Promise.resolve(null),
  setItem: () => Promise.resolve(),
  removeItem: () => Promise.resolve(),
})

const storage = typeof window !== 'undefined' 
  ? require('redux-persist/lib/storage').default
  : createNoopStorage()
```

---

## Phase 1: Foundation (Week 1-2)

### GitHub Integration Implementation

**Goal**: Auto-populate skills from GitHub data

```typescript
// lib/services/github.ts
class GitHubService {
  async analyzeSkills(repositories: Repository[]): Promise<string[]> {
    const languageStats: Record<string, number> = {}
    
    for (const repo of repositories.slice(0, 20)) {
      try {
        const languages = await this.getRepositoryLanguages(repo)
        Object.entries(languages).forEach(([lang, bytes]) => {
          languageStats[lang] = (languageStats[lang] || 0) + bytes
        })
      } catch (error) {
        console.error(`Error fetching languages for ${repo.name}:`, error)
      }
    }

    return Object.entries(languageStats)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([lang]) => lang)
  }
}
```

---

## Phase 2: Core Matching (Week 3-4)

### Basic Matching Algorithm

```typescript
// lib/services/matching.ts
class MatchingAlgorithm {
  calculateMatchScore(developer: DeveloperProfile, criteria: MatchingCriteria): number {
    let score = 0

    // Skills match (40% weight)
    const skillIntersection = developer.skills.filter(skill => 
      criteria.skills.includes(skill)
    )
    score += (skillIntersection.length / criteria.skills.length) * 40

    // Experience match (20% weight)
    if (developer.experience_years >= criteria.experience_min && 
        developer.experience_years <= criteria.experience_max) {
      score += 20
    }

    // Location match (15% weight)
    if (criteria.remote_ok || developer.location === criteria.location) {
      score += 15
    }

    // Salary alignment (15% weight)
    if (this.salariesAlign(developer, criteria)) {
      score += 15
    }

    // Availability bonus (10% weight)
    if (developer.availability === 'available') score += 10

    return Math.round(Math.min(score, 100))
  }
}
```

### Company Dashboard Components

**Developer Discovery Interface:**
```typescript
// app/companies/discover/page.tsx
const DeveloperDiscoveryPage = () => {
  const searchDevelopers = async () => {
    const algorithm = new MatchingAlgorithm()
    const matches = await algorithm.findMatches(filters)
    setDevelopers(matches)
  }

  const showInterest = async (developerId: string) => {
    await matchingService.createMatch({
      developerId,
      companyId: user.id,
      positionTitle: jobDetails.title,
      // ... other details
    })
    toast.success('Interest sent!')
  }
}
```

---

## Phase 3: Communication & Polish (Week 5-6)

### Real-time Messaging System

```sql
-- Database schema for messages
CREATE TABLE messages (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  match_id uuid REFERENCES matches(id) ON DELETE CASCADE,
  sender_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);
```

```typescript
// Real-time messaging component
const MatchCommunication = ({ matchId }: { matchId: string }) => {
  useEffect(() => {
    const subscription = supabase
      .channel(`match-${matchId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `match_id=eq.${matchId}`
      }, (payload) => {
        setMessages(prev => [...prev, payload.new])
      })
      .subscribe()

    return () => subscription.unsubscribe()
  }, [matchId])
}
```

### Email Notifications

```typescript
// lib/services/email.ts
class EmailService {
  async sendMatchNotification(developerEmail: string, companyName: string) {
    await resend.emails.send({
      from: 'noreply@chosn.dev',
      to: developerEmail,
      subject: `${companyName} is interested in you!`,
      html: `
        <h2>Great news! You have a new match.</h2>
        <p><strong>${companyName}</strong> wants to connect with you.</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/matches">View Match</a>
      `
    })
  }
}
```

---

## Critical Milestones 🎯

**Week 1**: Auth fixed, GitHub integration working
**Week 2**: Matching algorithm deployed, company dashboard functional  
**Week 3**: Messaging system live, email notifications working
**Week 4**: Beta testing with 20 real users

---

## Environment Setup

```bash
# Required environment variables
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
RESEND_API_KEY=your-resend-key
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

This roadmap prioritizes shipping a functional MVP quickly while maintaining quality and user experience. 