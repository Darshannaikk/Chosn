"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Code2, 
  Star, 
  Users, 
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Github,
  Linkedin,
  Globe,
  Mail,
  MapPin,
  Clock,
  DollarSign,
  Zap,
  Shield,
  Target
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { developerProfileSchema, type DeveloperProfileFormData } from '@/lib/validation/schemas';
import { toast } from 'sonner';

export default function DevelopersPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<DeveloperProfileFormData>({
    resolver: zodResolver(developerProfileSchema),
    defaultValues: {
      name: '',
      email: '',
      github: '',
      linkedin: '',
      portfolio: '',
      bio: '',
      skills: '',
      experience: '',
      location: '',
      availability: 'available'
    }
  });

  const onSubmit = async (data: DeveloperProfileFormData) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Form submitted:', data);
      toast.success('Profile created successfully! Welcome to Chosn.');
      reset();
    } catch (error) {
      toast.error('Failed to create profile. Please try again.');
    }
  };

  const benefits = [
    {
      icon: Target,
      title: 'Get Discovered',
      description: 'Top companies find you based on your skills and experience',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Zap,
      title: 'Skip Applications',
      description: 'No more endless job applications - opportunities come to you',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: DollarSign,
      title: 'Premium Salaries',
      description: 'Access to high-paying positions at industry-leading companies',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: Shield,
      title: 'Verified Quality',
      description: 'Join an exclusive network of pre-validated elite developers',
      color: 'from-orange-500 to-red-500',
    },
  ];

  const stats = [
    { label: 'Average Salary Increase', value: '35%', icon: TrendingUp },
    { label: 'Time to First Interview', value: '7 days', icon: Clock },
    { label: 'Success Rate', value: '95%', icon: CheckCircle },
    { label: 'Elite Developers', value: '12K+', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-24 bg-gradient-to-br from-background via-background to-muted/20 relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-brand-primary/5 rounded-full blur-3xl animate-float" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-accent/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              className="text-center max-w-4xl mx-auto mb-16"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Badge variant="secondary" className="mb-4 px-4 py-2">
                <Code2 className="w-4 h-4 mr-2" />
                For Elite Developers
              </Badge>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
                Never Apply , <span className="gradient-text">Get Applied</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Join 12,500+ elite developers who get discovered by top companies. 
                Build your profile once, get matched with your dream opportunities.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" className="gradient-bg px-8 py-4 text-lg" asChild>
                  <Link href="#signup">
                    Create Your Profile
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="px-8 py-4 text-lg">
                  View Success Stories
                </Button>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {stats.map((stat) => (
                <Card key={stat.label} className="text-center bg-card/50 backdrop-blur-sm border-0">
                  <CardContent className="p-6">
                    <stat.icon className="w-8 h-8 mx-auto mb-3 text-brand-primary" />
                    <div className="text-2xl font-bold mb-1">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
                Why Choose <span className="gradient-text">Chosn</span>?
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Experience a new way of finding opportunities that puts you in control
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full hover-lift group">
                    <CardContent className="p-8">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${benefit.color} w-fit mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        <benefit.icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{benefit.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Signup Form Section */}
        <section id="signup" className="py-24 bg-muted/20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                  Create Your <span className="gradient-text">Developer Profile</span>
                </h2>
                <p className="text-lg text-muted-foreground">
                  Join thousands of elite developers and get discovered by top companies
                </p>
              </div>

              <Card className="bg-card/50 backdrop-blur-sm border-0">
                <CardContent className="p-8">
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          placeholder="John Doe"
                          {...register('name')}
                        />
                        {errors.name && (
                          <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="john@example.com"
                          {...register('email')}
                        />
                        {errors.email && (
                          <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="github">GitHub Profile</Label>
                        <div className="relative">
                          <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="github"
                            placeholder="https://github.com/johndoe"
                            className="pl-10"
                            {...register('github')}
                          />
                        </div>
                        {errors.github && (
                          <p className="text-sm text-red-500 mt-1">{errors.github.message}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="linkedin">LinkedIn Profile</Label>
                        <div className="relative">
                          <Linkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="linkedin"
                            placeholder="https://linkedin.com/in/johndoe"
                            className="pl-10"
                            {...register('linkedin')}
                          />
                        </div>
                        {errors.linkedin && (
                          <p className="text-sm text-red-500 mt-1">{errors.linkedin.message}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="portfolio">Portfolio Website</Label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="portfolio"
                          placeholder="https://johndoe.dev"
                          className="pl-10"
                          {...register('portfolio')}
                        />
                      </div>
                      {errors.portfolio && (
                        <p className="text-sm text-red-500 mt-1">{errors.portfolio.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="bio">Bio *</Label>
                      <Textarea
                        id="bio"
                        placeholder="Tell us about yourself, your experience, and what you're passionate about..."
                        rows={4}
                        {...register('bio')}
                      />
                      {errors.bio && (
                        <p className="text-sm text-red-500 mt-1">{errors.bio.message}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="skills">Skills *</Label>
                        <Input
                          id="skills"
                          placeholder="React, Node.js, Python, AWS..."
                          {...register('skills')}
                        />
                        {errors.skills && (
                          <p className="text-sm text-red-500 mt-1">{errors.skills.message}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="experience">Years of Experience *</Label>
                        <Input
                          id="experience"
                          type="number"
                          placeholder="5"
                          min="0"
                          {...register('experience')}
                        />
                        {errors.experience && (
                          <p className="text-sm text-red-500 mt-1">{errors.experience.message}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="location">Location</Label>
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

                    <Button 
                      type="submit" 
                      size="lg" 
                      className="w-full gradient-bg text-lg py-6"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Creating Profile...</span>
                        </div>
                      ) : (
                        <>
                          Create My Profile
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </>
                      )}
                    </Button>

                    <p className="text-sm text-muted-foreground text-center">
                      By creating a profile, you agree to our Terms of Service and Privacy Policy
                    </p>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}