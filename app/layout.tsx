import './globals.css';
import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { QueryProvider } from '@/components/query-provider';
import { ReduxProvider } from '@/components/redux-provider';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import Script from 'next/script';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  preload: true
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap'
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NODE_ENV === 'production' 
    ? process.env.NEXT_PUBLIC_APP_URL || 'https://chosn.dev' 
    : 'http://localhost:3000'
  ),
  title: {
    default: 'Chosn - Premium Developer Talent Marketplace',
    template: '%s | Chosn'
  },
  description: 'Connect elite developers with industry-leading companies. Don\'t apply, get applied. GitHub-verified skills, premium talent marketplace.',
  keywords: [
    'developer jobs', 
    'tech talent', 
    'software engineer', 
    'remote work', 
    'tech careers',
    'github integration',
    'skill verification',
    'premium talent'
  ],
  authors: [{ name: 'Chosn Team', url: 'https://chosn.dev' }],
  creator: 'Chosn',
  publisher: 'Chosn',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_APP_URL,
    title: 'Chosn - Premium Developer Talent Marketplace',
    description: 'Connect elite developers with industry-leading companies through GitHub-verified skills',
    siteName: 'Chosn',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Chosn - Premium Developer Talent Marketplace'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Chosn - Premium Developer Talent Marketplace',
    description: 'Connect elite developers with industry-leading companies',
    images: ['/og-image.png'],
    creator: '@chosn_dev'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'mask-icon', url: '/safari-pinned-tab.svg', color: '#5bbad5' },
    ],
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_APP_URL,
  },
  category: 'technology',
  classification: 'Business',
  referrer: 'origin-when-cross-origin',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

// Preload critical resources
function PreloadResources() {
  return (
    <>
      <link
        rel="preconnect"
        href="https://fonts.googleapis.com"
        crossOrigin="anonymous"
      />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
      <link
        rel="preconnect"
        href={process.env.NEXT_PUBLIC_SUPABASE_URL!}
        crossOrigin="anonymous"
      />
      <link rel="preconnect" href="https://api.github.com" crossOrigin="anonymous" />
      
      {/* DNS prefetch for common external domains */}
      <link rel="dns-prefetch" href="//vercel.live" />
      <link rel="dns-prefetch" href="//vitals.vercel-insights.com" />
    </>
  )
}

// Web Vitals and Performance Monitoring
function PerformanceMonitoring() {
  return (
    <Script
      id="web-vitals"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          import('/lib/performance/vitals.js').then(({ initializePerformanceMonitoring }) => {
            initializePerformanceMonitoring();
          }).catch(console.error);
        `
      }}
    />
  )
}

// Error boundary for better error handling
function GlobalErrorBoundary({ children }: { children: React.ReactNode }) {
  return children; // In a real implementation, you'd wrap with an actual error boundary
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <PreloadResources />
        
        {/* Critical CSS for above-the-fold content */}
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Critical CSS for immediate rendering */
            body { margin: 0; font-family: ${inter.style.fontFamily}, system-ui, -apple-system, sans-serif; }
            .loading { opacity: 0; animation: fadeIn 0.3s ease-in-out forwards; }
            @keyframes fadeIn { to { opacity: 1; } }
          `
        }} />
        
        {/* Theme color for mobile browsers */}
        <meta name="theme-color" content="#000000" />
        <meta name="msapplication-TileColor" content="#000000" />
        
        {/* Performance hints */}
        <meta httpEquiv="x-dns-prefetch-control" content="on" />
      </head>
      
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased loading`}>
        <GlobalErrorBoundary>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ReduxProvider>
              <QueryProvider>
                <div id="root">
                  {children}
                </div>
                
                {/* Toast notifications */}
                <Toaster 
                  position="bottom-right"
                  expand={false}
                  richColors
                  closeButton
                />
                
                {/* Performance and Analytics */}
                <Analytics />
                <SpeedInsights />
                
                {/* Development tools */}
                {process.env.NODE_ENV === 'development' && (
                  <div id="development-tools" style={{ display: 'none' }}>
                    {/* Development-only components */}
                  </div>
                )}
              </QueryProvider>
            </ReduxProvider>
          </ThemeProvider>
        </GlobalErrorBoundary>
        
        {/* Performance monitoring */}
        <PerformanceMonitoring />
        
        {/* Structured data for SEO */}
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Chosn",
              "description": "Premium Developer Talent Marketplace",
              "url": process.env.NEXT_PUBLIC_APP_URL,
              "logo": `${process.env.NEXT_PUBLIC_APP_URL}/logo.png`,
              "sameAs": [
                "https://twitter.com/chosn_dev",
                "https://github.com/chosn",
                "https://linkedin.com/company/chosn"
              ],
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "customer service",
                "email": "support@chosn.dev"
              }
            })
          }}
        />
        
        {/* Service Worker registration for PWA */}
        {process.env.NODE_ENV === 'production' && (
          <Script
            id="sw-registration"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                if ('serviceWorker' in navigator) {
                  navigator.serviceWorker.register('/sw.js')
                    .then(registration => console.log('SW registered'))
                    .catch(error => console.log('SW registration failed'));
                }
              `
            }}
          />
        )}
      </body>
    </html>
  );
}

