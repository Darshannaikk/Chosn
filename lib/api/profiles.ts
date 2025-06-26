import { createClient } from '@/lib/supabase/client';

export interface DeveloperProfile {
  id: string;
  bio?: string;
  location?: string;
  timezone?: string;
  experienceYears: number;
  availability: 'available' | 'busy' | 'not-looking';
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  salaryMin?: number;
  salaryMax?: number;
  remoteOnly: boolean;
  skills: Array<{
    id: string;
    name: string;
    category?: string;
    proficiencyLevel: number;
  }>;
  projects: Array<{
    id: string;
    title: string;
    description?: string;
    technologies: string[];
    projectUrl?: string;
    githubUrl?: string;
    imageUrl?: string;
    featured: boolean;
  }>;
}

export interface CompanyProfile {
  id: string;
  companyName: string;
  industry?: string;
  companySize?: string;
  websiteUrl?: string;
  description?: string;
  location?: string;
}

// Supabase profile service
class ProfileService {
  private supabase = createClient();

  async getDeveloperProfile(userId: string): Promise<DeveloperProfile | null> {
    try {
      // Get developer profile with skills and projects
      const { data: profile, error: profileError } = await this.supabase
        .from('developer_profiles')
        .select(`
          *,
          profiles!inner(name, email, avatar_url),
          user_skills(
            proficiency_level,
            skills(id, name, category)
          ),
          projects(*)
        `)
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error('Developer profile fetch error:', profileError);
        return null;
      }

      return {
        id: profile.id,
        bio: profile.bio,
        location: profile.location,
        timezone: profile.timezone,
        experienceYears: profile.experience_years,
        availability: profile.availability,
        githubUrl: profile.github_url,
        linkedinUrl: profile.linkedin_url,
        portfolioUrl: profile.portfolio_url,
        salaryMin: profile.salary_min,
        salaryMax: profile.salary_max,
        remoteOnly: profile.remote_only,
        skills: profile.user_skills?.map((us: any) => ({
          id: us.skills.id,
          name: us.skills.name,
          category: us.skills.category,
          proficiencyLevel: us.proficiency_level,
        })) || [],
        projects: profile.projects?.map((p: any) => ({
          id: p.id,
          title: p.title,
          description: p.description,
          technologies: p.technologies || [],
          projectUrl: p.project_url,
          githubUrl: p.github_url,
          imageUrl: p.image_url,
          featured: p.featured,
        })) || [],
      };
    } catch (error) {
      console.error('Get developer profile error:', error);
      return null;
    }
  }

  async updateDeveloperProfile(userId: string, updates: Partial<DeveloperProfile>): Promise<void> {
    try {
      const profileUpdates: any = {};
      
      if (updates.bio !== undefined) profileUpdates.bio = updates.bio;
      if (updates.location !== undefined) profileUpdates.location = updates.location;
      if (updates.timezone !== undefined) profileUpdates.timezone = updates.timezone;
      if (updates.experienceYears !== undefined) profileUpdates.experience_years = updates.experienceYears;
      if (updates.availability !== undefined) profileUpdates.availability = updates.availability;
      if (updates.githubUrl !== undefined) profileUpdates.github_url = updates.githubUrl;
      if (updates.linkedinUrl !== undefined) profileUpdates.linkedin_url = updates.linkedinUrl;
      if (updates.portfolioUrl !== undefined) profileUpdates.portfolio_url = updates.portfolioUrl;
      if (updates.salaryMin !== undefined) profileUpdates.salary_min = updates.salaryMin;
      if (updates.salaryMax !== undefined) profileUpdates.salary_max = updates.salaryMax;
      if (updates.remoteOnly !== undefined) profileUpdates.remote_only = updates.remoteOnly;

      if (Object.keys(profileUpdates).length > 0) {
        const { error } = await this.supabase
          .from('developer_profiles')
          .update(profileUpdates)
          .eq('id', userId);

        if (error) {
          throw new Error(error.message);
        }
      }
    } catch (error) {
      console.error('Update developer profile error:', error);
      throw error;
    }
  }

  async getCompanyProfile(userId: string): Promise<CompanyProfile | null> {
    try {
      const { data: profile, error } = await this.supabase
        .from('company_profiles')
        .select(`
          *,
          profiles!inner(name, email, avatar_url)
        `)
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Company profile fetch error:', error);
        return null;
      }

      return {
        id: profile.id,
        companyName: profile.company_name,
        industry: profile.industry,
        companySize: profile.company_size,
        websiteUrl: profile.website_url,
        description: profile.description,
        location: profile.location,
      };
    } catch (error) {
      console.error('Get company profile error:', error);
      return null;
    }
  }

  async updateCompanyProfile(userId: string, updates: Partial<CompanyProfile>): Promise<void> {
    try {
      const profileUpdates: any = {};
      
      if (updates.companyName !== undefined) profileUpdates.company_name = updates.companyName;
      if (updates.industry !== undefined) profileUpdates.industry = updates.industry;
      if (updates.companySize !== undefined) profileUpdates.company_size = updates.companySize;
      if (updates.websiteUrl !== undefined) profileUpdates.website_url = updates.websiteUrl;
      if (updates.description !== undefined) profileUpdates.description = updates.description;
      if (updates.location !== undefined) profileUpdates.location = updates.location;

      if (Object.keys(profileUpdates).length > 0) {
        const { error } = await this.supabase
          .from('company_profiles')
          .update(profileUpdates)
          .eq('id', userId);

        if (error) {
          throw new Error(error.message);
        }
      }
    } catch (error) {
      console.error('Update company profile error:', error);
      throw error;
    }
  }

  async getSkills(): Promise<Array<{ id: string; name: string; category?: string }>> {
    try {
      const { data: skills, error } = await this.supabase
        .from('skills')
        .select('*')
        .order('name');

      if (error) {
        throw new Error(error.message);
      }

      return skills || [];
    } catch (error) {
      console.error('Get skills error:', error);
      return [];
    }
  }

  async addUserSkill(userId: string, skillId: string, proficiencyLevel: number = 1): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('user_skills')
        .upsert({
          user_id: userId,
          skill_id: skillId,
          proficiency_level: proficiencyLevel,
        });

      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      console.error('Add user skill error:', error);
      throw error;
    }
  }

  async removeUserSkill(userId: string, skillId: string): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('user_skills')
        .delete()
        .eq('user_id', userId)
        .eq('skill_id', skillId);

      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      console.error('Remove user skill error:', error);
      throw error;
    }
  }

  async addProject(userId: string, project: {
    title: string;
    description?: string;
    technologies: string[];
    projectUrl?: string;
    githubUrl?: string;
    imageUrl?: string;
    featured?: boolean;
  }): Promise<string> {
    try {
      const { data, error } = await this.supabase
        .from('projects')
        .insert({
          developer_id: userId,
          title: project.title,
          description: project.description,
          technologies: project.technologies,
          project_url: project.projectUrl,
          github_url: project.githubUrl,
          image_url: project.imageUrl,
          featured: project.featured || false,
        })
        .select('id')
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data.id;
    } catch (error) {
      console.error('Add project error:', error);
      throw error;
    }
  }

  async updateProject(projectId: string, updates: {
    title?: string;
    description?: string;
    technologies?: string[];
    projectUrl?: string;
    githubUrl?: string;
    imageUrl?: string;
    featured?: boolean;
  }): Promise<void> {
    try {
      const projectUpdates: any = {};
      
      if (updates.title !== undefined) projectUpdates.title = updates.title;
      if (updates.description !== undefined) projectUpdates.description = updates.description;
      if (updates.technologies !== undefined) projectUpdates.technologies = updates.technologies;
      if (updates.projectUrl !== undefined) projectUpdates.project_url = updates.projectUrl;
      if (updates.githubUrl !== undefined) projectUpdates.github_url = updates.githubUrl;
      if (updates.imageUrl !== undefined) projectUpdates.image_url = updates.imageUrl;
      if (updates.featured !== undefined) projectUpdates.featured = updates.featured;

      if (Object.keys(projectUpdates).length > 0) {
        const { error } = await this.supabase
          .from('projects')
          .update(projectUpdates)
          .eq('id', projectId);

        if (error) {
          throw new Error(error.message);
        }
      }
    } catch (error) {
      console.error('Update project error:', error);
      throw error;
    }
  }

  async deleteProject(projectId: string): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      console.error('Delete project error:', error);
      throw error;
    }
  }

  async uploadAvatar(userId: string, file: File): Promise<string> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}-${Math.random()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await this.supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      const { data } = this.supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Update profile with new avatar URL
      const { error: updateError } = await this.supabase
        .from('profiles')
        .update({ avatar_url: data.publicUrl })
        .eq('id', userId);

      if (updateError) {
        throw new Error(updateError.message);
      }

      return data.publicUrl;
    } catch (error) {
      console.error('Upload avatar error:', error);
      throw error;
    }
  }
}

export const profileService = new ProfileService();