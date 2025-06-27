"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Download, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BookAnimation } from './BookAnimation';
import Link from 'next/link';

interface PlaybookModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'developer' | 'recruiter' | null;
}

const playbookContent = {
  developer: {
    title: "Developer Playbook",
    subtitle: "Your guide to getting hired on Chosn",
    color: "green",
    signupUrl: "/developers",
    pages: [
      {
        title: "Getting Started",
        content: [
          "Welcome to the developer's journey on Chosn! This platform is designed to showcase your coding skills and connect you with top companies.",
          "• Create your profile in under 5 minutes",
          "• Connect your GitHub for automatic skill verification",
          "• Get discovered by companies actively hiring",
          "• Skip traditional job applications forever"
        ]
      },
      {
        title: "Profile Setup",
        content: [
          "Your profile is your digital resume that works 24/7. Here's how to make it shine:",
          "• Add your best repositories and projects",
          "• Highlight your tech stack and expertise",
          "• Include your career goals and preferences",
          "• Upload a professional photo and bio",
          "• Set your availability and location preferences"
        ]
      },
      {
        title: "GitHub Integration",
        content: [
          "Your GitHub is your proof of work. We analyze your code to verify your skills:",
          "• Automatic language detection and proficiency",
          "• Project complexity analysis",
          "• Contribution patterns and consistency",
          "• Code quality metrics",
          "• Open source contributions weight"
        ]
      },
      {
        title: "Job Matching",
        content: [
          "Our AI matches you with companies based on your skills and preferences:",
          "• Skill-based matching algorithm",
          "• Company culture fit analysis",
          "• Salary range alignment",
          "• Remote work preferences",
          "• Growth opportunity matching"
        ]
      }
    ]
  },
  recruiter: {
    title: "Recruiter Playbook", 
    subtitle: "Your guide to finding top talent on Chosn",
    color: "blue",
    signupUrl: "/companies",
    pages: [
      {
        title: "Platform Overview",
        content: [
          "Welcome to Chosn! We've built the most effective way to find and hire verified developers.",
          "• Access to pre-verified developer profiles",
          "• GitHub-validated skill assessments",
          "• Direct messaging with candidates",
          "• Advanced filtering and search tools",
          "• Analytics and hiring pipeline tracking"
        ]
      },
      {
        title: "Finding Talent",
        content: [
          "Discover developers with the exact skills you need:",
          "• Filter by programming languages and frameworks",
          "• Experience level and project complexity",
          "• Location and remote work preferences",
          "• Availability and job search status",
          "• Portfolio quality and GitHub activity"
        ]
      },
      {
        title: "Communication Tools",
        content: [
          "Engage with candidates through our built-in messaging system:",
          "• Direct messaging with developers",
          "• Automated follow-up sequences",
          "• Interview scheduling integration",
          "• Team collaboration features",
          "• Response tracking and analytics"
        ]
      },
      {
        title: "Hiring Process",
        content: [
          "Streamline your hiring with our comprehensive tools:",
          "• Candidate pipeline management",
          "• Interview coordination and feedback",
          "• Offer management and tracking",
          "• Onboarding workflow automation",
          "• Performance analytics and reporting"
        ]
      }
    ]
  }
};

export function PlaybookModal({ isOpen, onClose, type }: PlaybookModalProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [bookOpen, setBookOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Small delay to show book opening animation
      setTimeout(() => setBookOpen(true), 300);
    } else {
      setBookOpen(false);
      setCurrentPage(0);
    }
  }, [isOpen]);

  if (!type || !isOpen) return null;

  const playbook = playbookContent[type];
  const colorScheme = {
    green: {
      primary: "bg-green-500",
      secondary: "bg-green-50 dark:bg-green-900/20",
      text: "text-green-600",
      border: "border-green-500"
    },
    blue: {
      primary: "bg-blue-500", 
      secondary: "bg-blue-50 dark:bg-blue-900/20",
      text: "text-blue-600",
      border: "border-blue-500"
    }
  }[playbook.color];

  const nextPage = () => {
    if (currentPage < playbook.pages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 20 }}
            className="relative max-w-4xl w-full max-h-[90vh] overflow-hidden"
          >
            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="absolute top-4 right-4 z-10 bg-white/80 hover:bg-white"
            >
              <X size={20} />
            </Button>

            {!bookOpen ? (
              // Closed Book State
              <BookAnimation
                isOpen={false}
                title={playbook.title}
                color={playbook.color}
                onClick={() => setBookOpen(true)}
              />
            ) : (
              // Open Book State
              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl overflow-hidden">
                {/* Book Header */}
                <div className={`${colorScheme.primary} text-white p-6 text-center`}>
                  <h2 className="text-3xl font-bold mb-2">{playbook.title}</h2>
                  <p className="text-white/90">{playbook.subtitle}</p>
                </div>

                {/* Book Content */}
                <div className="flex min-h-[400px]">
                  {/* Left Page */}
                  <div className="flex-1 p-8 border-r border-gray-200 dark:border-gray-700">
                    <motion.div
                      key={currentPage}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
                        {playbook.pages[currentPage]?.title}
                      </h3>
                      <div className="space-y-3 text-gray-600 dark:text-gray-300">
                        {playbook.pages[currentPage]?.content.map((paragraph, index) => (
                          <p key={index} className="leading-relaxed">
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    </motion.div>
                  </div>

                  {/* Right Page */}
                  <div className="flex-1 p-8 bg-gray-50 dark:bg-gray-800">
                    <div className="h-full flex flex-col justify-between">
                      {/* Page Content Area */}
                      <div className="flex-1">
                        {currentPage === playbook.pages.length - 1 ? (
                          // Final page with CTA
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center space-y-6"
                          >
                            <h4 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                              Ready to get started?
                            </h4>
                            <p className="text-gray-600 dark:text-gray-300">
                              Join thousands of {type}s already using Chosn to {type === 'developer' ? 'find their dream job' : 'hire top talent'}.
                            </p>
                            <div className="space-y-4">
                              <Button 
                                className={`w-full ${colorScheme.primary} hover:opacity-90`}
                                asChild
                              >
                                <Link href={playbook.signupUrl}>
                                  <ExternalLink size={16} className="mr-2" />
                                  Get Started Now
                                </Link>
                              </Button>
                              <Button 
                                variant="outline" 
                                className="w-full"
                                onClick={() => {/* TODO: Implement PDF download */}}
                              >
                                <Download size={16} className="mr-2" />
                                Download PDF
                              </Button>
                            </div>
                          </motion.div>
                        ) : (
                          // Regular page illustration
                          <div className="text-center text-gray-400 dark:text-gray-500">
                            <div className={`w-32 h-32 mx-auto rounded-lg ${colorScheme.secondary} mb-4 flex items-center justify-center`}>
                              <span className="text-4xl">📖</span>
                            </div>
                            <p>Page {currentPage + 1} of {playbook.pages.length}</p>
                          </div>
                        )}
                      </div>

                      {/* Navigation */}
                      <div className="flex justify-between items-center mt-8">
                        <Button
                          variant="ghost"
                          onClick={prevPage}
                          disabled={currentPage === 0}
                          className="flex items-center space-x-2"
                        >
                          <ChevronLeft size={16} />
                          <span>Previous</span>
                        </Button>

                        <span className="text-sm text-gray-500">
                          {currentPage + 1} / {playbook.pages.length}
                        </span>

                        <Button
                          variant="ghost"
                          onClick={nextPage}
                          disabled={currentPage === playbook.pages.length - 1}
                          className="flex items-center space-x-2"
                        >
                          <span>Next</span>
                          <ChevronRight size={16} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 