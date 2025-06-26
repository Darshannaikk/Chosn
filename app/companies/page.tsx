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
  Briefcase, 
  Users, 
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Clock,
  DollarSign,
  Zap,
  Shield,
  Target,
  Building,
  Mail,
  Phone,
  Globe,
  Star
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { companyContactSchema, type CompanyContactFormData } from '@/lib/validation/schemas';
import { toast } from 'sonner';

export default function CompaniesPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<CompanyContactFormData>({
    resolver: zodResolver(companyContactSchema),
    defaultValues: {
      companyName: '',
      contactName: '',
      email: '',
      phone: '',
      website: '',
      companySize: '',
      industry: '',
      description: '',
      hiringNeeds: '',
      timeline: ''
    }
  });

  const onSubmit = async (data: CompanyContactFormData) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Form submitted:', data);
      toast.success('Thank you! We\'ll get back to you within 24 hours.');
      reset();
    } catch (error) {
      toast.error('Failed to submit form. Please try again.');
    }
  };

  const benefits = [
    {
      icon: Shield,
      title: 'Pre-Validated Talent',
      description: 'Access developers who have been thoroughly vetted and verified',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Zap,
      title: '95% Faster Hiring',
      description: 'Reduce time-to-hire from months to weeks with our streamlined process',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Target,
      title: 'Perfect Matches',
      description: 'AI-powered matching ensures cultural and technical fit',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: Users,
      title: 'Elite Network',
      description: 'Connect with top 5% of developers from leading tech companies',
      color: 'from-orange-500 to-red-500',
    },
  ];

  const stats = [
    { label: 'Average Time to Hire', value: '14 days', icon: Clock },
    { label: 'Success Rate', value: '95%', icon: CheckCircle },
    { label: 'Cost Reduction', value: '60%', icon: DollarSign },
    { label: 'Partner Companies', value: '850+', icon: Building },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Head of Engineering',
      company: 'TechCorp',
      content: 'Chosn helped us hire 5 senior developers in just 3 weeks. The quality of candidates was exceptional.',
      rating: 5,
    },
    {
      name: 'Michael Chen',
      role: 'CTO',
      company: 'StartupXYZ',
      content: 'The pre-validated talent pool saved us countless hours of screening. Highly recommend!',
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-24 bg-gradient-to-br from-background via-background to-muted/20 relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-brand-accent/5 rounded-full blur-3xl animate-float" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-primary/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              className="text-center max-w-4xl mx-auto mb-16"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Badge variant="secondary" className="mb-4 px-4 py-2">
                <Briefcase className="w-4 h-4 mr-2" />
                For Companies
              </Badge>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
                Hire <span className="gradient-text">Elite Developers</span> Fast
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Access pre-validated, top-tier developers and reduce your hiring time by 95%. 
                Join 850+ companies who trust Chosn for their talent needs.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" className="gradient-bg px-8 py-4 text-lg" asChild>
                  <Link href="#contact">
                    Start Hiring Now
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="px-8 py-4 text-lg">
                  Schedule Demo
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
                    <stat.icon className="w-8 h-8 mx-auto mb-3 text-brand-accent" />
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
                Why Companies Choose <span className="gradient-text">Chosn</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Transform your hiring process with our elite developer marketplace
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

        {/* Testimonials Section */}
        <section className="py-24 bg-muted/20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Trusted by <span className="gradient-text">Industry Leaders</span>
              </h2>
              <p className="text-xl text-muted-foreground">
                See what our partner companies say about their experience
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full">
                    <CardContent className="p-8">
                      <div className="flex space-x-1 mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-brand-accent text-brand-accent" />
                        ))}
                      </div>
                      <blockquote className="text-lg mb-6 leading-relaxed">
                        "{testimonial.content}"
                      </blockquote>
                      <div>
                        <div className="font-semibold">{testimonial.name}</div>
                        <div className="text-muted-foreground">{testimonial.role} at {testimonial.company}</div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section id="contact" className="py-24">
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
                  Start Hiring <span className="gradient-text">Elite Talent</span>
                </h2>
                <p className="text-lg text-muted-foreground">
                  Get in touch to learn how Chosn can transform your hiring process
                </p>
              </div>

              <Card className="bg-card/50 backdrop-blur-sm border-0">
                <CardContent className="p-8">
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="companyName">Company Name *</Label>
                        <Input
                          id="companyName"
                          placeholder="Acme Corp"
                          {...register('companyName')}
                        />
                        {errors.companyName && (
                          <p className="text-sm text-red-500 mt-1">{errors.companyName.message}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="contactName">Contact Name *</Label>
                        <Input
                          id="contactName"
                          placeholder="Jane Smith"
                          {...register('contactName')}
                        />
                        {errors.contactName && (
                          <p className="text-sm text-red-500 mt-1">{errors.contactName.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="email"
                            type="email"
                            placeholder="jane@acmecorp.com"
                            className="pl-10"
                            {...register('email')}
                          />
                        </div>
                        {errors.email && (
                          <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="phone"
                            placeholder="+1 (555) 123-4567"
                            className="pl-10"
                            {...register('phone')}
                          />
                        </div>
                        {errors.phone && (
                          <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="website">Company Website</Label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="website"
                          placeholder="https://acmecorp.com"
                          className="pl-10"
                          {...register('website')}
                        />
                      </div>
                      {errors.website && (
                        <p className="text-sm text-red-500 mt-1">{errors.website.message}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="companySize">Company Size *</Label>
                        <select
                          id="companySize"
                          className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
                          {...register('companySize')}
                        >
                          <option value="">Select size</option>
                          <option value="1-10">1-10 employees</option>
                          <option value="11-50">11-50 employees</option>
                          <option value="51-200">51-200 employees</option>
                          <option value="201-1000">201-1000 employees</option>
                          <option value="1000+">1000+ employees</option>
                        </select>
                        {errors.companySize && (
                          <p className="text-sm text-red-500 mt-1">{errors.companySize.message}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="industry">Industry *</Label>
                        <Input
                          id="industry"
                          placeholder="Technology, Finance, Healthcare..."
                          {...register('industry')}
                        />
                        {errors.industry && (
                          <p className="text-sm text-red-500 mt-1">{errors.industry.message}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="description">Company Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Tell us about your company and what you do..."
                        rows={3}
                        {...register('description')}
                      />
                      {errors.description && (
                        <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="hiringNeeds">Hiring Needs *</Label>
                      <Textarea
                        id="hiringNeeds"
                        placeholder="What roles are you looking to fill? What skills are you seeking?"
                        rows={3}
                        {...register('hiringNeeds')}
                      />
                      {errors.hiringNeeds && (
                        <p className="text-sm text-red-500 mt-1">{errors.hiringNeeds.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="timeline">Timeline</Label>
                      <select
                        id="timeline"
                        className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
                        {...register('timeline')}
                      >
                        <option value="">Select timeline</option>
                        <option value="immediate">Immediate (within 2 weeks)</option>
                        <option value="1-month">Within 1 month</option>
                        <option value="3-months">Within 3 months</option>
                        <option value="6-months">Within 6 months</option>
                        <option value="ongoing">Ongoing hiring</option>
                      </select>
                      {errors.timeline && (
                        <p className="text-sm text-red-500 mt-1">{errors.timeline.message}</p>
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
                          <span>Submitting...</span>
                        </div>
                      ) : (
                        <>
                          Get Started with Chosn
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </>
                      )}
                    </Button>

                    <p className="text-sm text-muted-foreground text-center">
                      We'll get back to you within 24 hours to discuss your hiring needs
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