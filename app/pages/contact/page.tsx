"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock,
  Send,
  MessageSquare,
  Users,
  Headphones,
  ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { z } from 'zod';
import { toast } from 'sonner';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(20, 'Message must be at least 20 characters'),
  type: z.enum(['general', 'support', 'partnership', 'feedback']),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
      type: 'general'
    }
  });

  const selectedType = watch('type');

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Contact form submitted:', data);
      toast.success('Message sent successfully! We\'ll get back to you within 24 hours.');
      reset();
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email Us',
      description: 'Send us an email anytime',
      value: 'hello@chosn.com',
      action: 'mailto:hello@chosn.com'
    },
    {
      icon: Phone,
      title: 'Call Us',
      description: 'Mon-Fri from 8am to 6pm PST',
      value: '+1 (555) 123-4567',
      action: 'tel:+15551234567'
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      description: 'Come say hello at our office',
      value: 'San Francisco, CA',
      action: '#'
    },
    {
      icon: Clock,
      title: 'Response Time',
      description: 'We typically respond within',
      value: '24 hours',
      action: '#'
    }
  ];

  const inquiryTypes = [
    {
      value: 'general',
      label: 'General Inquiry',
      icon: MessageSquare,
      description: 'General questions about Chosn'
    },
    {
      value: 'support',
      label: 'Technical Support',
      icon: Headphones,
      description: 'Need help with your account or platform'
    },
    {
      value: 'partnership',
      label: 'Partnership',
      icon: Users,
      description: 'Interested in partnering with us'
    },
    {
      value: 'feedback',
      label: 'Feedback',
      icon: MessageSquare,
      description: 'Share your thoughts and suggestions'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-24 bg-gradient-to-br from-background via-background to-muted/20 relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-brand-primary/5 rounded-full blur-3xl animate-float" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-accent/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              className="text-center max-w-4xl mx-auto mb-16"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Badge variant="secondary" className="mb-4 px-4 py-2">
                <MessageSquare className="w-4 h-4 mr-2" />
                Get in Touch
              </Badge>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
                We'd Love to <span className="gradient-text">Hear From You</span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Have questions about Chosn? Want to partner with us? Or just want to say hello? 
                We're here to help and would love to connect with you.
              </p>
            </motion.div>

            {/* Contact Info Cards */}
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {contactInfo.map((info, index) => (
                <Card key={info.title} className="text-center hover-lift bg-card/50 backdrop-blur-sm border-0">
                  <CardContent className="p-6">
                    <div className="p-3 rounded-xl bg-brand-primary/10 w-fit mx-auto mb-4">
                      <info.icon className="w-6 h-6 text-brand-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">{info.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{info.description}</p>
                    <p className="font-medium text-brand-primary">{info.value}</p>
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Form */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <Card className="bg-card/50 backdrop-blur-sm border-0">
                  <CardHeader>
                    <CardTitle className="text-2xl">Send us a message</CardTitle>
                    <p className="text-muted-foreground">
                      Fill out the form below and we'll get back to you as soon as possible.
                    </p>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                      {/* Inquiry Type */}
                      <div>
                        <Label htmlFor="type">What can we help you with?</Label>
                        <div className="grid grid-cols-2 gap-3 mt-2">
                          {inquiryTypes.map((type) => (
                            <label
                              key={type.value}
                              className={`relative flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                                selectedType === type.value
                                  ? 'border-brand-primary bg-brand-primary/5'
                                  : 'border-input hover:bg-muted/50'
                              }`}
                            >
                              <input
                                type="radio"
                                value={type.value}
                                {...register('type')}
                                className="sr-only"
                              />
                              <type.icon className="w-4 h-4 text-muted-foreground" />
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium">{type.label}</div>
                              </div>
                            </label>
                          ))}
                        </div>
                        {errors.type && (
                          <p className="text-sm text-red-500 mt-1">{errors.type.message}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="name">Name *</Label>
                          <Input
                            id="name"
                            placeholder="Your full name"
                            {...register('name')}
                          />
                          {errors.name && (
                            <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
                          )}
                        </div>
                        <div>
                          <Label htmlFor="email">Email *</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="your@email.com"
                            {...register('email')}
                          />
                          {errors.email && (
                            <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="subject">Subject *</Label>
                        <Input
                          id="subject"
                          placeholder="What's this about?"
                          {...register('subject')}
                        />
                        {errors.subject && (
                          <p className="text-sm text-red-500 mt-1">{errors.subject.message}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="message">Message *</Label>
                        <Textarea
                          id="message"
                          placeholder="Tell us more about your inquiry..."
                          rows={5}
                          {...register('message')}
                        />
                        {errors.message && (
                          <p className="text-sm text-red-500 mt-1">{errors.message.message}</p>
                        )}
                      </div>

                      <Button 
                        type="submit" 
                        size="lg" 
                        className="w-full gradient-bg"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Sending...</span>
                          </div>
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            Send Message
                          </>
                        )}
                      </Button>

                      <p className="text-sm text-muted-foreground text-center">
                        We'll get back to you within 24 hours during business days.
                      </p>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Additional Info */}
              <motion.div
                className="space-y-8"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <div>
                  <h3 className="text-2xl font-bold mb-4">Frequently Asked Questions</h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-semibold mb-2">How quickly do you respond?</h4>
                      <p className="text-sm text-muted-foreground">
                        We typically respond to all inquiries within 24 hours during business days.
                      </p>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-semibold mb-2">Do you offer phone support?</h4>
                      <p className="text-sm text-muted-foreground">
                        Yes! Premium subscribers get access to priority phone support during business hours.
                      </p>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-semibold mb-2">Can I schedule a demo?</h4>
                      <p className="text-sm text-muted-foreground">
                        Absolutely! Contact us to schedule a personalized demo of the Chosn platform.
                      </p>
                    </div>
                  </div>
                </div>

                <Card className="bg-gradient-to-br from-brand-primary/5 to-brand-secondary/5 border-brand-primary/20">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-3">Need immediate help?</h3>
                    <p className="text-muted-foreground mb-4">
                      Check out our comprehensive help center with guides, tutorials, and FAQs.
                    </p>
                    <Button variant="outline" className="w-full">
                      Visit Help Center
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-brand-accent/5 to-yellow-500/5 border-brand-accent/20">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-3">Join our community</h3>
                    <p className="text-muted-foreground mb-4">
                      Connect with other developers and companies in our Discord community.
                    </p>
                    <Button variant="outline" className="w-full">
                      Join Discord
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

