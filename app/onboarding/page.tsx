"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowRight, 
  ArrowLeft,
  CheckCircle,
  Code2,
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  Github,
  Linkedin,
  Globe,
  Plus,
  X,
  Sparkles,
  Target,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/hooks/use-auth';
import { profileService } from '@/lib/api/profiles';
import { analyticsService } from '@/lib/api/analytics';
import { z } from 'zod';
import { toast } from 'sonner';

const onboardingSchema = z.object({
  bio: z.string().min(50, 'Bio must be at least 50 characters'),
  location: z.string().min(2, 'Location is required'),
  experienceYears: z.number().min(0).max(50),
  availability: z.enum(['available', 'busy', 'not-looking']),
  githubUrl: z.string().url('Please enter a valid GitHub URL').optional().or(z.literal('')),
  linkedinUrl: z.string().url('Please enter a valid LinkedIn URL').optional().or(z.literal('')),
  portfolioUrl: z.string().url('Please enter a valid portfolio URL').optional().or(z.literal('')),
  salaryMin: z.number().min(0).optional(),
  salaryMax: z.number().min(0).optional(),
  remoteOnly: z.boolean(),
  skills: z.array(z.string()).min(3, 'Please add at least 3 skills'),
});

type OnboardingFormData = z.infer<typeof onboardingSchema>;

