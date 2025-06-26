# Technical Implementation Roadmap 🛠️

## Immediate Fixes (This Week)

### 1. Fix Authentication System ⚡ **CRITICAL**

**Problem**: Currently using mock auth, causing runtime errors.

**Solution Steps**:
```bash
# 1. Set up Supabase project
npx supabase init
npx supabase start

# 2. Update environment variables
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

**Code Changes Needed**:

1. **Update `lib/api/auth.ts`** - Replace mock service with Supabase auth:
```typescript
// Replace existing AuthService with:
import { createClient } from '@/lib/supabase/client'

class AuthService {
  private supabase = createClient()

  async login(credentials: LoginCredentials) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    })
    
    if (error) throw error
    
    // Create/update profile
    await this.upsertProfile(data.user)
    
    return data
  }

  async signup(signupData: SignupData) {
    const { data, error } = await this.supabase.auth.signUp({
      email: signupData.email,
      password: signupData.password,
      options: {
        data: {
          name: signupData.name,
          user_type: signupData.userType,
        }
      }
    })
    
    if (error) throw error
    return data
  }

  onAuthStateChange(callback: (event: string, session: any) => void) {
    return this.supabase.auth.onAuthStateChange(callback)
  }

  private async upsertProfile(user: any) {
    const { error } = await this.supabase
      .from('profiles')
      .upsert({
        id: user.id,
        email: user.email,
        name: user.user_metadata.name,
        user_type: user.user_metadata.user_type,
        updated_at: new Date().toISOString(),
      })
    
    if (error) console.error('Profile upsert error:', error)
  }
}
```

2. **Update `lib/hooks/use-auth.ts`** - Restore the onAuthStateChange listener:
```typescript
useEffect(() => {
  if (dispatch) {
    dispatch(initializeAuth())

    // Listen to auth state changes
    const { data: { subscription } } = authService.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          const user = await authService.getCurrentUser()
          if (user) {
            dispatch(loginSuccess({
              user,
              token: session.access_token,
            }))
          }
        } else if (event === 'SIGNED_OUT') {
          dispatch(logout())
        }
      }
    )

    return () => {
      subscription?.unsubscribe()
    }
  }
}, [dispatch])
```

3. **Fix metadata configuration** - Add to `app/layout.tsx`:
```typescript
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NODE_ENV === 'production' 
    ? 'https://your-domain.com' 
    : 'http://localhost:3000'
  ),
  // ... rest of metadata
}
```

4. **Fix Redux-persist storage** - Update `lib/store/index.ts`:
```typescript
import createWebStorage from 'redux-persist/lib/storage/createWebStorage'

const createNoopStorage = () => {
  return {
    getItem(_key: string) {
      return Promise.resolve(null)
    },
    setItem(_key: string, value: any) {
      return Promise.resolve(value)
    },
    removeItem(_key: string) {
      return Promise.resolve()
    },
  }
}

const storage = typeof window !== 'undefined' 
  ? createWebStorage('local') 
  : createNoopStorage()
```

---

## Phase 1: Foundation (Week 1-2)

### 2. GitHub Integration 🔧

**Goal**: Auto-populate developer skills from GitHub data.

**Implementation Steps**:

1. **Add GitHub OAuth provider** to Supabase Dashboard
2. **Create GitHub auth flow**:

```typescript
// lib/api/github.ts
interface GitHubUser {
  login: string
  name: string
  email: string
  avatar_url: string
  bio: string
  location: string
  public_repos: number
  followers: number
}

interface Repository {
  name: string
  description: string
  language: string
  languages_url: string
  stargazers_count: number
  forks_count: number
}

class GitHubService {
  private async getAccessToken(): Promise<string> {
    const { data: { session } } = await supabase.auth.getSession()
    return session?.provider_token || ''
  }

