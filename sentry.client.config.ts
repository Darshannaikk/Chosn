import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  
  // Adjust the session sample rate to 100% for better monitoring
  // We'll reduce this in production based on traffic
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  
  // Capture 100% of the transactions for performance monitoring
  // In production, you might want to reduce this
  replaysSessionSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  
  // Capture 100% of the transactions for errors
  replaysOnErrorSampleRate: 1.0,
  
  // Environment
  environment: process.env.NODE_ENV,
  
  // Release tracking
  release: process.env.VERCEL_GIT_COMMIT_SHA || 'development',
  
  // Debug mode in development
  debug: process.env.NODE_ENV === 'development',
  
  // Integration configuration
  integrations: [
    new Sentry.Replay({
      // Mask all text content, input values, and sensitive data
      maskAllText: true,
      maskAllInputs: true,
      blockAllMedia: true,
    }),
    new Sentry.BrowserTracing({
      // Performance monitoring for specific routes
      routingInstrumentation: Sentry.nextRouterInstrumentation,
    }),
  ],
  
  // Performance monitoring
  beforeSend(event, hint) {
    // Filter out common non-critical errors
    if (event.exception) {
      const error = hint.originalException
      
      // Skip non-critical errors
      if (error instanceof Error) {
        // Skip network errors that are user-related
        if (error.message.includes('fetch') && error.message.includes('NetworkError')) {
          return null
        }
        
        // Skip ResizeObserver errors (common browser issue)
        if (error.message.includes('ResizeObserver')) {
          return null
        }
        
        // Skip script loading errors from ad blockers
        if (error.message.includes('Script error')) {
          return null
        }
      }
    }
    
    return event
  },
  
  // Custom tags
  initialScope: {
    tags: {
      component: 'client',
      platform: 'web'
    }
  },
  
  // Allowed URLs for error reporting
  allowUrls: [
    /https?:\/\/.*\.chosn\.dev/,
    /https?:\/\/.*\.vercel\.app/,
    /http:\/\/localhost/
  ],
  
  // Ignore specific errors
  ignoreErrors: [
    // Browser extensions
    'top.GLOBALS',
    'originalCreateNotification',
    'canvas.contentDocument',
    'MyApp_RemoveAllHighlights',
    'atomicFindClose',
    
    // Network errors
    'NetworkError',
    'fetch',
    
    // Random plugins/extensions
    'Non-Error promise rejection captured',
    'ResizeObserver loop limit exceeded',
    
    // Third-party scripts
    /extensions\//i,
    /^chrome:\/\//i,
    /^moz-extension:\/\//i,
    /^safari-extension:\/\//i,
  ],
  
  // Context configuration
  maxBreadcrumbs: 50,
}) 