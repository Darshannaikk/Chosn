"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Code2, Briefcase, BookOpen } from 'lucide-react';
import Link from 'next/link';

export function Playbook3DSection() {
  const [activePlaybook, setActivePlaybook] = useState(null);

  const recruiterFeatures = [
    "Find pre-verified developers with validated GitHub skills",
    "Browse detailed developer profiles with real projects",
    "Set up job alerts for specific skill sets",
    "Direct message qualified candidates",
    "Track hiring progress with analytics"
  ];

  const developerFeatures = [
    "Connect GitHub to automatically validate your skills",
    "Create a compelling profile that showcases your abilities",
    "Get discovered by top companies",
    "Receive job offers that match your skills",
    "Skip traditional job applications"
  ];

  return (
    <section className="py-16 relative bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold mb-4">Choose Your Path</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Whether you're looking for talent or showcasing your skills, we have a playbook for you.
            </p>
          </motion.div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Recruiter Playbook */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <Card 
              className={`transition-all duration-300 cursor-pointer border-2 ${
                activePlaybook === 'recruiter' 
                  ? 'border-[#5469d4] shadow-lg scale-105' 
                  : 'border-gray-200 hover:border-[#5469d4]/50 hover:shadow-md'
              }`}
              onClick={() => setActivePlaybook(activePlaybook === 'recruiter' ? null : 'recruiter')}
            >
              <CardHeader className="text-center bg-gradient-to-br from-[#5469d4] to-[#4a5fc4] text-white rounded-t-lg">
                <div className="flex items-center justify-center mb-2">
                  <BookOpen className="w-8 h-8 mr-2" />
                  <Briefcase className="w-8 h-8" />
                </div>
                <CardTitle className="text-2xl">Recruiter Playbook</CardTitle>
                <p className="text-blue-100">Find and hire top developers</p>
              </CardHeader>
              <CardContent className="p-6">
                {activePlaybook === 'recruiter' ? (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <h4 className="font-semibold text-lg">What you can do:</h4>
                    <ul className="space-y-3">
                      {recruiterFeatures.map((feature, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="flex items-start space-x-3"
                        >
                          <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </motion.li>
                      ))}
                    </ul>
                    <Button className="w-full mt-4 bg-[#5469d4] hover:bg-[#4a5fc4]" asChild>
                      <Link href="/companies">
                        <Briefcase className="w-4 h-4 mr-2" />
                        Join as Recruiter
                      </Link>
                    </Button>
                  </motion.div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">
                      Discover how to efficiently find and hire the best developers
                    </p>
                    <Button variant="outline" size="sm">
                      Click to explore
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Developer Playbook */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <Card 
              className={`transition-all duration-300 cursor-pointer border-2 ${
                activePlaybook === 'developer' 
                  ? 'border-[#10b981] shadow-lg scale-105' 
                  : 'border-gray-200 hover:border-[#10b981]/50 hover:shadow-md'
              }`}
              onClick={() => setActivePlaybook(activePlaybook === 'developer' ? null : 'developer')}
            >
              <CardHeader className="text-center bg-gradient-to-br from-[#10b981] to-[#0ea271] text-white rounded-t-lg">
                <div className="flex items-center justify-center mb-2">
                  <BookOpen className="w-8 h-8 mr-2" />
                  <Code2 className="w-8 h-8" />
                </div>
                <CardTitle className="text-2xl">Developer Playbook</CardTitle>
                <p className="text-green-100">Showcase your skills and get hired</p>
              </CardHeader>
              <CardContent className="p-6">
                {activePlaybook === 'developer' ? (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <h4 className="font-semibold text-lg">What you can do:</h4>
                    <ul className="space-y-3">
                      {developerFeatures.map((feature, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="flex items-start space-x-3"
                        >
                          <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </motion.li>
                      ))}
                    </ul>
                    <Button className="w-full mt-4 bg-[#10b981] hover:bg-[#0ea271]" asChild>
                      <Link href="/developers">
                        <Code2 className="w-4 h-4 mr-2" />
                        Join as Developer
                      </Link>
                    </Button>
                  </motion.div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">
                      Learn how to create an outstanding profile and get noticed
                    </p>
                    <Button variant="outline" size="sm">
                      Click to explore
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
        
        <div className="mt-12 flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center"
          >
            <Button 
              size="lg" 
              className="bg-[#5469d4] hover:bg-[#4a5fc4]"
              onClick={() => setActivePlaybook('recruiter')}
            >
              <Briefcase className="w-5 h-5 mr-2" />
              For Recruiters
            </Button>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center"
          >
            <Button 
              size="lg" 
              className="bg-[#10b981] hover:bg-[#0ea271]"
              onClick={() => setActivePlaybook('developer')}
            >
              <Code2 className="w-5 h-5 mr-2" />
              For Developers
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}