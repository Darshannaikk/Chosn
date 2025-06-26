import { z } from 'zod';

// Authentication schemas
export const loginSchema = z.object({
  email: z.string()
    .email('Please enter a valid email address')
    .min(5, 'Email must be at least 5 characters')
    .max(255, 'Email must be less than 255 characters')
    .toLowerCase(),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password must be less than 100 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one lowercase letter, one uppercase letter, and one number')
});

export const signupSchema = loginSchema.extend({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Company contact form schema
export const companyContactSchema = z.object({
  companyName: z.string().min(2, 'Company name must be at least 2 characters'),
  contactName: z.string().min(2, 'Contact name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  website: z.string().url('Please enter a valid website URL').optional().or(z.literal('')),
  companySize: z.string().min(1, 'Please select company size'),
  industry: z.string().min(2, 'Industry must be at least 2 characters'),
  description: z.string().optional(),
  hiringNeeds: z.string().min(10, 'Please provide more details about your hiring needs'),
  timeline: z.string().optional(),
});

// Developer profile form schema
export const developerProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  github: z.string().url('Please enter a valid GitHub URL').optional().or(z.literal('')),
  linkedin: z.string().url('Please enter a valid LinkedIn URL').optional().or(z.literal('')),
  portfolio: z.string().url('Please enter a valid portfolio URL').optional().or(z.literal('')),
  bio: z.string().min(50, 'Bio must be at least 50 characters'),
  skills: z.string().min(5, 'Please list your skills'),
  experience: z.string().min(1, 'Experience is required').transform(Number),
  location: z.string().optional(),
  availability: z.enum(['available', 'busy', 'not-looking']).default('available'),
});

// Profile update schema
export const profileUpdateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  bio: z.string().min(10, 'Bio must be at least 10 characters').optional(),
  location: z.string().optional(),
  timezone: z.string().optional(),
  experienceYears: z.number().min(0).max(50).optional(),
  availability: z.enum(['available', 'busy', 'not-looking']).optional(),
  githubUrl: z.string().url('Please enter a valid GitHub URL').optional().or(z.literal('')),
  linkedinUrl: z.string().url('Please enter a valid LinkedIn URL').optional().or(z.literal('')),
  portfolioUrl: z.string().url('Please enter a valid portfolio URL').optional().or(z.literal('')),
  salaryMin: z.number().min(0).optional(),
  salaryMax: z.number().min(0).optional(),
  remoteOnly: z.boolean().optional(),
});

// Project schema
export const projectSchema = z.object({
  title: z.string().min(2, 'Project title must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters').optional(),
  technologies: z.array(z.string()).min(1, 'Please add at least one technology'),
  projectUrl: z.string().url('Please enter a valid project URL').optional().or(z.literal('')),
  githubUrl: z.string().url('Please enter a valid GitHub URL').optional().or(z.literal('')),
  imageUrl: z.string().url('Please enter a valid image URL').optional().or(z.literal('')),
  featured: z.boolean().default(false),
});

// Profile schemas
export const userProfileSchema = z.object({
  id: z.string().uuid().optional(),
  email: z.string().email(),
  name: z.string().min(2).max(50),
  user_type: z.enum(['developer', 'company']),
  github_username: z.string()
    .min(1)
    .max(39)
    .regex(/^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9]))*$/, 'Invalid GitHub username format')
    .optional(),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  location: z.string().max(100, 'Location must be less than 100 characters').optional(),
  website: z.string()
    .url('Please enter a valid URL')
    .max(255, 'Website URL must be less than 255 characters')
    .optional()
    .or(z.literal('')),
  avatar_url: z.string().url().optional(),
  skills: z.array(z.string().min(1).max(50)).max(20, 'Maximum 20 skills allowed').optional(),
  experience_level: z.enum(['junior', 'mid', 'senior', 'lead', 'executive']).optional(),
  looking_for_work: z.boolean().default(false),
  open_to_opportunities: z.boolean().default(false),
  salary_expectation_min: z.number().min(0).max(1000000).optional(),
  salary_expectation_max: z.number().min(0).max(1000000).optional(),
  remote_preference: z.enum(['remote_only', 'hybrid', 'onsite', 'flexible']).optional(),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional()
}).refine((data) => {
  if (data.salary_expectation_min && data.salary_expectation_max) {
    return data.salary_expectation_min <= data.salary_expectation_max
  }
  return true
}, {
  message: "Minimum salary must be less than or equal to maximum salary",
  path: ["salary_expectation_min"],
})

