import { createClient } from '@/lib/supabase/client';

interface GitHubUser {
  login: string;
  id: number;
  name: string;
  email: string;
  avatar_url: string;
  bio: string;
  location: string;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}

interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  description: string;
  language: string;
  languages_url: string;
  stargazers_count: number;
  forks_count: number;
  size: number;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  default_branch: string;
}

interface LanguageStats {
  [language: string]: number;
}

interface GitHubStats {
  totalRepos: number;
  totalStars: number;
  totalForks: number;
  primaryLanguages: string[];
  recentActivity: boolean;
  contributionScore: number;
  topRepositories: GitHubRepository[];
}

interface SkillValidation {
  skill: string;
  confidence: number; // 0-100
  evidence: {
    repositories: string[];
    linesOfCode: number;
    recentUsage: boolean;
    projectComplexity: 'basic' | 'intermediate' | 'advanced';
  };
}

class GitHubService {
  private supabase = createClient();

  /**
   * Get GitHub access token from Supabase session
   */
  private async getAccessToken(): Promise<string | null> {
    try {
      const { data: { session }, error } = await this.supabase.auth.getSession();
      
      if (error || !session?.provider_token) {
        return null;
      }

      return session.provider_token;
    } catch (error) {
      console.error('Failed to get GitHub access token:', error);
      return null;
    }
  }

  /**
   * Initiate GitHub OAuth flow
   */
  async connectGitHub(): Promise<{ url: string }> {
    try {
      const { data, error } = await this.supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          scopes: 'user:email read:user public_repo',
          redirectTo: `${window.location.origin}/auth/callback?provider=github`,
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      return { url: data.url };
    } catch (error) {
      console.error('GitHub OAuth error:', error);
      throw error;
    }
  }

