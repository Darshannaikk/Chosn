"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Code2, Briefcase, ArrowRight } from 'lucide-react';
import { PlaybookModal } from './PlaybookModal';

export function ForkInRoadHero() {
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);
  const [activePlaybook, setActivePlaybook] = useState<string | null>(null);

  return (
    <section className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-green-50 dark:from-slate-900 dark:via-blue-900 dark:to-green-900">
      {/* Central Title */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16 z-10"
      >
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
          Choose Your Path
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
          Two paths, one destination: connecting talent with opportunity
        </p>
      </motion.div>

      {/* Fork Visual Container */}
      <div className="relative w-full max-w-6xl mx-auto px-4">
        {/* SVG Fork Illustration */}
        <div className="relative h-96 md:h-[500px]">
          <svg
            viewBox="0 0 800 400"
            className="w-full h-full absolute inset-0"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Main path leading to fork */}
            <motion.path
              d="M400 380 L400 200"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-gray-400"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, delay: 0.5 }}
            />
            
            {/* Left path (Developers) */}
            <motion.path
              d="M400 200 L200 80"
              stroke={hoveredPath === 'developer' ? '#10b981' : 'currentColor'}
              strokeWidth={hoveredPath === 'developer' ? '12' : '8'}
              fill="none"
              className={hoveredPath === 'developer' ? 'text-green-500' : 'text-gray-400'}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, delay: 1 }}
            />
            
            {/* Right path (Recruiters) */}
            <motion.path
              d="M400 200 L600 80"
              stroke={hoveredPath === 'recruiter' ? '#5469d4' : 'currentColor'}
              strokeWidth={hoveredPath === 'recruiter' ? '12' : '8'}
              fill="none"
              className={hoveredPath === 'recruiter' ? 'text-blue-500' : 'text-gray-400'}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, delay: 1 }}
            />

            {/* Animated dots traveling along paths */}
            {hoveredPath === 'developer' && (
              <motion.circle
                r="6"
                fill="#10b981"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <animateMotion dur="2s" repeatCount="indefinite">
                  <path d="M400 200 L200 80" />
                </animateMotion>
              </motion.circle>
            )}

            {hoveredPath === 'recruiter' && (
              <motion.circle
                r="6"
                fill="#5469d4"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <animateMotion dur="2s" repeatCount="indefinite">
                  <path d="M400 200 L600 80" />
                </animateMotion>
              </motion.circle>
            )}
          </svg>

          {/* Developer Side */}
          <motion.div
            className="absolute left-8 md:left-16 top-4 md:top-8"
            onMouseEnter={() => setHoveredPath('developer')}
            onMouseLeave={() => setHoveredPath(null)}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div
              className={`cursor-pointer p-8 rounded-2xl border-2 transition-all duration-300 ${
                hoveredPath === 'developer'
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20 shadow-xl'
                  : 'border-gray-200 bg-white dark:bg-gray-800 hover:border-green-300'
              }`}
              onClick={() => setActivePlaybook('developer')}
            >
              <div className="text-center">
                <div className={`inline-flex p-4 rounded-full mb-4 ${
                  hoveredPath === 'developer' ? 'bg-green-500 text-white' : 'bg-green-100 text-green-600'
                }`}>
                  <Code2 size={32} />
                </div>
                <h3 className="text-2xl font-bold mb-2">I'm a Developer</h3>
                <p className="text-muted-foreground mb-4">Showcase skills & get hired</p>
                <div className={`inline-flex items-center space-x-2 ${
                  hoveredPath === 'developer' ? 'text-green-600' : 'text-gray-500'
                }`}>
                  <span className="text-sm font-medium">Explore Playbook</span>
                  <ArrowRight size={16} />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Recruiter Side */}
          <motion.div
            className="absolute right-8 md:right-16 top-4 md:top-8"
            onMouseEnter={() => setHoveredPath('recruiter')}
            onMouseLeave={() => setHoveredPath(null)}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div
              className={`cursor-pointer p-8 rounded-2xl border-2 transition-all duration-300 ${
                hoveredPath === 'recruiter'
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-xl'
                  : 'border-gray-200 bg-white dark:bg-gray-800 hover:border-blue-300'
              }`}
              onClick={() => setActivePlaybook('recruiter')}
            >
              <div className="text-center">
                <div className={`inline-flex p-4 rounded-full mb-4 ${
                  hoveredPath === 'recruiter' ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-600'
                }`}>
                  <Briefcase size={32} />
                </div>
                <h3 className="text-2xl font-bold mb-2">I'm a Recruiter</h3>
                <p className="text-muted-foreground mb-4">Find top talent</p>
                <div className={`inline-flex items-center space-x-2 ${
                  hoveredPath === 'recruiter' ? 'text-blue-600' : 'text-gray-500'
                }`}>
                  <span className="text-sm font-medium">Explore Playbook</span>
                  <ArrowRight size={16} />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Playbook Modal */}
      <PlaybookModal
        isOpen={!!activePlaybook}
        onClose={() => setActivePlaybook(null)}
        type={activePlaybook as 'developer' | 'recruiter' | null}
      />
    </section>
  );
} 