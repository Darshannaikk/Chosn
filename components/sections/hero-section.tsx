"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight, 
  Play, 
  Star, 
  Users, 
  Briefcase, 
  TrendingUp,
  Sparkles,
  Code2,
  Zap
} from 'lucide-react';
import { motion } from 'framer-motion';

export function HeroSection() {
  const [currentStat, setCurrentStat] = useState(0);
  
  const stats = [
    { label: 'Elite Developers', value: '10K+', icon: Users },
    { label: 'Top Companies', value: '500+', icon: Briefcase },
    { label: 'Success Rate', value: '95%', icon: TrendingUp },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % stats.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [stats.length]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.6, -0.05, 0.01, 0.99],
      },
    },
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/20" />
      
      {/* Animated Background Shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-brand-primary/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-accent/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-brand-primary/3 to-brand-secondary/3 rounded-full blur-3xl animate-pulse-slow" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="text-center max-w-5xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Announcement Badge */}
          <motion.div variants={itemVariants} className="mb-8">
            <Badge 
              variant="secondary" 
              className="px-4 py-2 text-sm font-medium bg-brand-primary/10 text-brand-primary border-brand-primary/20 hover:bg-brand-primary/20 transition-colors"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Now in Beta - Join 10,000+ Elite Developers
              <ArrowRight className="w-4 h-4 ml-2" />
            </Badge>
          </motion.div>

          {/* Main Headline */}
          <motion.h1 
            variants={itemVariants}
            className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight mb-6"
          >
            <span className="block">Don't Apply,</span>
            <span className="block gradient-text">Get Applied</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p 
            variants={itemVariants}
            className="text-xl sm:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            The premium marketplace where elite developers get discovered by 
            industry-leading companies. Build your profile, showcase your skills, 
            and let opportunities come to you.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          >
            <Button 
              size="lg" 
              className="gradient-bg text-white px-8 py-4 text-lg font-semibold hover-lift group"
              asChild
            >
              <Link href="/signup">
                <Code2 className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                Join as Developer
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            
            <Button 
              size="lg" 
              variant="outline" 
              className="px-8 py-4 text-lg font-semibold border-2 hover:bg-muted/50 group"
              asChild
            >
              <Link href="/companies">
                <Briefcase className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Hire Talent
              </Link>
            </Button>
          </motion.div>

          {/* Rotating Stats */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-8 mb-16"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className={`flex items-center space-x-3 transition-all duration-500 ${
                  index === currentStat 
                    ? 'text-brand-primary scale-110' 
                    : 'text-muted-foreground'
                }`}
                animate={{
                  scale: index === currentStat ? 1.1 : 1,
                  opacity: index === currentStat ? 1 : 0.7,
                }}
              >
                <div className={`p-2 rounded-lg transition-colors ${
                  index === currentStat 
                    ? 'bg-brand-primary/10' 
                    : 'bg-muted/50'
                }`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Social Proof */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-col items-center space-y-4"
          >
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-brand-accent text-brand-accent" />
              ))}
            </div>
            <p className="text-muted-foreground">
              Trusted by developers at Google, Meta, Netflix, and 500+ other companies
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-muted-foreground/50 rounded-full mt-2 animate-pulse" />
        </div>
      </motion.div>
    </section>
  );
}