  async getUserProfile(): Promise<GitHubUser> {
    const token = await this.getAccessToken()
    const response = await fetch('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.json()
  }

  async getUserRepositories(): Promise<Repository[]> {
    const token = await this.getAccessToken()
    const response = await fetch('https://api.github.com/user/repos?per_page=100', {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.json()
  }

  async getRepositoryLanguages(repo: Repository): Promise<Record<string, number>> {
    const token = await this.getAccessToken()
    const response = await fetch(repo.languages_url, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.json()
  }

  async analyzeSkills(repositories: Repository[]): Promise<string[]> {
    const languageStats: Record<string, number> = {}
    
    for (const repo of repositories.slice(0, 20)) { // Limit API calls
      try {
        const languages = await this.getRepositoryLanguages(repo)
        Object.entries(languages).forEach(([lang, bytes]) => {
          languageStats[lang] = (languageStats[lang] || 0) + bytes
        })
      } catch (error) {
        console.error(`Error fetching languages for ${repo.name}:`, error)
      }
    }

    // Convert to sorted skill list
    return Object.entries(languageStats)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([lang]) => lang)
  }
}
```

3. **Update onboarding flow** to include GitHub connection
4. **Create skill mapping** from GitHub languages to platform skills

### 3. Database Setup & Testing 🗄️

**Tasks**:
- [ ] Deploy Supabase project to production
- [ ] Run all migrations
- [ ] Set up proper environment variables
- [ ] Add seed data for skills table
- [ ] Test all CRUD operations
- [ ] Set up database backups

**Seed Data Script**:
```sql
-- Additional skills not covered in migration
INSERT INTO skills (name, category) VALUES
  ('WebGL', 'Graphics'),
  ('Three.js', 'Graphics'),
  ('D3.js', 'Data Visualization'),
  ('TensorFlow', 'AI/ML'),
  ('PyTorch', 'AI/ML'),
  ('Kubernetes', 'DevOps'),
  ('Solidity', 'Blockchain'),
  ('WebAssembly', 'Performance')
ON CONFLICT (name) DO NOTHING;
```

---

## Phase 2: Core Matching (Week 3-4)

### 4. Basic Matching Algorithm 🎯

**Implementation**:

```typescript
// lib/api/matching-algorithm.ts
interface MatchingCriteria {
  skills: string[]
  experience_min: number
  experience_max: number
  location?: string
  remote_ok: boolean
  salary_min?: number
  salary_max?: number
}

interface DeveloperProfile {
  id: string
  skills: string[]
  experience_years: number
  location: string
  salary_min?: number
  salary_max?: number
  availability: string
}

class MatchingAlgorithm {
  calculateMatchScore(
    developer: DeveloperProfile, 
    criteria: MatchingCriteria
  ): number {
    let score = 0
    let maxScore = 100

    // Skills match (40% weight)
    const skillIntersection = developer.skills.filter(skill => 
      criteria.skills.includes(skill)
    )
    const skillScore = (skillIntersection.length / criteria.skills.length) * 40
    score += skillScore

    // Experience match (20% weight)
    const experienceInRange = developer.experience_years >= criteria.experience_min && 
                             developer.experience_years <= criteria.experience_max
    if (experienceInRange) score += 20

    // Location match (15% weight)
    if (criteria.remote_ok || developer.location === criteria.location) {
      score += 15
    }

    // Salary alignment (15% weight)
    if (criteria.salary_min && criteria.salary_max && 
        developer.salary_min && developer.salary_max) {
      const salaryOverlap = Math.min(criteria.salary_max, developer.salary_max) - 
                           Math.max(criteria.salary_min, developer.salary_min)
      if (salaryOverlap > 0) score += 15
    } else {
      score += 15 // No salary conflict
    }

    // Availability bonus (10% weight)
    if (developer.availability === 'available') score += 10

    return Math.round(Math.min(score, 100))
  }

  async findMatches(
    criteria: MatchingCriteria, 
    limit: number = 20
  ): Promise<Array<DeveloperProfile & { matchScore: number }>> {
    const { data: developers } = await supabase
      .from('developer_profiles')
      .select(`
        *,
        profiles!inner(name, email, avatar_url),
        user_skills(skills(name))
      `)
      .eq('availability', 'available')

    if (!developers) return []

    const scoredDevelopers = developers
      .map(dev => ({
        ...dev,
        skills: dev.user_skills.map((us: any) => us.skills.name),
        matchScore: this.calculateMatchScore(dev, criteria)
      }))
      .filter(dev => dev.matchScore >= 50) // Minimum 50% match
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, limit)

    return scoredDevelopers
  }
}
```

### 5. Company Dashboard 🏢

**Key Components to Build**:

1. **Company Registration Flow**:
```typescript
// app/companies/signup/page.tsx
const CompanySignupPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    companyName: '',
    industry: '',
    companySize: '',
    website: '',
    description: ''
  })

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    // 1. Create auth user
    const { data: authData } = await authService.signup({
      ...formData,
      userType: 'company'
    })

    // 2. Create company profile
    await supabase
      .from('company_profiles')
      .insert({
        id: authData.user.id,
        company_name: formData.companyName,
        industry: formData.industry,
        company_size: formData.companySize,
        website_url: formData.website,
        description: formData.description
      })

    router.push('/companies/dashboard')
  }

  // Form UI here...
}
```

2. **Developer Discovery Interface**:
```typescript
// app/companies/discover/page.tsx
const DeveloperDiscoveryPage = () => {
  const [filters, setFilters] = useState({
    skills: [],
    experience_min: 1,
    experience_max: 10,
    location: '',
    remote_ok: true,
    salary_min: 50000,
    salary_max: 200000
  })

  const [developers, setDevelopers] = useState([])
  const [loading, setLoading] = useState(false)

  const searchDevelopers = async () => {
    setLoading(true)
    try {
      const algorithm = new MatchingAlgorithm()
      const matches = await algorithm.findMatches(filters)
      setDevelopers(matches)
    } catch (error) {
      toast.error('Failed to search developers')
    } finally {
      setLoading(false)
    }
  }

  const showInterest = async (developerId: string) => {
    try {
      await matchingService.createMatch({
        developerId,
        companyId: user.id,
        positionTitle: 'Software Engineer', // From form
        // ... other job details
      })
      toast.success('Interest sent to developer!')
    } catch (error) {
      toast.error('Failed to send interest')
    }
  }

  // UI with filters and developer cards...
}
```

### 6. Basic Communication System 💬

**Simple messaging between matched parties**:

```sql
-- Add to migration
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  match_id uuid REFERENCES matches(id) ON DELETE CASCADE,
  sender_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view messages for their matches"
  ON messages FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM matches 
      WHERE matches.id = match_id 
      AND (matches.developer_id = auth.uid() OR matches.company_id = auth.uid())
    )
  );
