"use client";

import { motion } from 'framer-motion';

interface BookAnimationProps {
  isOpen: boolean;
  title: string;
  color: string;
  onClick?: () => void;
}

export function BookAnimation({ isOpen, title, color, onClick }: BookAnimationProps) {
  const colorScheme = {
    green: {
      cover: "bg-gradient-to-br from-green-600 to-green-800",
      spine: "bg-green-800",
      shadow: "shadow-green-500/20"
    },
    blue: {
      cover: "bg-gradient-to-br from-blue-600 to-blue-800", 
      spine: "bg-blue-800",
      shadow: "shadow-blue-500/20"
    }
  }[color] || {
    cover: "bg-gradient-to-br from-gray-600 to-gray-800",
    spine: "bg-gray-800", 
    shadow: "shadow-gray-500/20"
  };

  return (
    <div className="flex items-center justify-center min-h-[400px] p-8">
      <motion.div
        className="relative cursor-pointer"
        onClick={onClick}
        whileHover={{ scale: 1.05, rotateY: -5 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300 }}
        style={{ perspective: "1000px" }}
      >
        {/* Book Container */}
        <div className="relative" style={{ transformStyle: "preserve-3d" }}>
          {/* Book Cover */}
          <motion.div
            className={`
              relative w-80 h-96 rounded-r-lg ${colorScheme.cover} ${colorScheme.shadow}
              border-2 border-white/20 shadow-2xl
            `}
            style={{
              transformOrigin: "left center",
              transform: isOpen ? "rotateY(-180deg)" : "rotateY(0deg)"
            }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            {/* Book Spine */}
            <div 
              className={`
                absolute left-0 top-0 w-6 h-full ${colorScheme.spine}
                border-l-2 border-white/20 rounded-l-lg
              `}
              style={{
                transform: "rotateY(-90deg)",
                transformOrigin: "right center"
              }}
            />
            
            {/* Cover Content */}
            <div className="relative z-10 h-full flex flex-col items-center justify-center p-8 text-white">
              {/* Book Icon */}
              <motion.div
                className="mb-6"
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">📖</span>
                </div>
              </motion.div>

              {/* Title */}
              <h3 className="text-2xl font-bold text-center mb-4 leading-tight">
                {title}
              </h3>
              
              {/* Subtitle */}
              <p className="text-white/80 text-center text-sm">
                Click to open and explore
              </p>

              {/* Decorative Elements */}
              <div className="absolute top-4 left-4 w-8 h-8 border-2 border-white/30 rounded-full" />
              <div className="absolute bottom-4 right-4 w-6 h-6 border-2 border-white/30 rounded" />
              
              {/* Animated Glow */}
              <motion.div
                className="absolute inset-0 bg-white/10 rounded-r-lg"
                animate={{ 
                  opacity: [0.1, 0.3, 0.1]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </div>

            {/* Book Pages Effect */}
            <div className="absolute right-0 top-2 bottom-2 w-1 bg-white/30 rounded-r" />
            <div className="absolute right-1 top-3 bottom-3 w-1 bg-white/20 rounded-r" />
            <div className="absolute right-2 top-4 bottom-4 w-1 bg-white/10 rounded-r" />
          </motion.div>

          {/* Book Shadow */}
          <motion.div
            className="absolute -bottom-4 left-4 right-4 h-8 bg-black/20 rounded-full blur-md"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.2, 0.3, 0.2]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          {/* Floating Particles */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/40 rounded-full"
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + i * 10}%`
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0, 1, 0],
                scale: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 2 + i * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.3
              }}
            />
          ))}
        </div>

        {/* Click Hint */}
        <motion.div
          className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 text-center"
          animate={{ 
            y: [0, -5, 0],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Click to open the playbook
          </p>
          <div className="flex justify-center mt-2">
            <motion.div
              className="w-6 h-6 border-2 border-gray-400 rounded-full flex items-center justify-center"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <div className="w-2 h-2 bg-gray-400 rounded-full" />
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
} 