// Company profile schema
export const companyProfileSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string()
    .min(2, 'Company name must be at least 2 characters')
    .max(100, 'Company name must be less than 100 characters'),
  description: z.string()
    .max(1000, 'Description must be less than 1000 characters')
    .optional(),
  website: z.string()
    .url('Please enter a valid website URL')
    .max(255, 'Website URL must be less than 255 characters')
    .optional(),
  logo_url: z.string().url().optional(),
  industry: z.string().max(50, 'Industry must be less than 50 characters').optional(),
  company_size: z.enum(['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+']).optional(),
  location: z.string().max(100, 'Location must be less than 100 characters').optional(),
  founded_year: z.number()
    .min(1800, 'Founded year must be after 1800')
    .max(new Date().getFullYear(), 'Founded year cannot be in the future')
    .optional(),
  tech_stack: z.array(z.string().min(1).max(50)).max(30, 'Maximum 30 technologies allowed').optional(),
  benefits: z.array(z.string().min(1).max(100)).max(20, 'Maximum 20 benefits allowed').optional(),
  remote_policy: z.enum(['remote_first', 'hybrid', 'onsite', 'flexible']).optional(),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional()
})

// Message schemas
export const messageSchema = z.object({
  id: z.string().uuid().optional(),
  conversation_id: z.string().uuid(),
  sender_id: z.string().uuid(),
  content: z.string()
    .min(1, 'Message cannot be empty')
    .max(2000, 'Message must be less than 2000 characters')
    .refine((content) => content.trim().length > 0, 'Message cannot be only whitespace'),
  message_type: z.enum(['text', 'system']).default('text'),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional()
})

export const conversationSchema = z.object({
  id: z.string().uuid().optional(),
  created_by: z.string().uuid(),
  title: z.string()
    .max(200, 'Conversation title must be less than 200 characters')
    .optional(),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional()
})

// GitHub integration schemas
export const githubProfileSchema = z.object({
  login: z.string(),
  id: z.number(),
  avatar_url: z.string().url(),
  html_url: z.string().url(),
  name: z.string().nullable(),
  company: z.string().nullable(),
  blog: z.string().nullable(),
  location: z.string().nullable(),
  bio: z.string().nullable(),
  public_repos: z.number(),
  followers: z.number(),
  following: z.number(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime()
})

export const githubRepositorySchema = z.object({
  id: z.number(),
  name: z.string(),
  full_name: z.string(),
  description: z.string().nullable(),
  html_url: z.string().url(),
  language: z.string().nullable(),
  languages_url: z.string().url(),
  stargazers_count: z.number(),
  forks_count: z.number(),
  size: z.number(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  pushed_at: z.string().datetime()
})

// API request schemas
export const paginationSchema = z.object({
  page: z.coerce.number().min(1).max(1000).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  sort: z.enum(['created_at', 'updated_at', 'name']).default('created_at'),
  order: z.enum(['asc', 'desc']).default('desc')
})

export const searchSchema = z.object({
  query: z.string()
    .min(1, 'Search query cannot be empty')
    .max(100, 'Search query must be less than 100 characters')
    .refine((query) => query.trim().length > 0, 'Search query cannot be only whitespace'),
  filters: z.object({
    skills: z.array(z.string()).optional(),
    experience_level: z.array(z.enum(['junior', 'mid', 'senior', 'lead', 'executive'])).optional(),
    location: z.string().optional(),
    remote_only: z.boolean().optional(),
    salary_min: z.number().min(0).optional(),
    salary_max: z.number().min(0).optional()
  }).optional()
}).merge(paginationSchema)

// Environment variable validation
export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  NEXT_PUBLIC_APP_URL: z.string().url(),
  GITHUB_CLIENT_ID: z.string().min(1).optional(),
  GITHUB_CLIENT_SECRET: z.string().min(1).optional(),
  RESEND_API_KEY: z.string().min(1).optional(),
  EMAIL_FROM: z.string().email().optional(),
  SENTRY_DSN: z.string().url().optional()
})

// Rate limiting schemas
export const rateLimitSchema = z.object({
  windowMs: z.number().min(1000).max(3600000).default(900000), // 15 minutes
  max: z.number().min(1).max(1000).default(100), // 100 requests per window
  message: z.string().max(200).default('Too many requests, please try again later.'),
  standardHeaders: z.boolean().default(true),
  legacyHeaders: z.boolean().default(false)
})

// Export types
export type LoginInput = z.infer<typeof loginSchema>
export type SignupInput = z.infer<typeof signupSchema>
export type UserProfile = z.infer<typeof userProfileSchema>
export type CompanyProfile = z.infer<typeof companyProfileSchema>
export type Message = z.infer<typeof messageSchema>
export type Conversation = z.infer<typeof conversationSchema>
export type GitHubProfile = z.infer<typeof githubProfileSchema>
export type GitHubRepository = z.infer<typeof githubRepositorySchema>
export type PaginationParams = z.infer<typeof paginationSchema>
export type SearchParams = z.infer<typeof searchSchema>
export type EnvVars = z.infer<typeof envSchema>

// Type exports
export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type CompanyContactFormData = z.infer<typeof companyContactSchema>;
export type DeveloperProfileFormData = z.infer<typeof developerProfileSchema>;
export type ProfileUpdateFormData = z.infer<typeof profileUpdateSchema>;
export type ProjectFormData = z.infer<typeof projectSchema>;