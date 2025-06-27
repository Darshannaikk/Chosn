"use client";

import { Card, CardContent } from '@/components/ui/card';
import { 
  Users, 
  Briefcase, 
  TrendingUp, 
  Clock,
  DollarSign,
  Globe,
  Award,
  Zap
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function StatsSection() {
  const [isVisible, setIsVisible] = useState(false);

  const stats = [
    {
      icon: Users,
      value: 12500,
      suffix: '+',
      label: 'Elite Developers',
      description: 'Verified professionals',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Briefcase,
      value: 850,
      suffix: '+',
      label: 'Partner Companies',
      description: 'Industry leaders',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: TrendingUp,
      value: 95,
      suffix: '%',
      label: 'Success Rate',
      description: 'Successful placements',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Clock,
      value: 7,
      suffix: ' days',
      label: 'Average Time',
      description: 'To first interview',
      color: 'from-orange-500 to-red-500',
    },
    {
      icon: DollarSign,
      value: 180,
      suffix: 'K',
      label: 'Average Salary',
      description: 'For placed developers',
      color: 'from-yellow-500 to-orange-500',
    },
    {
      icon: Globe,
      value: 45,
      suffix: '+',
      label: 'Countries',
      description: 'Global reach',
      color: 'from-teal-500 to-blue-500',
    },
  ];

  const achievements = [
    {
      icon: Award,
      title: 'Industry Recognition',
      description: 'Winner of TechCrunch Disrupt 2024',
      color: 'from-indigo-500 to-purple-500',
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: '3x faster than traditional hiring',
      color: 'from-yellow-500 to-orange-500',
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById('stats-section');
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);

  const AnimatedNumber = ({ value, suffix }: { value: number; suffix: string }) => {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
      if (!isVisible) return;

      const duration = 2000; // 2 seconds
      const steps = 60;
      const increment = value / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= value) {
          setDisplayValue(value);
          clearInterval(timer);
        } else {
          setDisplayValue(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }, [isVisible, value]);

    return (
      <span className="text-3xl sm:text-4xl font-bold">
        {displayValue.toLocaleString()}{suffix}
      </span>
    );
  };

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
    <section id="stats-section" className="py-24 bg-muted/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Trusted by <span className="gradient-text">Thousands</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our platform has facilitated thousands of successful connections 
            between elite developers and industry-leading companies.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {stats.map((stat) => (
            <motion.div key={stat.label} variants={itemVariants}>
              <Card className="hover-lift group bg-card/50 backdrop-blur-sm border-0">
                <CardContent className="p-6 text-center">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} w-fit mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="mb-2">
                    <AnimatedNumber value={stat.value} suffix={stat.suffix} />
                  </div>
                  <h3 className="text-lg font-semibold mb-1">{stat.label}</h3>
                  <p className="text-sm text-muted-foreground">{stat.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Achievement Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {achievements.map((achievement) => (
            <motion.div key={achievement.title} variants={itemVariants}>
              <Card className="hover-lift group bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm border-0">
                <CardContent className="p-8">
                  <div className="flex items-center space-x-4">
                    <div className={`p-4 rounded-xl bg-gradient-to-br ${achievement.color} group-hover:scale-110 transition-transform duration-300`}>
                      <achievement.icon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">{achievement.title}</h3>
                      <p className="text-muted-foreground">{achievement.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <p className="text-muted-foreground mb-8">Trusted by developers at</p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            {['Google', 'Meta', 'Netflix', 'Spotify', 'Airbnb', 'Uber'].map((company) => (
              <div key={company} className="text-2xl font-bold text-muted-foreground">
                {company}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}