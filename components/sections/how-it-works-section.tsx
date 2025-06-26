"use client";

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  UserPlus, 
  FileCheck, 
  Target, 
  Handshake,
  ArrowRight,
  CheckCircle,
  Clock,
  Star
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export function HowItWorksSection() {
  const developerSteps = [
    {
      icon: UserPlus,
      title: 'Create Your Profile',
      description: 'Build a comprehensive profile showcasing your skills, experience, and portfolio projects.',
      details: ['Import from GitHub', 'Skill verification', 'Portfolio showcase'],
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: FileCheck,
      title: 'Get Validated',
      description: 'Our expert team reviews your profile and validates your technical expertise.',
      details: ['Technical assessment', 'Code review', 'Industry verification'],
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: Target,
      title: 'Get Matched',
      description: 'Our AI algorithm matches you with companies looking for your specific skills.',
      details: ['Smart matching', 'Cultural fit', 'Salary alignment'],
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Handshake,
      title: 'Connect & Interview',
      description: 'Companies reach out to you directly with personalized opportunities.',
      details: ['Direct outreach', 'Streamlined process', 'Negotiation support'],
      color: 'from-orange-500 to-red-500',
    },
  ];

  const companySteps = [
    {
      icon: Target,
      title: 'Define Requirements',
      description: 'Specify your technical needs, team culture, and ideal candidate profile.',
      details: ['Skill requirements', 'Experience level', 'Cultural preferences'],
      color: 'from-indigo-500 to-purple-500',
    },
    {
      icon: FileCheck,
      title: 'Browse Validated Talent',
      description: 'Access our curated pool of pre-validated, elite developers.',
      details: ['Verified profiles', 'Skill assessments', 'Portfolio reviews'],
      color: 'from-teal-500 to-blue-500',
    },
    {
      icon: Handshake,
      title: 'Connect Directly',
      description: 'Reach out to developers who match your requirements perfectly.',
      details: ['Direct messaging', 'Interview scheduling', 'Offer management'],
      color: 'from-green-500 to-teal-500',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
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
    <section className="py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Badge variant="secondary" className="mb-4 px-4 py-2">
            <Clock className="w-4 h-4 mr-2" />
            How It Works
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Simple, <span className="gradient-text">Effective</span> Process
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We've streamlined the hiring process to make it effortless for both 
            developers and companies to find their perfect match.
          </p>
        </motion.div>

        {/* For Developers */}
        <div className="mb-20">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl sm:text-3xl font-bold mb-4">For Developers</h3>
            <p className="text-muted-foreground text-lg">
              Get discovered by top companies without the hassle of job applications
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {developerSteps.map((step, index) => (
              <motion.div key={step.title} variants={itemVariants}>
                <Card className="h-full hover-lift group relative overflow-hidden">
                  <div className="absolute top-4 right-4 text-6xl font-bold text-muted/10">
                    {index + 1}
                  </div>
                  <CardContent className="p-6">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${step.color} w-fit mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <step.icon className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="text-lg font-semibold mb-3">{step.title}</h4>
                    <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                      {step.description}
                    </p>
                    <ul className="space-y-2">
                      {step.details.map((detail) => (
                        <li key={detail} className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  {index < developerSteps.length - 1 && (
                    <div className="hidden lg:block absolute -right-3 top-1/2 transform -translate-y-1/2 z-10">
                      <div className="w-6 h-6 bg-background border-2 border-muted rounded-full flex items-center justify-center">
                        <ArrowRight className="w-3 h-3 text-muted-foreground" />
                      </div>
                    </div>
                  )}
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="text-center mt-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <Button size="lg" className="gradient-bg" asChild>
              <Link href="/signup">
                Start Your Developer Journey
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </motion.div>
        </div>

        {/* For Companies */}
        <div>
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl sm:text-3xl font-bold mb-4">For Companies</h3>
            <p className="text-muted-foreground text-lg">
              Access pre-validated talent and hire with confidence
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {companySteps.map((step, index) => (
              <motion.div key={step.title} variants={itemVariants}>
                <Card className="h-full hover-lift group relative overflow-hidden">
                  <div className="absolute top-4 right-4 text-6xl font-bold text-muted/10">
                    {index + 1}
                  </div>
                  <CardContent className="p-6">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${step.color} w-fit mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <step.icon className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="text-lg font-semibold mb-3">{step.title}</h4>
                    <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                      {step.description}
                    </p>
                    <ul className="space-y-2">
                      {step.details.map((detail) => (
                        <li key={detail} className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  {index < companySteps.length - 1 && (
                    <div className="hidden md:block absolute -right-4 top-1/2 transform -translate-y-1/2 z-10">
                      <div className="w-6 h-6 bg-background border-2 border-muted rounded-full flex items-center justify-center">
                        <ArrowRight className="w-3 h-3 text-muted-foreground" />
                      </div>
                    </div>
                  )}
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="text-center mt-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <Button size="lg" variant="outline" className="border-2" asChild>
              <Link href="/companies">
                Start Hiring Elite Talent
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}