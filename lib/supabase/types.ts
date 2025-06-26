export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          name: string
          avatar_url: string | null
          user_type: 'developer' | 'company'
          verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name: string
          avatar_url?: string | null
          user_type: 'developer' | 'company'
          verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          avatar_url?: string | null
          user_type?: 'developer' | 'company'
          verified?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      developer_profiles: {
        Row: {
          id: string
          bio: string | null
          location: string | null
          timezone: string | null
          experience_years: number
          availability: 'available' | 'busy' | 'not-looking'
          github_url: string | null
          linkedin_url: string | null
          portfolio_url: string | null
          salary_min: number | null
          salary_max: number | null
          remote_only: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          bio?: string | null
          location?: string | null
          timezone?: string | null
          experience_years?: number
          availability?: 'available' | 'busy' | 'not-looking'
          github_url?: string | null
          linkedin_url?: string | null
          portfolio_url?: string | null
          salary_min?: number | null
          salary_max?: number | null
          remote_only?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          bio?: string | null
          location?: string | null
          timezone?: string | null
          experience_years?: number
          availability?: 'available' | 'busy' | 'not-looking'
          github_url?: string | null
          linkedin_url?: string | null
          portfolio_url?: string | null
          salary_min?: number | null
          salary_max?: number | null
          remote_only?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      company_profiles: {
        Row: {
          id: string
          company_name: string
          industry: string | null
          company_size: string | null
          website_url: string | null
          description: string | null
          location: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          company_name: string
          industry?: string | null
          company_size?: string | null
          website_url?: string | null
          description?: string | null
          location?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_name?: string
          industry?: string | null
          company_size?: string | null
          website_url?: string | null
          description?: string | null
          location?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      skills: {
        Row: {
          id: string
          name: string
          category: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          category?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          category?: string | null
          created_at?: string
        }
      }
      user_skills: {
        Row: {
          id: string
          user_id: string
          skill_id: string
          proficiency_level: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          skill_id: string
          proficiency_level?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          skill_id?: string
          proficiency_level?: number
          created_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          developer_id: string
          title: string
          description: string | null
          technologies: string[]
          project_url: string | null
          github_url: string | null
          image_url: string | null
          featured: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          developer_id: string
          title: string
          description?: string | null
          technologies?: string[]
          project_url?: string | null
          github_url?: string | null
          image_url?: string | null
          featured?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          developer_id?: string
          title?: string
          description?: string | null
          technologies?: string[]
          project_url?: string | null
          github_url?: string | null
          image_url?: string | null
          featured?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      matches: {
        Row: {
          id: string
          developer_id: string
          company_id: string
          position_title: string
          job_description: string | null
          requirements: string[]
          benefits: string[]
          salary_min: number | null
          salary_max: number | null
          location: string | null
          remote_allowed: boolean
          match_score: number
          status: 'pending' | 'viewed' | 'interested' | 'declined' | 'interview' | 'offer' | 'hired'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          developer_id: string
          company_id: string
          position_title: string
          job_description?: string | null
          requirements?: string[]
          benefits?: string[]
          salary_min?: number | null
          salary_max?: number | null
          location?: string | null
          remote_allowed?: boolean
          match_score?: number
          status?: 'pending' | 'viewed' | 'interested' | 'declined' | 'interview' | 'offer' | 'hired'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          developer_id?: string
          company_id?: string
          position_title?: string
          job_description?: string | null
          requirements?: string[]
          benefits?: string[]
          salary_min?: number | null
          salary_max?: number | null
          location?: string | null
          remote_allowed?: boolean
          match_score?: number
          status?: 'pending' | 'viewed' | 'interested' | 'declined' | 'interview' | 'offer' | 'hired'
          created_at?: string
          updated_at?: string
        }
      }
      match_responses: {
        Row: {
          id: string
          match_id: string
          developer_id: string
          response: 'interested' | 'declined'
          message: string | null
          created_at: string
        }
        Insert: {
          id?: string
          match_id: string
          developer_id: string
          response: 'interested' | 'declined'
          message?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          match_id?: string
          developer_id?: string
          response?: 'interested' | 'declined'
          message?: string | null
          created_at?: string
        }
      }
      analytics_events: {
        Row: {
          id: string
          user_id: string
          event_type: string
          event_data: Json
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          event_type: string
          event_data?: Json
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          event_type?: string
          event_data?: Json
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}