```

```typescript
// components/MatchCommunication.tsx
const MatchCommunication = ({ matchId }: { matchId: string }) => {
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')

  const sendMessage = async () => {
    if (!newMessage.trim()) return

    try {
      const { data } = await supabase
        .from('messages')
        .insert({
          match_id: matchId,
          sender_id: user.id,
          message: newMessage
        })
        .select()
        .single()

      setMessages(prev => [...prev, data])
      setNewMessage('')
    } catch (error) {
      toast.error('Failed to send message')
    }
  }

  // Real-time message subscription
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

  // Message UI here...
}
```

---

## Phase 3: Polish & Launch (Week 5-6)

### 7. Email Notifications 📧

**Integration with email service**:

```typescript
// lib/services/email.ts
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

class EmailService {
  async sendMatchNotification(
    developerEmail: string, 
    companyName: string, 
    position: string
  ) {
    await resend.emails.send({
      from: 'noreply@chosn.dev',
      to: developerEmail,
      subject: `${companyName} is interested in you!`,
      html: `
        <h2>Great news! You have a new match.</h2>
        <p><strong>${companyName}</strong> is interested in you for the <strong>${position}</strong> position.</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/matches" 
           style="background: #000; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
          View Match
        </a>
      `
    })
  }

  async sendWelcomeEmail(userEmail: string, userName: string, userType: string) {
    const template = userType === 'developer' ? 
      'Welcome to Chosn! Complete your profile to get discovered.' :
      'Welcome to Chosn! Start discovering top developer talent.'

    await resend.emails.send({
      from: 'welcome@chosn.dev',
      to: userEmail,
      subject: 'Welcome to Chosn!',
      html: template
    })
  }
}
```

### 8. Analytics & Monitoring 📊

**Basic analytics implementation**:

```typescript
// lib/services/analytics.ts
class AnalyticsService {
  async trackEvent(eventName: string, properties: Record<string, any>) {
    try {
      // Track to Supabase
      await supabase
        .from('analytics_events')
        .insert({
          user_id: properties.userId,
          event_type: eventName,
          event_data: properties
        })

      // Track to external service (PostHog, Mixpanel, etc.)
      if (typeof window !== 'undefined' && window.posthog) {
        window.posthog.capture(eventName, properties)
      }
    } catch (error) {
      console.error('Analytics error:', error)
    }
  }

  async trackUserSignup(user: any) {
    await this.trackEvent('user_signup', {
      userId: user.id,
      userType: user.user_type,
      timestamp: new Date().toISOString()
    })
  }

  async trackMatchCreated(matchId: string, developerId: string, companyId: string) {
    await this.trackEvent('match_created', {
      matchId,
      developerId,
      companyId,
      timestamp: new Date().toISOString()
    })
  }
}
```

---

## Critical Success Metrics 📈

**Week 1 Goals**:
- [ ] Authentication system working with real Supabase
- [ ] Basic GitHub integration connecting and parsing repos
- [ ] Developer profile creation flow complete

**Week 2 Goals**:
- [ ] Company registration and dashboard functional
- [ ] Basic matching algorithm returning scored results
- [ ] 10+ test users can complete full flow

**Week 3 Goals**:
- [ ] Messaging system working between matches
- [ ] Email notifications sending
- [ ] All critical user journeys tested

**Week 4 Goals**:
- [ ] Beta testing with 20 real users
- [ ] Performance optimized for production
- [ ] Basic analytics tracking implemented

---

## Environment Setup Checklist 🔧

```bash
# Required environment variables
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
RESEND_API_KEY=
NEXT_PUBLIC_APP_URL=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
```

**Deployment checklist**:
- [ ] Vercel/Netlify deployment configured
- [ ] Environment variables set in production
- [ ] Custom domain configured
- [ ] SSL certificate active
- [ ] Database backup schedule set
- [ ] Error monitoring (Sentry) configured
- [ ] Analytics (PostHog) integrated

This roadmap focuses on shipping a functional MVP quickly while maintaining code quality and user experience. Each phase builds on the previous one, allowing for early user feedback and iteration. 