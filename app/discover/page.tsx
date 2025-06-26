"use client";

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Search,
  Filter,
  MapPin,
  Clock,
  DollarSign,
  Users,
  Building,
  Star,
  Heart,
  X,
  ExternalLink,
  Briefcase,
  Code2,
  Target,
  TrendingUp,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/hooks/use-auth';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from 'sonner';

interface Company {
  id: string;
  name: string;
  logo: string;
  industry: string;
  size: string;
  location: string;
  description: string;
  website: string;
  openPositions: number;
  rating: number;
  founded: string;
  funding: string;
  techStack: string[];
  benefits: string[];
  culture: string[];
  featured: boolean;
}

interface Job {
  id: string;
  companyId: string;
  companyName: string;
  companyLogo: string;
  title: string;
  description: string;
  requirements: string[];
  benefits: string[];
  salaryRange: { min: number; max: number };
  location: string;
  remote: boolean;
  type: 'full-time' | 'part-time' | 'contract';
  experience: string;
  postedAt: string;
  featured: boolean;
}

export default function DiscoverPage() {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<'companies' | 'jobs'>('companies');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Mock data - in real app, this would come from API
      const mockCompanies: Company[] = [
        {
          id: '1',
          name: 'Stripe',
          logo: 'https://images.pexels.com/photos/270408/pexels-photo-270408.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
          industry: 'Fintech',
          size: '1000-5000',
          location: 'San Francisco, CA',
          description: 'Building economic infrastructure for the internet. We help businesses accept payments and manage their operations online.',
          website: 'https://stripe.com',
          openPositions: 45,
          rating: 4.8,
          founded: '2010',
          funding: 'Series H',
          techStack: ['Ruby', 'JavaScript', 'Go', 'React', 'Scala'],
          benefits: ['Equity', 'Health Insurance', 'Unlimited PTO', 'Learning Budget'],
          culture: ['Remote-first', 'Innovation', 'Diversity', 'Growth'],
          featured: true
        },
        {
          id: '2',
          name: 'Vercel',
          logo: 'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
          industry: 'Developer Tools',
          size: '100-500',
          location: 'Remote',
          description: 'The platform for frontend developers, providing the speed and reliability innovators need to create at the moment of inspiration.',
          website: 'https://vercel.com',
          openPositions: 23,
          rating: 4.9,
          founded: '2015',
          funding: 'Series C',
          techStack: ['Next.js', 'React', 'TypeScript', 'Node.js', 'Go'],
          benefits: ['Equity', 'Health Insurance', 'Remote Work', 'Conference Budget'],
          culture: ['Remote-first', 'Open Source', 'Developer Experience'],
          featured: true
        },
        {
          id: '3',
          name: 'Linear',
          logo: 'https://images.pexels.com/photos/164938/pexels-photo-164938.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
          industry: 'Productivity',
          size: '50-100',
          location: 'Remote',
          description: 'The issue tracking tool you\'ll enjoy using. Linear helps streamline software projects, sprints, tasks, and bug tracking.',
          website: 'https://linear.app',
          openPositions: 12,
          rating: 4.7,
          founded: '2019',
          funding: 'Series B',
          techStack: ['TypeScript', 'React', 'Node.js', 'GraphQL', 'PostgreSQL'],
          benefits: ['Equity', 'Health Insurance', 'Flexible Hours', 'Top-tier Equipment'],
          culture: ['Design-focused', 'Quality', 'Remote-first'],
          featured: false
        }
      ];

      const mockJobs: Job[] = [
        {
          id: '1',
          companyId: '1',
          companyName: 'Stripe',
          companyLogo: 'https://images.pexels.com/photos/270408/pexels-photo-270408.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
          title: 'Senior Frontend Engineer',
          description: 'Join our team building the next generation of payment infrastructure. You\'ll work on user-facing products that millions of businesses rely on.',
          requirements: ['5+ years React experience', 'TypeScript proficiency', 'Payment systems knowledge'],
          benefits: ['$180k-$220k', 'Equity', 'Health Insurance', 'Unlimited PTO'],
          salaryRange: { min: 180000, max: 220000 },
          location: 'San Francisco, CA',
          remote: true,
          type: 'full-time',
          experience: 'Senior',
          postedAt: '2024-01-15',
          featured: true
        },
        {
          id: '2',
          companyId: '2',
          companyName: 'Vercel',
          companyLogo: 'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
          title: 'Full Stack Developer',
          description: 'Help us build the platform that powers the modern web. Work on cutting-edge developer tools and infrastructure.',
          requirements: ['Next.js expertise', 'Full-stack experience', 'Cloud platforms'],
          benefits: ['$160k-$200k', 'Equity', 'Remote Work', 'Learning Budget'],
          salaryRange: { min: 160000, max: 200000 },
          location: 'Remote',
          remote: true,
          type: 'full-time',
          experience: 'Mid-Senior',
          postedAt: '2024-01-12',
          featured: true
        }
      ];

      setCompanies(mockCompanies);
      setJobs(mockJobs);
    } catch (error) {
      console.error('Failed to load data:', error);
      toast.error('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         company.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         company.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedFilters.length === 0) return matchesSearch;
    
    return matchesSearch && selectedFilters.some(filter => 
      company.industry.includes(filter) ||
      company.size.includes(filter) ||
      company.techStack.some(tech => tech.toLowerCase().includes(filter.toLowerCase()))
    );
  });

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedFilters.length === 0) return matchesSearch;
    
    return matchesSearch && selectedFilters.some(filter => 
      job.type.includes(filter) ||
      job.experience.toLowerCase().includes(filter.toLowerCase()) ||
      job.location.toLowerCase().includes(filter.toLowerCase())
    );
  });

  const handleSaveCompany = (companyId: string) => {
    toast.success('Company saved to your favorites!');
  };

  const handleApplyToJob = (jobId: string) => {
    if (!isAuthenticated) {
      toast.error('Please sign in to apply for jobs');
      return;
    }
    toast.success('Application submitted! The company will review your profile.');
  };

  const filterOptions = {
    companies: ['Fintech', 'Developer Tools', 'Productivity', 'AI/ML', 'E-commerce', 'Healthcare'],
    jobs: ['Remote', 'Full-time', 'Part-time', 'Contract', 'Senior', 'Mid-level', 'Junior']
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-br from-background via-background to-muted/20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center max-w-4xl mx-auto mb-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl sm:text-5xl font-bold mb-6">
                Discover Your <span className="gradient-text">Dream Opportunity</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Explore top companies and exciting job opportunities in the tech industry
              </p>

              {/* Search Bar */}
              <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    placeholder="Search companies, jobs, or technologies..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-12 text-lg"
                  />
                </div>
                <Popover open={showFilters} onOpenChange={setShowFilters}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="h-12 px-6">
                      <Filter className="w-4 h-4 mr-2" />
                      Filters
                      {selectedFilters.length > 0 && (
                        <Badge variant="secondary" className="ml-2">
                          {selectedFilters.length}
                        </Badge>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <Command>
                      <CommandInput placeholder="Search filters..." />
                      <CommandList>
                        <CommandEmpty>No filters found.</CommandEmpty>
                        <CommandGroup heading="Categories">
                          {filterOptions[activeTab].map((filter) => (
                            <CommandItem
                              key={filter}
                              onSelect={() => {
                                setSelectedFilters(prev => 
                                  prev.includes(filter) 
                                    ? prev.filter(f => f !== filter)
                                    : [...prev, filter]
                                );
                              }}
                            >
                              <div className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  checked={selectedFilters.includes(filter)}
                                  readOnly
                                  className="rounded"
                                />
                                <span>{filter}</span>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            </motion.div>

            {/* Tabs */}
            <motion.div
              className="flex justify-center mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="bg-muted p-1 rounded-lg">
                <Button
                  variant={activeTab === 'companies' ? 'default' : 'ghost'}
                  onClick={() => setActiveTab('companies')}
                  className="px-6"
                >
                  <Building className="w-4 h-4 mr-2" />
                  Companies ({filteredCompanies.length})
                </Button>
                <Button
                  variant={activeTab === 'jobs' ? 'default' : 'ghost'}
                  onClick={() => setActiveTab('jobs')}
                  className="px-6"
                >
                  <Briefcase className="w-4 h-4 mr-2" />
                  Jobs ({filteredJobs.length})
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Content */}
        <section className="py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatePresence mode="wait">
              {/* Companies Tab */}
              {activeTab === 'companies' && (
                <motion.div
                  key="companies"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {[...Array(6)].map((_, i) => (
                        <Card key={i} className="animate-pulse">
                          <CardContent className="p-6">
                            <div className="h-32 bg-muted rounded-lg mb-4" />
                            <div className="h-4 bg-muted rounded mb-2" />
                            <div className="h-4 bg-muted rounded w-2/3" />
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredCompanies.map((company, index) => (
                        <motion.div
                          key={company.id}
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: index * 0.1 }}
                        >
                          <Card className={`hover-lift group ${company.featured ? 'ring-2 ring-brand-primary/20' : ''}`}>
                            {company.featured && (
                              <div className="absolute top-4 right-4 z-10">
                                <Badge className="bg-brand-accent text-white">
                                  <Star className="w-3 h-3 mr-1" />
                                  Featured
                                </Badge>
                              </div>
                            )}
                            <CardContent className="p-6">
                              <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center space-x-4">
                                  <Avatar className="w-16 h-16 border-2 border-muted">
                                    <AvatarImage src={company.logo} alt={company.name} />
                                    <AvatarFallback className="bg-brand-primary text-white text-lg">
                                      {company.name.charAt(0)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <h3 className="text-xl font-semibold">{company.name}</h3>
                                    <p className="text-muted-foreground">{company.industry}</p>
                                    <div className="flex items-center space-x-1 mt-1">
                                      <Star className="w-4 h-4 fill-brand-accent text-brand-accent" />
                                      <span className="text-sm font-medium">{company.rating}</span>
                                    </div>
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleSaveCompany(company.id)}
                                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <Heart className="w-4 h-4" />
                                </Button>
                              </div>

                              <p className="text-muted-foreground mb-4 leading-relaxed line-clamp-3">
                                {company.description}
                              </p>

                              <div className="space-y-3 mb-4">
                                <div className="flex items-center space-x-2 text-sm">
                                  <MapPin className="w-4 h-4 text-muted-foreground" />
                                  <span>{company.location}</span>
                                </div>
                                <div className="flex items-center space-x-2 text-sm">
                                  <Users className="w-4 h-4 text-muted-foreground" />
                                  <span>{company.size} employees</span>
                                </div>
                                <div className="flex items-center space-x-2 text-sm">
                                  <Briefcase className="w-4 h-4 text-muted-foreground" />
                                  <span>{company.openPositions} open positions</span>
                                </div>
                              </div>

                              <div className="mb-4">
                                <p className="text-sm font-medium mb-2">Tech Stack:</p>
                                <div className="flex flex-wrap gap-1">
                                  {company.techStack.slice(0, 4).map((tech) => (
                                    <Badge key={tech} variant="outline" className="text-xs">
                                      {tech}
                                    </Badge>
                                  ))}
                                  {company.techStack.length > 4 && (
                                    <Badge variant="outline" className="text-xs">
                                      +{company.techStack.length - 4} more
                                    </Badge>
                                  )}
                                </div>
                              </div>

                              <div className="flex space-x-2">
                                <Button className="flex-1" size="sm">
                                  View Company
                                </Button>
                                <Button variant="outline" size="sm" asChild>
                                  <a href={company.website} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="w-4 h-4" />
                                  </a>
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* Jobs Tab */}
              {activeTab === 'jobs' && (
                <motion.div
                  key="jobs"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {isLoading ? (
                    <div className="space-y-6">
                      {[...Array(4)].map((_, i) => (
                        <Card key={i} className="animate-pulse">
                          <CardContent className="p-6">
                            <div className="h-24 bg-muted rounded-lg mb-4" />
                            <div className="h-4 bg-muted rounded mb-2" />
                            <div className="h-4 bg-muted rounded w-3/4" />
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {filteredJobs.map((job, index) => (
                        <motion.div
                          key={job.id}
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: index * 0.1 }}
                        >
                          <Card className={`hover-lift ${job.featured ? 'ring-2 ring-brand-primary/20' : ''}`}>
                            <CardContent className="p-6">
                              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                                <div className="flex-1">
                                  <div className="flex items-start space-x-4 mb-4">
                                    <Avatar className="w-12 h-12 border-2 border-muted">
                                      <AvatarImage src={job.companyLogo} alt={job.companyName} />
                                      <AvatarFallback className="bg-brand-primary text-white">
                                        {job.companyName.charAt(0)}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                      <div className="flex items-center space-x-2 mb-1">
                                        <h3 className="text-xl font-semibold">{job.title}</h3>
                                        {job.featured && (
                                          <Badge className="bg-brand-accent text-white">
                                            <Zap className="w-3 h-3 mr-1" />
                                            Featured
                                          </Badge>
                                        )}
                                      </div>
                                      <p className="text-muted-foreground font-medium">{job.companyName}</p>
                                      <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                                        <div className="flex items-center space-x-1">
                                          <MapPin className="w-4 h-4" />
                                          <span>{job.location}</span>
                                          {job.remote && (
                                            <Badge variant="outline" className="text-xs ml-1">Remote</Badge>
                                          )}
                                        </div>
                                        <div className="flex items-center space-x-1">
                                          <DollarSign className="w-4 h-4" />
                                          <span>
                                            ${job.salaryRange.min.toLocaleString()} - 
                                            ${job.salaryRange.max.toLocaleString()}
                                          </span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                          <Clock className="w-4 h-4" />
                                          <span>{job.type}</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  <p className="text-muted-foreground mb-4 leading-relaxed">
                                    {job.description}
                                  </p>

                                  <div className="flex flex-wrap gap-2 mb-4">
                                    {job.requirements.slice(0, 3).map((req) => (
                                      <Badge key={req} variant="outline" className="text-xs">
                                        {req}
                                      </Badge>
                                    ))}
                                    {job.requirements.length > 3 && (
                                      <Badge variant="outline" className="text-xs">
                                        +{job.requirements.length - 3} more
                                      </Badge>
                                    )}
                                  </div>
                                </div>

                                <div className="lg:ml-6 flex flex-col space-y-2 lg:items-end">
                                  <Button
                                    onClick={() => handleApplyToJob(job.id)}
                                    className="gradient-bg"
                                  >
                                    Apply Now
                                  </Button>
                                  <Button variant="outline" size="sm">
                                    Save Job
                                  </Button>
                                  <p className="text-xs text-muted-foreground">
                                    Posted {new Date(job.postedAt).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Empty State */}
            {!isLoading && ((activeTab === 'companies' && filteredCompanies.length === 0) || 
                            (activeTab === 'jobs' && filteredJobs.length === 0)) && (
              <motion.div
                className="text-center py-16"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="max-w-md mx-auto">
                  <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search className="w-12 h-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No results found</h3>
                  <p className="text-muted-foreground mb-6">
                    Try adjusting your search or filters to find what you're looking for.
                  </p>
                  <Button onClick={() => {
                    setSearchQuery('');
                    setSelectedFilters([]);
                  }}>
                    Clear Filters
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}