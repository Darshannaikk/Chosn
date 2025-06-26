"use client";

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Zap, 
  Target, 
  Brain, 
  Users, 
  TrendingUp,
  Code2,
  Award,
  Globe,
  Lock,
  BarChart3,
  Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';

export function FeaturesSection() {
  const features = [
    {
      icon: Shield,
      title: 'Elite Validation',
      description: 'Rigorous technical assessment and portfolio review ensures only top-tier developers join our platform.',
      badge: 'Quality First',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Brain,
      title: 'AI-Powered Matching',
      description: 'Advanced algorithms analyze skills, experience, and preferences to create perfect developer-company matches.',
      badge: 'Smart Tech',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Target,
      title: 'Precision Targeting',
      description: 'Companies find exactly the talent they need based on specific technical requirements and cultural fit.',
      badge: 'Perfect Fit',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: Zap,
      title: 'Instant Connections',
      description: 'Real-time notifications and streamlined communication accelerate the hiring process.',
      badge: 'Lightning Fast',
      color: 'from-yellow-500 to-orange-500',
    },
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description: 'Comprehensive insights into profile performance, match quality, and market trends.',
      badge: 'Data Driven',
      color: 'from-indigo-500 to-purple-500',
    },
    {
      icon: Globe,
      title: 'Global Reach',
      description: 'Connect with opportunities worldwide, from Silicon Valley startups to Fortune 500 companies.',
      badge: 'Worldwide',
      color: 'from-teal-500 to-blue-500',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.6, -0.05, 0.01, 0.99],
      },
    },
  };

  return (
    <section className="py-24 bg-muted/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Badge variant="secondary" className="mb-4 px-4 py-2">
            <Sparkles className="w-4 h-4 mr-2" />
            Platform Features
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Built for <span className="gradient-text">Excellence</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Every feature is designed to create meaningful connections between 
            exceptional developers and forward-thinking companies.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((feature, index) => (
            <motion.div key={feature.title} variants={itemVariants}>
              <Card className="h-full hover-lift border-0 bg-card/50 backdrop-blur-sm group">
                <CardContent className="p-8">
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${feature.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-3">
                        <h3 className="text-xl font-semibold">{feature.title}</h3>
                        <Badge variant="outline" className="text-xs">
                          {feature.badge}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Additional Feature Highlights */}
        <motion.div
          className="mt-20 grid grid-cols-1 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Card className="lg:col-span-2 bg-gradient-to-br from-brand-primary/5 to-brand-secondary/5 border-brand-primary/20">
            <CardContent className="p-8">
              <div className="flex items-start space-x-4">
                <div className="p-3 rounded-xl bg-brand-primary/10">
                  <Code2 className="w-8 h-8 text-brand-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-3">Developer-First Experience</h3>
                  <p className="text-muted-foreground text-lg leading-relaxed mb-4">
                    We've built every interaction with developers in mind. From seamless 
                    onboarding to intelligent job matching, your experience is our priority.
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-brand-primary rounded-full" />
                      <span>One-click portfolio import from GitHub</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-brand-primary rounded-full" />
                      <span>Automated skill assessment and verification</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-brand-primary rounded-full" />
                      <span>Real-time market insights and salary data</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-brand-accent/5 to-yellow-500/5 border-brand-accent/20">
            <CardContent className="p-8 text-center">
              <div className="p-4 rounded-xl bg-brand-accent/10 w-fit mx-auto mb-4">
                <Award className="w-8 h-8 text-brand-accent" />
              </div>
              <h3 className="text-xl font-bold mb-3">Premium Quality</h3>
              <p className="text-muted-foreground mb-4">
                Only the top 5% of applicants join our platform, ensuring exceptional quality for both developers and companies.
              </p>
              <div className="text-3xl font-bold text-brand-accent">95%</div>
              <div className="text-sm text-muted-foreground">Success Rate</div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}