"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  Mail, 
  MapPin, 
  Calendar,
  Github,
  Linkedin,
  Globe,
  Plus,
  Edit,
  Save,
  X,
  Star,
  Award,
  Code2,
  Briefcase,
  Settings,
  Camera,
  Zap,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/hooks/use-auth';
import { githubService } from '@/lib/services/github';
import { toast } from 'sonner';
import { SocialCardGenerator } from '@/components/features/social-card-generator';

export default function ProfilePage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isConnectingGitHub, setIsConnectingGitHub] = useState(false);
  const [githubConnected, setGithubConnected] = useState(false);
  const [validatedSkills, setValidatedSkills] = useState<any[]>([]);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: 'Passionate full-stack developer with 5+ years of experience building scalable web applications. Love working with React, Node.js, and cloud technologies.',
    location: 'San Francisco, CA',
    timezone: 'PST',
    skills: ['React', 'TypeScript', 'Node.js', 'Python', 'AWS', 'Docker'],
    experience: 5,
    availability: 'available' as 'available' | 'busy' | 'not-looking',
    github: 'https://github.com/johndoe',
    linkedin: 'https://linkedin.com/in/johndoe',
    portfolio: 'https://johndoe.dev',
    projects: [
      {
        id: '1',
        title: 'E-commerce Platform',
        description: 'Full-stack e-commerce solution built with React, Node.js, and PostgreSQL',
        technologies: ['React', 'Node.js', 'PostgreSQL', 'Stripe'],
        url: 'https://ecommerce-demo.com',
        github: 'https://github.com/johndoe/ecommerce',
        image: 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&dpr=2'
      },
      {
        id: '2',
        title: 'Task Management App',
        description: 'Real-time collaborative task management with drag-and-drop functionality',
        technologies: ['React', 'Socket.io', 'MongoDB', 'Express'],
        url: 'https://taskapp-demo.com',
        github: 'https://github.com/johndoe/taskapp',
        image: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&dpr=2'
      }
    ],
    achievements: [
      {
        id: '1',
        title: 'AWS Certified Solutions Architect',
        description: 'Professional level certification for cloud architecture',
        date: '2023-06-15',
        type: 'certification' as const
      },
      {
        id: '2',
        title: 'Tech Conference Speaker',
        description: 'Spoke about React performance optimization at ReactConf 2023',
        date: '2023-09-20',
        type: 'speaking' as const
      }
    ],
    preferences: {
      jobTypes: ['Full-time', 'Contract'],
      salaryRange: { min: 150000, max: 200000 },
      remoteOnly: false,
      companySizes: ['Startup', 'Medium', 'Enterprise'],
      industries: ['Technology', 'Fintech', 'Healthcare']
    }
  });

  const [newSkill, setNewSkill] = useState('');

  const handleSave = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleConnectGitHub = async () => {
    if (!user) {
      toast.error('Please sign in first');
      return;
    }

    setIsConnectingGitHub(true);
    try {
      const { url } = await githubService.connectGitHub();
      window.location.href = url;
    } catch (error) {
      console.error('GitHub connection error:', error);
      toast.error('Failed to connect to GitHub');
      setIsConnectingGitHub(false);
    }
  };

  const handleAnalyzeGitHub = async () => {
    if (!user) return;

    try {
      const skills = await githubService.validateSkills();
      await githubService.saveToProfile(user.id);
      
      setValidatedSkills(skills);
      setGithubConnected(true);
      toast.success(`GitHub analysis complete! Found ${skills.length} validated skills.`);
    } catch (error) {
      console.error('GitHub analysis error:', error);
      toast.error('Failed to analyze GitHub profile');
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !profileData.skills.includes(newSkill.trim())) {
      setProfileData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setProfileData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  const availabilityColors = {
    available: 'bg-green-500',
    busy: 'bg-yellow-500',
    'not-looking': 'bg-red-500'
  };

  const availabilityLabels = {
    available: 'Available',
    busy: 'Busy',
    'not-looking': 'Not Looking'
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Profile Header */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Card className="mb-8">
                <CardContent className="p-8">
                  <div className="flex flex-col md:flex-row items-start space-y-6 md:space-y-0 md:space-x-8">
                    <div className="relative">
                      <Avatar className="w-32 h-32 border-4 border-brand-primary/20">
                        <AvatarImage src={user?.avatar} alt={user?.name} />
                        <AvatarFallback className="bg-brand-primary text-white text-3xl">
                          {user?.name?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      {isEditing && (
                        <Button
                          size="sm"
                          className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
                        >
                          <Camera className="w-4 h-4" />
                        </Button>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          {isEditing ? (
                            <Input
                              value={profileData.name}
                              onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                              className="text-2xl font-bold mb-2"
                            />
                          ) : (
                            <h1 className="text-3xl font-bold mb-2">{profileData.name}</h1>
                          )}
                          <div className="flex items-center space-x-4 text-muted-foreground mb-2">
                            <div className="flex items-center space-x-1">
                              <Mail className="w-4 h-4" />
                              <span>{profileData.email}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-4 h-4" />
                              {isEditing ? (
                                <Input
                                  value={profileData.location}
                                  onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                                  className="w-32"
                                />
                              ) : (
                                <span>{profileData.location}</span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className={`w-3 h-3 rounded-full ${availabilityColors[profileData.availability]}`} />
                            <span className="text-sm font-medium">{availabilityLabels[profileData.availability]}</span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          {isEditing ? (
                            <>
                              <Button onClick={handleSave} size="sm">
                                <Save className="w-4 h-4 mr-2" />
                                Save
                              </Button>
                              <Button onClick={() => setIsEditing(false)} variant="outline" size="sm">
                                <X className="w-4 h-4 mr-2" />
                                Cancel
                              </Button>
                            </>
                          ) : (
                            <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
                              <Edit className="w-4 h-4 mr-2" />
                              Edit Profile
                            </Button>
                          )}
                        </div>
                      </div>

                      {isEditing ? (
                        <Textarea
                          value={profileData.bio}
                          onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                          rows={3}
                          className="mb-4"
                        />
                      ) : (
                        <p className="text-muted-foreground mb-4 leading-relaxed">{profileData.bio}</p>
                      )}

                      <div className="flex flex-wrap gap-2">
                        {profileData.skills.map((skill) => (
                          <Badge key={skill} variant="secondary" className="relative group">
                            {skill}
                            {isEditing && (
                              <button
                                onClick={() => removeSkill(skill)}
                                className="ml-2 text-red-500 hover:text-red-700"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            )}
                          </Badge>
                        ))}
                        {isEditing && (
                          <div className="flex items-center space-x-2">
                            <Input
                              value={newSkill}
                              onChange={(e) => setNewSkill(e.target.value)}
                              placeholder="Add skill"
                              className="w-24"
                              onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                            />
                            <Button onClick={addSkill} size="sm" variant="outline">
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Profile Tabs */}
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="projects">Projects</TabsTrigger>
                <TabsTrigger value="github">GitHub</TabsTrigger>
                <TabsTrigger value="achievements">Achievements</TabsTrigger>
                <TabsTrigger value="preferences">Preferences</TabsTrigger>
                <TabsTrigger value="social">Social Card</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <User className="w-5 h-5" />
                        <span>Basic Information</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Experience Level</label>
                        <p className="text-muted-foreground">{profileData.experience} years</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Timezone</label>
                        <p className="text-muted-foreground">{profileData.timezone}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Availability</label>
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${availabilityColors[profileData.availability]}`} />
                          <span className="text-muted-foreground">{availabilityLabels[profileData.availability]}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Globe className="w-5 h-5" />
                        <span>Links</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <Github className="w-5 h-5 text-muted-foreground" />
                        <a href={profileData.github} target="_blank" rel="noopener noreferrer" 
                           className="text-brand-primary hover:underline">
                          GitHub Profile
                        </a>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Linkedin className="w-5 h-5 text-muted-foreground" />
                        <a href={profileData.linkedin} target="_blank" rel="noopener noreferrer" 
                           className="text-brand-primary hover:underline">
                          LinkedIn Profile
                        </a>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Globe className="w-5 h-5 text-muted-foreground" />
                        <a href={profileData.portfolio} target="_blank" rel="noopener noreferrer" 
                           className="text-brand-primary hover:underline">
                          Portfolio Website
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="github" className="space-y-6">
                {!githubConnected ? (
                  <Card>
                    <CardHeader>
                      <div className="flex items-center space-x-2">
                        <Github className="w-5 h-5" />
                        <CardTitle className="text-lg">Connect GitHub</CardTitle>
                      </div>
                      <p className="text-muted-foreground">
                        Validate your skills automatically by analyzing your GitHub repositories.
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Benefits */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-start space-x-3">
                          <Zap className="w-5 h-5 text-brand-primary mt-0.5" />
                          <div>
                            <h4 className="font-medium text-sm">Automatic Skill Validation</h4>
                            <p className="text-xs text-muted-foreground">
                              We analyze your code to validate programming languages
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <Code2 className="w-5 h-5 text-brand-primary mt-0.5" />
                          <div>
                            <h4 className="font-medium text-sm">Portfolio Integration</h4>
                            <p className="text-xs text-muted-foreground">
                              Top repositories added to your profile
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <Star className="w-5 h-5 text-brand-primary mt-0.5" />
                          <div>
                            <h4 className="font-medium text-sm">Credibility Score</h4>
                            <p className="text-xs text-muted-foreground">
                              Build trust through verified contributions
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <CheckCircle className="w-5 h-5 text-brand-primary mt-0.5" />
                          <div>
                            <h4 className="font-medium text-sm">Activity Tracking</h4>
                            <p className="text-xs text-muted-foreground">
                              Recent contributions show active development
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Security Notice */}
                      <div className="flex items-start space-x-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <AlertCircle className="w-4 h-4 text-blue-500 mt-0.5" />
                        <div className="text-sm">
                          <p className="text-blue-700 dark:text-blue-300 font-medium">Secure Connection</p>
                          <p className="text-blue-600 dark:text-blue-400">
                            We only access your public repositories. No private data is accessed.
                          </p>
                        </div>
                      </div>

                      {/* Connect Button */}
                      <Button 
                        onClick={handleConnectGitHub} 
                        disabled={isConnectingGitHub}
                        className="w-full"
                        size="lg"
                      >
                        {isConnectingGitHub ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Connecting to GitHub...
                          </>
                        ) : (
                          <>
                            <Github className="w-4 h-4 mr-2" />
                            Connect GitHub Account
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardHeader>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <CardTitle className="text-lg">GitHub Connected!</CardTitle>
                      </div>
                      <p className="text-muted-foreground">
                        Your GitHub profile has been analyzed and skills validated.
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <h4 className="font-medium mb-3">Validated Skills ({validatedSkills.length})</h4>
                        <div className="grid grid-cols-1 gap-3">
                          {validatedSkills.slice(0, 8).map((skill) => (
                            <div key={skill.skill} className="flex items-center justify-between p-3 border rounded-lg">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <span className="font-medium">{skill.skill}</span>
                                  <Badge variant={skill.confidence >= 70 ? 'default' : 'secondary'}>
                                    {skill.confidence}% confidence
                                  </Badge>
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {skill.evidence.repositories.length} repositories • 
                                  {skill.evidence.recentUsage ? ' Recent usage' : ' Not recently used'} • 
                                  {skill.evidence.projectComplexity} level
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="projects" className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Portfolio Projects</h3>
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Project
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {profileData.projects.map((project) => (
                    <Card key={project.id} className="overflow-hidden">
                      <div className="aspect-video bg-muted relative">
                        <Image 
                          src={project.image} 
                          alt={project.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
                      <CardContent className="p-6">
                        <h4 className="font-semibold mb-2">{project.title}</h4>
                        <p className="text-muted-foreground text-sm mb-4">{project.description}</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.technologies.map((tech) => (
                            <Badge key={tech} variant="outline" className="text-xs">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" asChild>
                            <a href={project.url} target="_blank" rel="noopener noreferrer">
                              <Globe className="w-4 h-4 mr-2" />
                              Live Demo
                            </a>
                          </Button>
                          <Button size="sm" variant="outline" asChild>
                            <a href={project.github} target="_blank" rel="noopener noreferrer">
                              <Github className="w-4 h-4 mr-2" />
                              Code
                            </a>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="achievements" className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Achievements & Certifications</h3>
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Achievement
                  </Button>
                </div>

                <div className="space-y-4">
                  {profileData.achievements.map((achievement) => (
                    <Card key={achievement.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <div className="p-2 rounded-lg bg-brand-primary/10">
                            <Award className="w-6 h-6 text-brand-primary" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold mb-1">{achievement.title}</h4>
                            <p className="text-muted-foreground text-sm mb-2">{achievement.description}</p>
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              <div className="flex items-center space-x-1">
                                <Calendar className="w-4 h-4" />
                                <span>{new Date(achievement.date).toLocaleDateString()}</span>
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {achievement.type}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="preferences" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Job Preferences</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Job Types</label>
                      <div className="flex flex-wrap gap-2">
                        {profileData.preferences.jobTypes.map((type) => (
                          <Badge key={type} variant="secondary">{type}</Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Salary Range</label>
                      <p className="text-muted-foreground">
                        ${profileData.preferences.salaryRange.min.toLocaleString()} - ${profileData.preferences.salaryRange.max.toLocaleString()}
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Company Sizes</label>
                      <div className="flex flex-wrap gap-2">
                        {profileData.preferences.companySizes.map((size) => (
                          <Badge key={size} variant="outline">{size}</Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Industries</label>
                      <div className="flex flex-wrap gap-2">
                        {profileData.preferences.industries.map((industry) => (
                          <Badge key={industry} variant="outline">{industry}</Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        checked={profileData.preferences.remoteOnly}
                        readOnly
                        className="rounded"
                      />
                      <label className="text-sm">Remote work only</label>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="social">
                <SocialCardGenerator />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

