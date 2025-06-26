import { createClient } from '@/lib/supabase/client';

// Types
interface MatchingCriteria {
  skills: string[];
  experienceMin: number;
  experienceMax: number;
  location?: string;
  remoteOk: boolean;
  salaryMin?: number;
  salaryMax?: number;
}

interface DeveloperProfile {
  id: string;
  name: string;
  avatar_url?: string;
  location?: string;
  experience_years: number;
  salary_min?: number;
  salary_max?: number;
  availability: string;
  skills: string[];
}

export interface ScoredDeveloper extends DeveloperProfile {
  matchScore: number;
}

// Simple skill-based matching algorithm
export class MatchingAlgorithm {
  private supabase = createClient();

  // Calculate numerical match score 0-100
  calculateMatchScore(dev: DeveloperProfile, criteria: MatchingCriteria): number {
    let score = 0;

    // Skills (40%)
    const skillOverlap = dev.skills.filter((s) => criteria.skills.includes(s));
    score += (skillOverlap.length / criteria.skills.length) * 40;

    // Experience (20%)
    if (
      dev.experience_years >= criteria.experienceMin &&
      dev.experience_years <= criteria.experienceMax
    ) {
      score += 20;
    }

    // Location (15%)
    if (criteria.remoteOk || dev.location === criteria.location) {
      score += 15;
    }

    // Salary (15%)
    if (
      criteria.salaryMin !== undefined &&
      criteria.salaryMax !== undefined &&
      dev.salary_min !== undefined &&
      dev.salary_max !== undefined
    ) {
      const overlap =
        Math.min(criteria.salaryMax, dev.salary_max) -
        Math.max(criteria.salaryMin, dev.salary_min);
      if (overlap > 0) score += 15;
    } else {
      score += 15; // assume fine
    }

    // Availability bonus (10%)
    if (dev.availability === 'available') score += 10;

    return Math.round(Math.min(score, 100));
  }

  // Fetch developers and return scored results
  async findMatches(criteria: MatchingCriteria, limit = 20): Promise<ScoredDeveloper[]> {
    const { data: devs } = await this.supabase
      .from('developer_profiles')
      .select(
        `id, bio, location, experience_years, availability, salary_min, salary_max, profiles(name, avatar_url), user_skills(skill_id, skills(name))`
      )
      .eq('availability', 'available');

    if (!devs) return [];

    // map to developer profile type
    const developers: DeveloperProfile[] = devs.map((d: any) => ({
      id: d.id,
      name: d.profiles.name,
      avatar_url: d.profiles.avatar_url,
      location: d.location,
      experience_years: d.experience_years,
      salary_min: d.salary_min,
      salary_max: d.salary_max,
      availability: d.availability,
      skills: d.user_skills.map((us: any) => us.skills.name),
    }));

    const scored = developers
      .map((dev) => ({ ...dev, matchScore: this.calculateMatchScore(dev, criteria) }))
      .filter((d) => d.matchScore >= 50)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, limit);

    return scored;
  }
}

export const matchingAlgorithm = new MatchingAlgorithm(); 