  /**
   * Get GitHub user profile
   */
  async getUserProfile(): Promise<GitHubUser> {
    const token = await this.getAccessToken();
    if (!token) {
      throw new Error('No GitHub access token available');
    }

    try {
      const response = await fetch('https://api.github.com/user', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      });

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to fetch GitHub user profile:', error);
      throw error;
    }
  }

  /**
   * Get user's repositories
   */
  async getUserRepositories(): Promise<GitHubRepository[]> {
    const token = await this.getAccessToken();
    if (!token) {
      throw new Error('No GitHub access token available');
    }

    try {
      const response = await fetch(
        'https://api.github.com/user/repos?per_page=50&sort=updated&type=owner',
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/vnd.github.v3+json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to fetch GitHub repositories:', error);
      throw error;
    }
  }

  /**
   * Get languages used in a repository
   */
  async getRepositoryLanguages(repo: GitHubRepository): Promise<LanguageStats> {
    const token = await this.getAccessToken();
    if (!token) {
      throw new Error('No GitHub access token available');
    }

    try {
      const response = await fetch(repo.languages_url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      });

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Failed to fetch languages for ${repo.name}:`, error);
      return {};
    }
  }

  /**
   * Analyze GitHub profile and calculate statistics
   */
  async analyzeProfile(): Promise<GitHubStats> {
    try {
      const [profile, repositories] = await Promise.all([
        this.getUserProfile(),
        this.getUserRepositories(),
      ]);

      // Calculate basic stats
      const totalStars = repositories.reduce((sum, repo) => sum + repo.stargazers_count, 0);
      const totalForks = repositories.reduce((sum, repo) => sum + repo.forks_count, 0);

      // Get language statistics
      const languageStats: LanguageStats = {};
      const recentRepos = repositories.slice(0, 20); // Analyze top 20 most recent repos

      for (const repo of recentRepos) {
        try {
          const languages = await this.getRepositoryLanguages(repo);
          Object.entries(languages).forEach(([lang, bytes]) => {
            languageStats[lang] = (languageStats[lang] || 0) + bytes;
          });
          
          // Small delay to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 100));
        } catch (error) {
          console.warn(`Skipping language analysis for ${repo.name}:`, error);
        }
      }

      // Sort languages by usage
      const primaryLanguages = Object.entries(languageStats)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)
        .map(([lang]) => lang);

      // Check recent activity (last 6 months)
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      const recentActivity = repositories.some(
        repo => new Date(repo.pushed_at) > sixMonthsAgo
      );

      // Calculate contribution score (simplified)
      const contributionScore = Math.min(
        100,
        Math.round(
          (totalStars * 2) +
          (totalForks * 3) +
          (repositories.length * 1) +
          (profile.followers * 1) +
          (recentActivity ? 20 : 0)
        )
      );

      // Get top repositories (by stars + forks)
      const topRepositories = repositories
        .sort((a, b) => (b.stargazers_count + b.forks_count) - (a.stargazers_count + a.forks_count))
        .slice(0, 5);

      return {
        totalRepos: repositories.length,
        totalStars,
        totalForks,
        primaryLanguages,
        recentActivity,
        contributionScore,
        topRepositories,
      };
    } catch (error) {
      console.error('Failed to analyze GitHub profile:', error);
      throw error;
    }
  }

  /**
   * Validate skills based on GitHub data
   */
  async validateSkills(): Promise<SkillValidation[]> {
    try {
      const repositories = await this.getUserRepositories();
      const skillValidations: SkillValidation[] = [];

      // Language mapping to our platform skills
      const languageMapping: Record<string, string[]> = {
        'JavaScript': ['JavaScript', 'Node.js'],
        'TypeScript': ['TypeScript', 'React'],
        'Python': ['Python', 'Django', 'Machine Learning'],
        'Java': ['Java', 'Spring Boot'],
        'Go': ['Go'],
        'Rust': ['Rust'],
        'PHP': ['PHP'],
        'Ruby': ['Ruby'],
        'Swift': ['iOS'],
        'Kotlin': ['Android'],
        'Dart': ['Flutter'],
      };

      // Analyze repositories for skills
      const skillEvidence: Record<string, {
        repositories: string[];
        linesOfCode: number;
        lastUsed: Date;
      }> = {};

      repositories.slice(0, 20).forEach(repo => {
        if (repo.language) {
          const mappedSkills = languageMapping[repo.language] || [repo.language];
          
          mappedSkills.forEach(skill => {
            if (!skillEvidence[skill]) {
              skillEvidence[skill] = {
                repositories: [],
                linesOfCode: 0,
                lastUsed: new Date(repo.pushed_at),
              };
            }

            skillEvidence[skill].repositories.push(repo.name);
            skillEvidence[skill].linesOfCode += repo.size;
            
            if (new Date(repo.pushed_at) > skillEvidence[skill].lastUsed) {
              skillEvidence[skill].lastUsed = new Date(repo.pushed_at);
            }
          });
        }
      });

      // Convert evidence to skill validations
      Object.entries(skillEvidence).forEach(([skill, evidence]) => {
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        
        const recentUsage = evidence.lastUsed > sixMonthsAgo;
        const projectComplexity = evidence.linesOfCode > 50000 ? 'advanced' : 
                                evidence.linesOfCode > 10000 ? 'intermediate' : 'basic';

        // Calculate confidence score
        const confidence = Math.min(100, 
          (evidence.repositories.length * 15) + 
          (Math.min(evidence.linesOfCode / 1000, 30)) + 
          (recentUsage ? 25 : 0)
        );

        if (confidence >= 30) {
          skillValidations.push({
            skill,
            confidence: Math.round(confidence),
            evidence: {
              repositories: evidence.repositories.slice(0, 3),
              linesOfCode: evidence.linesOfCode,
              recentUsage,
              projectComplexity,
            },
          });
        }
      });

      return skillValidations.sort((a, b) => b.confidence - a.confidence);
    } catch (error) {
      console.error('Failed to validate skills:', error);
      throw error;
    }
  }

  /**
   * Save GitHub data to user profile
   */
  async saveToProfile(userId: string): Promise<void> {
    try {
      const [profile, skills] = await Promise.all([
        this.getUserProfile(),
        this.validateSkills(),
      ]);

      // Update developer profile with GitHub data
      const { error: profileError } = await this.supabase
        .from('developer_profiles')
        .update({
          github_url: `https://github.com/${profile.login}`,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (profileError) {
        console.error('Failed to update developer profile:', profileError);
      }

      // Update main profile with GitHub avatar
      const { error: mainProfileError } = await this.supabase
        .from('profiles')
        .update({
          avatar_url: profile.avatar_url,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (mainProfileError) {
        console.error('Failed to update main profile:', mainProfileError);
      }

      // Save validated skills
      await this.saveValidatedSkills(userId, skills);

    } catch (error) {
      console.error('Failed to save GitHub data to profile:', error);
      throw error;
    }
  }

  private async saveValidatedSkills(userId: string, validatedSkills: SkillValidation[]): Promise<void> {
    try {
      // Get existing skills from database
      const { data: existingSkills } = await this.supabase
        .from('skills')
        .select('id, name');

      const skillMap = new Map(existingSkills?.map(skill => [skill.name, skill.id]) || []);

      // Prepare user skills data
      const userSkillsData = [];

      for (const validation of validatedSkills.slice(0, 10)) { // Top 10 skills
        let skillId = skillMap.get(validation.skill);

        // Create skill if it doesn't exist
        if (!skillId) {
          const { data: newSkill, error } = await this.supabase
            .from('skills')
            .insert({
              name: validation.skill,
              category: 'Programming Language',
            })
            .select('id')
            .single();

          if (error) {
            console.error(`Failed to create skill ${validation.skill}:`, error);
            continue;
          }

          skillId = newSkill.id;
        }

        // Calculate proficiency level (1-5) based on confidence
        const proficiencyLevel = Math.max(1, Math.min(5, Math.ceil(validation.confidence / 20)));

        userSkillsData.push({
          user_id: userId,
          skill_id: skillId,
          proficiency_level: proficiencyLevel,
        });
      }

      // Remove existing user skills
      await this.supabase
        .from('user_skills')
        .delete()
        .eq('user_id', userId);

      // Insert new validated skills
      if (userSkillsData.length > 0) {
        const { error } = await this.supabase
          .from('user_skills')
          .insert(userSkillsData);

        if (error) {
          console.error('Failed to save user skills:', error);
        }
      }

    } catch (error) {
      console.error('Failed to save validated skills:', error);
    }
  }
}

export const githubService = new GitHubService(); 