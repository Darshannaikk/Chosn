"use client";

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { TestimonialsSection } from '@/components/sections/testimonials-section';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Star, 
  ArrowRight, 
  Users, 
  TrendingUp,
  DollarSign,
  Clock,
  Quote,
  CheckCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function SuccessStoriesPage() {
  const featuredStories = [
    {
      id: 1,
      name: 'Sarah Chen',
      role: 'Senior Full Stack Developer',
      company: 'Netflix',
      previousCompany: 'Startup',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      story: 'After years of applying to countless positions with minimal responses, Chosn completely transformed my career trajectory. Within 48 hours of creating my profile, I had three interview requests from top-tier companies. The validation process gave me confidence in my abilities, and the personalized matching meant every opportunity was genuinely relevant to my skills and career goals.',
      metrics: {
        salaryIncrease: '85%',
        timeToHire: '2 weeks',
        interviewRequests: 8,
        offers: 3
      },
      skills: ['React', 'Node.js', 'TypeScript', 'AWS'],
      location: 'San Francisco, CA',
      rating: 5
    },
    {
      id: 2,
      name: 'Marcus Rodriguez',
      role: 'DevOps Engineer',
      company: 'Spotify',
      previousCompany: 'Mid-size Tech',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      story: 'The traditional job search was exhausting and demoralizing. Chosn flipped the script entirely. Instead of sending hundreds of applications into the void, companies started reaching out to me. The quality of opportunities was exceptional, and I found my dream role at Spotify through a direct match. The entire process was smooth, professional, and respectful of my time.',
      metrics: {
        salaryIncrease: '65%',
        timeToHire: '10 days',
        interviewRequests: 12,
        offers: 4
      },
      skills: ['Kubernetes', 'Docker', 'Python', 'GCP'],
      location: 'Remote',
      rating: 5
    },
    {
      id: 3,
      name: 'Alex Johnson',
      role: 'Backend Engineer',
      company: 'Google',
      previousCompany: 'Series A Startup',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      story: 'I was skeptical about another job platform, but Chosn proved to be different. The AI matching was incredibly accurate - every company that reached out was genuinely interested and aligned with my experience. The negotiation support helped me secure a package that exceeded my expectations. Landing at Google through Chosn was a career-defining moment.',
      metrics: {
        salaryIncrease: '120%',
        timeToHire: '3 weeks',
        interviewRequests: 15,
        offers: 5
      },
      skills: ['Go', 'Microservices', 'Distributed Systems', 'Kafka'],
      location: 'Mountain View, CA',
      rating: 5
    }
  ];

  const companyStories = [
    {
      company: 'Airbnb',
      logo: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
      contact: 'Emily Watson',
      role: 'Head of Engineering',
      story: 'Chosn revolutionized our hiring process. We went from spending months screening candidates to having pre-validated, exceptional developers reach out to us. Our time-to-hire decreased by 70%, and the quality of hires has been consistently outstanding.',
      metrics: {
        timeReduction: '70%',
        hireQuality: '95%',
        candidatesHired: 23,
        retention: '96%'
      }
    },
    {
      company: 'TechStart Inc.',
      logo: 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
      contact: 'Lisa Thompson',
      role: 'CTO',
      story: 'As a growing startup, we needed to scale our engineering team quickly without compromising on quality. Chosn\'s platform connected us with developers who were not just technically excellent but also culturally aligned with our mission.',
      metrics: {
        timeReduction: '80%',
        hireQuality: '92%',
        candidatesHired: 12,
        retention: '100%'
      }
    }
  ];

  const stats = [
    { label: 'Average Salary Increase', value: '75%', icon: TrendingUp },
    { label: 'Time to First Interview', value: '3 days', icon: Clock },
    { label: 'Success Rate', value: '94%', icon: CheckCircle },
    { label: 'Developer Satisfaction', value: '4.9/5', icon: Star },
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
                <Users className="w-4 h-4 mr-2" />
                Success Stories
              </Badge>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
                Real Stories, <span className="gradient-text">Real Results</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Discover how developers and companies have transformed their careers and hiring 
                processes with Chosn. These are their authentic success stories.
              </p>
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

        {/* Featured Developer Stories */}
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
                Developer <span className="gradient-text">Success Stories</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                From struggling with job applications to landing dream roles at top companies
              </p>
            </motion.div>

            <div className="space-y-16">
              {featuredStories.map((story, index) => (
                <motion.div
                  key={story.id}
                  className="max-w-6xl mx-auto"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="overflow-hidden bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm border-0">
                    <CardContent className="p-8 md:p-12">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Story Content */}
                        <div className="lg:col-span-2">
                          <div className="flex items-center space-x-2 mb-6">
                            <Quote className="w-8 h-8 text-brand-primary/30" />
                            <div className="flex space-x-1">
                              {[...Array(story.rating)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 fill-brand-accent text-brand-accent" />
                              ))}
                            </div>
                          </div>
                          
                          <blockquote className="text-lg leading-relaxed mb-8 text-foreground">
                            "{story.story}"
                          </blockquote>

                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center space-x-4">
                              <Avatar className="w-16 h-16 border-4 border-brand-primary/20">
                                <AvatarImage src={story.avatar} />
                                <AvatarFallback className="bg-brand-primary text-white text-lg">
                                  {story.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-semibold text-lg">{story.name}</div>
                                <div className="text-muted-foreground">{story.role}</div>
                                <div className="text-sm text-muted-foreground">
                                  {story.previousCompany} → {story.company}
                                </div>
                                <div className="text-sm text-muted-foreground">{story.location}</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Metrics & Skills */}
                        <div className="space-y-6">
                          <div>
                            <h4 className="font-semibold mb-4">Success Metrics</h4>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                                <div className="text-2xl font-bold text-green-600">{story.metrics.salaryIncrease}</div>
                                <div className="text-sm text-muted-foreground">Salary Increase</div>
                              </div>
                              <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                                <div className="text-2xl font-bold text-blue-600">{story.metrics.timeToHire}</div>
                                <div className="text-sm text-muted-foreground">Time to Hire</div>
                              </div>
                              <div className="text-center p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                                <div className="text-2xl font-bold text-purple-600">{story.metrics.interviewRequests}</div>
                                <div className="text-sm text-muted-foreground">Interview Requests</div>
                              </div>
                              <div className="text-center p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                                <div className="text-2xl font-bold text-orange-600">{story.metrics.offers}</div>
                                <div className="text-sm text-muted-foreground">Job Offers</div>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h4 className="font-semibold mb-4">Key Skills</h4>
                            <div className="flex flex-wrap gap-2">
                              {story.skills.map((skill) => (
                                <Badge key={skill} variant="outline" className="bg-brand-primary/10 text-brand-primary border-brand-primary/20">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Company Success Stories */}
        <section className="py-24 bg-muted/20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
                Company <span className="gradient-text">Success Stories</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                How leading companies transformed their hiring with Chosn
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {companyStories.map((story, index) => (
                <motion.div
                  key={story.company}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full hover-lift">
                    <CardContent className="p-8">
                      <div className="flex items-center space-x-4 mb-6">
                        <Avatar className="w-16 h-16">
                          <AvatarImage src={story.logo} />
                          <AvatarFallback className="bg-brand-accent text-white text-lg">
                            {story.company.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="text-xl font-bold">{story.company}</h3>
                          <div className="text-muted-foreground">{story.contact}</div>
                          <div className="text-sm text-muted-foreground">{story.role}</div>
                        </div>
                      </div>

                      <blockquote className="text-muted-foreground leading-relaxed mb-6">
                        "{story.story}"
                      </blockquote>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-muted/50 rounded-lg">
                          <div className="text-lg font-bold text-brand-primary">{story.metrics.timeReduction}</div>
                          <div className="text-xs text-muted-foreground">Time Reduction</div>
                        </div>
                        <div className="text-center p-3 bg-muted/50 rounded-lg">
                          <div className="text-lg font-bold text-brand-primary">{story.metrics.hireQuality}</div>
                          <div className="text-xs text-muted-foreground">Hire Quality</div>
                        </div>
                        <div className="text-center p-3 bg-muted/50 rounded-lg">
                          <div className="text-lg font-bold text-brand-primary">{story.metrics.candidatesHired}</div>
                          <div className="text-xs text-muted-foreground">Candidates Hired</div>
                        </div>
                        <div className="text-center p-3 bg-muted/50 rounded-lg">
                          <div className="text-lg font-bold text-brand-primary">{story.metrics.retention}</div>
                          <div className="text-xs text-muted-foreground">Retention Rate</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <TestimonialsSection />

        {/* CTA Section */}
        <section className="py-24 bg-gradient-to-br from-brand-primary to-brand-secondary text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
                Ready to Write Your Success Story?
              </h2>
              <p className="text-xl text-white/90 mb-8 leading-relaxed">
                Join thousands of developers and companies who have already transformed 
                their careers and hiring processes with Chosn.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" variant="secondary" className="bg-white text-brand-primary hover:bg-white/90 px-8 py-4 text-lg" asChild>
                  <Link href="/signup">
                    Start Your Journey
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-4 text-lg" asChild>
                  <Link href="/companies">
                    Hire Elite Talent
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}