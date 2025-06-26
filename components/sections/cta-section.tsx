"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight, 
  Code2, 
  Briefcase, 
  Sparkles,
  CheckCircle,
  Users,
  Zap
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export function CTASection() {
  const developerBenefits = [
    'Get discovered by top companies',
    'Skip the application process',
    'Access exclusive opportunities',
    'Salary negotiation support',
  ];

  const companyBenefits = [
    'Pre-validated elite talent',
    '95% faster hiring process',
    'Perfect culture-skill matches',
    'Dedicated success manager',
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
    <section className="py-24 bg-gradient-to-br from-background via-muted/20 to-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-brand-primary/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-accent/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Badge variant="secondary" className="mb-4 px-4 py-2">
            <Sparkles className="w-4 h-4 mr-2" />
            Ready to Get Started?
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-6">
            Join the <span className="gradient-text">Elite</span> Network
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Whether you're a developer looking for your next opportunity or a company 
            seeking exceptional talent, Chosn is your gateway to success.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Developer CTA */}
          <motion.div variants={itemVariants}>
            <Card className="h-full hover-lift group bg-gradient-to-br from-brand-primary/5 to-brand-secondary/5 border-brand-primary/20 overflow-hidden relative">
              <div className="absolute top-4 right-4 opacity-10">
                <Code2 className="w-24 h-24" />
              </div>
              <CardContent className="p-8 relative z-10">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-3 rounded-xl bg-brand-primary">
                    <Code2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">For Developers</h3>
                    <p className="text-muted-foreground">Join 12,500+ elite developers</p>
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {developerBenefits.map((benefit) => (
                    <li key={benefit} className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-muted-foreground">{benefit}</span>
                    </li>
                  ))}
                </ul>

                <div className="space-y-4">
                  <Button size="lg" className="w-full gradient-bg group" asChild>
                    <Link href="/signup">
                      <Users className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                      Create Developer Profile
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                  <p className="text-sm text-muted-foreground text-center">
                    Free to join • No application fees • Premium support
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Company CTA */}
          <motion.div variants={itemVariants}>
            <Card className="h-full hover-lift group bg-gradient-to-br from-brand-accent/5 to-orange-500/5 border-brand-accent/20 overflow-hidden relative">
              <div className="absolute top-4 right-4 opacity-10">
                <Briefcase className="w-24 h-24" />
              </div>
              <CardContent className="p-8 relative z-10">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-3 rounded-xl bg-brand-accent">
                    <Briefcase className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">For Companies</h3>
                    <p className="text-muted-foreground">Trusted by 850+ companies</p>
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {companyBenefits.map((benefit) => (
                    <li key={benefit} className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-muted-foreground">{benefit}</span>
                    </li>
                  ))}
                </ul>

                <div className="space-y-4">
                  <Button size="lg" className="w-full bg-brand-accent hover:bg-brand-accent/90 text-white group" asChild>
                    <Link href="/companies">
                      <Zap className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                      Start Hiring Elite Talent
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                  <p className="text-sm text-muted-foreground text-center">
                    14-day free trial • No setup fees • Cancel anytime
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-brand-primary to-brand-secondary text-white border-0">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">
                Ready to Transform Your Career or Hiring?
              </h3>
              <p className="text-white/90 mb-6">
                Join thousands who have already discovered the power of Chosn. 
                Get started today and experience the future of tech recruitment.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" className="bg-white text-brand-primary hover:bg-white/90" asChild>
                  <Link href="/demo">
                    Schedule Demo
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
                  <Link href="/contact">
                    Contact Sales
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}