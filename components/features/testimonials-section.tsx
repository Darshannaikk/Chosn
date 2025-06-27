"use client";

import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Star, Quote } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export function TestimonialsSection() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: 'Sarah Chen',
      role: 'Senior Full Stack Developer',
      company: 'Netflix',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      content: 'Chosn completely changed my career trajectory. Instead of endlessly applying to jobs, I had top companies reaching out to me within days of joining. The quality of opportunities was exceptional.',
      rating: 5,
      badge: 'Developer',
      salary: '$185K',
      location: 'San Francisco, CA',
    },
    {
      id: 2,
      name: 'Marcus Rodriguez',
      role: 'DevOps Engineer',
      company: 'Spotify',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      content: 'The validation process gave me confidence in my skills, and the AI matching was incredibly accurate. I found my dream job at Spotify through Chosn in just 2 weeks.',
      rating: 5,
      badge: 'Developer',
      salary: '$165K',
      location: 'Remote',
    },
    {
      id: 3,
      name: 'Emily Watson',
      role: 'Head of Engineering',
      company: 'Airbnb',
      avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      content: 'As a hiring manager, Chosn has been a game-changer. The pre-validated talent pool saves us countless hours, and the quality of candidates is consistently outstanding.',
      rating: 5,
      badge: 'Company',
      metric: '90% hire rate',
      location: 'San Francisco, CA',
    },
    {
      id: 4,
      name: 'David Kim',
      role: 'React Developer',
      company: 'Meta',
      avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      content: 'I was skeptical at first, but Chosn delivered. The platform connected me with Meta, and the entire process was smooth and professional. Highly recommend to any developer.',
      rating: 5,
      badge: 'Developer',
      salary: '$195K',
      location: 'Menlo Park, CA',
    },
    {
      id: 5,
      name: 'Lisa Thompson',
      role: 'CTO',
      company: 'TechStart Inc.',
      avatar: 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      content: 'Chosn helped us scale our engineering team rapidly with top-tier talent. The platform\'s matching algorithm is incredibly sophisticated and saves us tremendous time.',
      rating: 5,
      badge: 'Company',
      metric: '5x faster hiring',
      location: 'Austin, TX',
    },
    {
      id: 6,
      name: 'Alex Johnson',
      role: 'Backend Engineer',
      company: 'Google',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      content: 'The personalized approach and quality of matches on Chosn is unmatched. I received multiple offers from FAANG companies and landed my dream role at Google.',
      rating: 5,
      badge: 'Developer',
      salary: '$210K',
      location: 'Mountain View, CA',
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

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
            <Star className="w-4 h-4 mr-2" />
            Success Stories
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            What Our <span className="gradient-text">Community</span> Says
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Join thousands of developers and companies who have transformed 
            their hiring experience with Chosn.
          </p>
        </motion.div>

        {/* Featured Testimonial */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Card className="max-w-4xl mx-auto bg-gradient-to-br from-brand-primary/5 to-brand-secondary/5 border-brand-primary/20 overflow-hidden">
            <CardContent className="p-8 md:p-12">
              <div className="flex flex-col md:flex-row items-start space-y-6 md:space-y-0 md:space-x-8">
                <div className="flex-shrink-0">
                  <Avatar className="w-20 h-20 border-4 border-brand-primary/20">
                    <AvatarImage 
                      src={testimonials[activeTestimonial].avatar}
                      alt={testimonials[activeTestimonial].name}
                    />
                    <AvatarFallback className="bg-brand-primary text-white text-xl">
                      {testimonials[activeTestimonial].name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-4">
                    <Quote className="w-8 h-8 text-brand-primary/30" />
                    <div className="flex space-x-1">
                      {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-brand-accent text-brand-accent" />
                      ))}
                    </div>
                  </div>
                  <blockquote className="text-lg md:text-xl leading-relaxed mb-6 text-foreground">
                    "{testimonials[activeTestimonial].content}"
                  </blockquote>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="font-semibold text-lg">{testimonials[activeTestimonial].name}</div>
                      <div className="text-muted-foreground">
                        {testimonials[activeTestimonial].role} at {testimonials[activeTestimonial].company}
                      </div>
                      <div className="text-sm text-muted-foreground">{testimonials[activeTestimonial].location}</div>
                    </div>
                    <div className="flex items-center space-x-3 mt-4 sm:mt-0">
                      <Badge variant={testimonials[activeTestimonial].badge === 'Developer' ? 'default' : 'secondary'}>
                        {testimonials[activeTestimonial].badge}
                      </Badge>
                      {testimonials[activeTestimonial].salary && (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          {testimonials[activeTestimonial].salary}
                        </Badge>
                      )}
                      {testimonials[activeTestimonial].metric && (
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          {testimonials[activeTestimonial].metric}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Testimonial Navigation */}
          <div className="flex justify-center space-x-2 mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === activeTestimonial
                    ? 'bg-brand-primary scale-125'
                    : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                }`}
              />
            ))}
          </div>
        </motion.div>

        {/* Testimonial Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {testimonials.slice(0, 6).map((testimonial, index) => (
            <motion.div key={testimonial.id} variants={itemVariants}>
              <Card className="h-full hover-lift group">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-brand-accent text-brand-accent" />
                    ))}
                  </div>
                  <blockquote className="text-sm leading-relaxed mb-4 text-muted-foreground">
                    "{testimonial.content.slice(0, 120)}..."
                  </blockquote>
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage 
                        src={testimonial.avatar}
                        alt={testimonial.name}
                      />
                      <AvatarFallback className="bg-brand-primary text-white text-sm">
                        {testimonial.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{testimonial.name}</div>
                      <div className="text-xs text-muted-foreground truncate">
                        {testimonial.role}
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {testimonial.badge}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}