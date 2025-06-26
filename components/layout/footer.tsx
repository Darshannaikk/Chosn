import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
  Github,
  Twitter,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Code2,
  Briefcase,
  Users,
  Shield,
  FileText,
  HelpCircle,
} from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Platform',
      links: [
        { name: 'For Developers', href: '/developers', icon: Code2 },
        { name: 'For Companies', href: '/companies', icon: Briefcase },
        { name: 'Success Stories', href: '/success-stories', icon: Users },
        { name: 'Pricing', href: '/pricing', icon: FileText },
      ],
    },
    {
      title: 'Resources',
      links: [
        { name: 'Help Center', href: '/help', icon: HelpCircle },
        { name: 'API Documentation', href: '/docs', icon: FileText },
        { name: 'Security', href: '/security', icon: Shield },
        { name: 'Status', href: '/status', icon: Shield },
      ],
    },
    {
      title: 'Company',
      links: [
        { name: 'About Us', href: '/about' },
        { name: 'Careers', href: '/careers' },
        { name: 'Press', href: '/press' },
        { name: 'Contact', href: '/contact' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Terms of Service', href: '/terms' },
        { name: 'Cookie Policy', href: '/cookies' },
        { name: 'GDPR', href: '/gdpr' },
      ],
    },
  ];

  const socialLinks = [
    { name: 'GitHub', href: 'https://github.com/chosn', icon: Github },
    { name: 'Twitter', href: 'https://twitter.com/chosn', icon: Twitter },
    { name: 'LinkedIn', href: 'https://linkedin.com/company/chosn', icon: Linkedin },
  ];

  return (
    <footer className="bg-muted/30 border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <Link href="/" className="flex items-center space-x-2 mb-4">
                <div className="relative">
                  <div className="w-8 h-8 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">C</span>
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-brand-accent rounded-full animate-pulse-slow" />
                </div>
                <span className="text-xl font-bold gradient-text">Chosn</span>
              </Link>
              
              <p className="text-muted-foreground mb-6 max-w-sm">
                Connecting elite developers with industry-leading companies. 
                Don't apply, get applied.
              </p>

              {/* Newsletter Signup */}
              <div className="space-y-3">
                <h4 className="font-semibold text-sm">Stay Updated</h4>
                <div className="flex space-x-2">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1"
                  />
                  <Button size="sm" className="gradient-bg">
                    Subscribe
                  </Button>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex space-x-4 mt-6">
                {socialLinks.map((social) => (
                  <Link
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-brand-primary transition-colors"
                  >
                    <social.icon className="w-5 h-5" />
                    <span className="sr-only">{social.name}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Footer Links */}
            {footerSections.map((section) => (
              <div key={section.title}>
                <h4 className="font-semibold mb-4">{section.title}</h4>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-muted-foreground hover:text-foreground transition-colors flex items-center space-x-2"
                      >
                        {link.icon && <link.icon className="w-4 h-4" />}
                        <span>{link.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Bottom Footer */}
        <div className="py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 text-sm text-muted-foreground">
              <p>© {currentYear} Chosn. All rights reserved.</p>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>San Francisco, CA</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Mail className="w-4 h-4" />
                  <span>hello@chosn.com</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span>All systems operational</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}