export default function OnboardingPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableSkills, setAvailableSkills] = useState<Array<{ id: string; name: string; category?: string }>>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    trigger
  } = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      bio: '',
      location: '',
      experienceYears: 0,
      availability: 'available',
      githubUrl: '',
      linkedinUrl: '',
      portfolioUrl: '',
      salaryMin: 0,
      salaryMax: 0,
      remoteOnly: false,
      skills: [],
    }
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (user?.role !== 'developer') {
      router.push('/analytics');
      return;
    }

    // Load available skills
    loadSkills();
    
    // Track onboarding start
    if (user) {
      analyticsService.trackEvent(user.id, 'onboarding_started', {
        user_type: user.role,
        step: 1
      });
    }
  }, [isAuthenticated, user, router]);

  const loadSkills = async () => {
    try {
      const skills = await profileService.getSkills();
      setAvailableSkills(skills);
    } catch (error) {
      console.error('Failed to load skills:', error);
    }
  };

  const addSkill = (skillName: string) => {
    if (skillName && !selectedSkills.includes(skillName)) {
      const newSkills = [...selectedSkills, skillName];
      setSelectedSkills(newSkills);
      setValue('skills', newSkills);
      setSkillInput('');
    }
  };

  const removeSkill = (skillName: string) => {
    const newSkills = selectedSkills.filter(s => s !== skillName);
    setSelectedSkills(newSkills);
    setValue('skills', newSkills);
  };

  const nextStep = async () => {
    const fieldsToValidate = getFieldsForStep(currentStep);
    const isValid = await trigger(fieldsToValidate);
    
    if (isValid) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
      
      // Track step completion
      if (user) {
        analyticsService.trackEvent(user.id, 'onboarding_step_completed', {
          step: currentStep,
          total_steps: totalSteps
        });
      }
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const getFieldsForStep = (step: number): (keyof OnboardingFormData)[] => {
    switch (step) {
      case 1:
        return ['bio', 'location', 'experienceYears'];
      case 2:
        return ['skills'];
      case 3:
        return ['githubUrl', 'linkedinUrl', 'portfolioUrl'];
      case 4:
        return ['availability', 'salaryMin', 'salaryMax', 'remoteOnly'];
      default:
        return [];
    }
  };

  const onSubmit = async (data: OnboardingFormData) => {
    if (!user) return;

    setIsSubmitting(true);
    try {
      // Update developer profile
      await profileService.updateDeveloperProfile(user.id, {
        bio: data.bio,
        location: data.location,
        experienceYears: data.experienceYears,
        availability: data.availability,
        githubUrl: data.githubUrl || undefined,
        linkedinUrl: data.linkedinUrl || undefined,
        portfolioUrl: data.portfolioUrl || undefined,
        salaryMin: data.salaryMin || undefined,
        salaryMax: data.salaryMax || undefined,
        remoteOnly: data.remoteOnly,
      });

      // Add skills
      for (const skillName of data.skills) {
        const skill = availableSkills.find(s => s.name === skillName);
        if (skill) {
          await profileService.addUserSkill(user.id, skill.id, 3); // Default proficiency
        }
      }

      // Track onboarding completion
      await analyticsService.trackEvent(user.id, 'onboarding_completed', {
        skills_count: data.skills.length,
        has_github: !!data.githubUrl,
        has_linkedin: !!data.linkedinUrl,
        has_portfolio: !!data.portfolioUrl,
        experience_years: data.experienceYears,
        remote_only: data.remoteOnly
      });

      toast.success('Profile setup complete! Welcome to Chosn.');
      router.push('/analytics');
    } catch (error) {
      console.error('Onboarding error:', error);
      toast.error('Failed to complete setup. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 }
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <span className="text-2xl font-bold gradient-text">Chosn</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Complete Your Profile</h1>
          <p className="text-muted-foreground">
            Let's set up your developer profile to start getting matched with amazing opportunities
          </p>
        </motion.div>

        {/* Progress */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Step {currentStep} of {totalSteps}</span>
            <span className="text-sm text-muted-foreground">{Math.round(progress)}% complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </motion.div>

        {/* Form */}
        <Card className="bg-card/50 backdrop-blur-sm border-0 shadow-xl">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit(onSubmit)}>
              <AnimatePresence mode="wait">
                {/* Step 1: Basic Info */}
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    variants={stepVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Code2 className="w-8 h-8 text-white" />
                      </div>
                      <h2 className="text-2xl font-bold mb-2">Tell us about yourself</h2>
                      <p className="text-muted-foreground">Share your background and experience</p>
                    </div>

                    <div>
                      <Label htmlFor="bio">Bio *</Label>
                      <Textarea
                        id="bio"
                        placeholder="Tell us about your passion for development, your experience, and what drives you..."
                        rows={4}
                        {...register('bio')}
                      />
                      {errors.bio && (
                        <p className="text-sm text-red-500 mt-1">{errors.bio.message}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="location">Location *</Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="location"
                            placeholder="San Francisco, CA"
                            className="pl-10"
                            {...register('location')}
                          />
                        </div>
                        {errors.location && (
                          <p className="text-sm text-red-500 mt-1">{errors.location.message}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="experienceYears">Years of Experience *</Label>
                        <div className="relative">
                          <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="experienceYears"
                            type="number"
                            placeholder="5"
                            min="0"
                            max="50"
                            className="pl-10"
                            {...register('experienceYears', { valueAsNumber: true })}
                          />
                        </div>
                        {errors.experienceYears && (
                          <p className="text-sm text-red-500 mt-1">{errors.experienceYears.message}</p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Skills */}
                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    variants={stepVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Target className="w-8 h-8 text-white" />
                      </div>
                      <h2 className="text-2xl font-bold mb-2">What are your skills?</h2>
                      <p className="text-muted-foreground">Add your technical skills and expertise</p>
                    </div>

                    <div>
                      <Label htmlFor="skillInput">Add Skills *</Label>
                      <div className="flex space-x-2">
                        <Input
                          id="skillInput"
                          placeholder="Type a skill (e.g., React, Python, AWS)"
                          value={skillInput}
                          onChange={(e) => setSkillInput(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addSkill(skillInput);
                            }
                          }}
                        />
                        <Button
                          type="button"
                          onClick={() => addSkill(skillInput)}
                          disabled={!skillInput}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      {errors.skills && (
                        <p className="text-sm text-red-500 mt-1">{errors.skills.message}</p>
                      )}
                    </div>

                    {/* Popular Skills */}
                    <div>
                      <Label className="text-sm font-medium mb-3 block">Popular Skills</Label>
                      <div className="flex flex-wrap gap-2">
                        {['React', 'TypeScript', 'Node.js', 'Python', 'AWS', 'Docker', 'PostgreSQL', 'GraphQL'].map((skill) => (
                          <Button
                            key={skill}
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => addSkill(skill)}
                            disabled={selectedSkills.includes(skill)}
                            className="text-xs"
                          >
                            {selectedSkills.includes(skill) ? (
                              <CheckCircle className="w-3 h-3 mr-1" />
                            ) : (
                              <Plus className="w-3 h-3 mr-1" />
                            )}
                            {skill}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Selected Skills */}
                    {selectedSkills.length > 0 && (
                      <div>
                        <Label className="text-sm font-medium mb-3 block">Your Skills ({selectedSkills.length})</Label>
                        <div className="flex flex-wrap gap-2">
                          {selectedSkills.map((skill) => (
                            <Badge key={skill} variant="secondary" className="px-3 py-1">
                              {skill}
                              <button
                                type="button"
                                onClick={() => removeSkill(skill)}
                                className="ml-2 text-red-500 hover:text-red-700"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Step 3: Links */}
                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    variants={stepVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Globe className="w-8 h-8 text-white" />
                      </div>
                      <h2 className="text-2xl font-bold mb-2">Showcase your work</h2>
                      <p className="text-muted-foreground">Add links to your profiles and portfolio</p>
                    </div>

                    <div>
                      <Label htmlFor="githubUrl">GitHub Profile</Label>
                      <div className="relative">
                        <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="githubUrl"
                          placeholder="https://github.com/yourusername"
                          className="pl-10"
                          {...register('githubUrl')}
                        />
                      </div>
                      {errors.githubUrl && (
                        <p className="text-sm text-red-500 mt-1">{errors.githubUrl.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="linkedinUrl">LinkedIn Profile</Label>
                      <div className="relative">
                        <Linkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="linkedinUrl"
                          placeholder="https://linkedin.com/in/yourusername"
                          className="pl-10"
                          {...register('linkedinUrl')}
                        />
                      </div>
                      {errors.linkedinUrl && (
                        <p className="text-sm text-red-500 mt-1">{errors.linkedinUrl.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="portfolioUrl">Portfolio Website</Label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="portfolioUrl"
                          placeholder="https://yourportfolio.com"
                          className="pl-10"
                          {...register('portfolioUrl')}
                        />
                      </div>
                      {errors.portfolioUrl && (
                        <p className="text-sm text-red-500 mt-1">{errors.portfolioUrl.message}</p>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Step 4: Preferences */}
                {currentStep === 4 && (
                  <motion.div
                    key="step4"
                    variants={stepVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Zap className="w-8 h-8 text-white" />
                      </div>
                      <h2 className="text-2xl font-bold mb-2">Job preferences</h2>
                      <p className="text-muted-foreground">Help us find the perfect opportunities for you</p>
                    </div>

                    <div>
                      <Label htmlFor="availability">Current Availability</Label>
                      <select
                        id="availability"
                        className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
                        {...register('availability')}
                      >
                        <option value="available">Available for new opportunities</option>
                        <option value="busy">Busy but open to great offers</option>
                        <option value="not-looking">Not currently looking</option>
                      </select>
                      {errors.availability && (
                        <p className="text-sm text-red-500 mt-1">{errors.availability.message}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="salaryMin">Minimum Salary (USD)</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="salaryMin"
                            type="number"
                            placeholder="120000"
                            className="pl-10"
                            {...register('salaryMin', { valueAsNumber: true })}
                          />
                        </div>
                        {errors.salaryMin && (
                          <p className="text-sm text-red-500 mt-1">{errors.salaryMin.message}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="salaryMax">Maximum Salary (USD)</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="salaryMax"
                            type="number"
                            placeholder="180000"
                            className="pl-10"
                            {...register('salaryMax', { valueAsNumber: true })}
                          />
                        </div>
                        {errors.salaryMax && (
                          <p className="text-sm text-red-500 mt-1">{errors.salaryMax.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="remoteOnly"
                        className="rounded border-input"
                        {...register('remoteOnly')}
                      />
                      <Label htmlFor="remoteOnly">I'm only interested in remote positions</Label>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="flex items-center space-x-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Previous</span>
                </Button>

                {currentStep < totalSteps ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="gradient-bg flex items-center space-x-2"
                  >
                    <span>Next</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="gradient-bg flex items-center space-x-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Completing...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Complete Setup</span>
                      </>
                    )}
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}