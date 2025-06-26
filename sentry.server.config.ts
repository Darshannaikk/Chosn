import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  
  // Adjust the session sample rate to 100% for better monitoring
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  
  // Environment
  environment: process.env.NODE_ENV,
  
  // Release tracking
  release: process.env.VERCEL_GIT_COMMIT_SHA || 'development',
  
  // Debug mode in development
  debug: process.env.NODE_ENV === 'development',
  
  // Server-specific integrations
  integrations: [
    new Sentry.ProfilingIntegration(),
  ],
  
  // Enable profiling
  profilesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  
  // Custom error filtering
  beforeSend(event, hint) {
    const error = hint.originalException
    
    // Don't send certain types of errors in production
    if (process.env.NODE_ENV === 'production') {
      // Skip database connection timeouts (they'll be caught by health checks)
      if (error instanceof Error && error.message.includes('connection timeout')) {
        return null
      }
      
      // Skip rate limit errors (they're expected)
      if (error instanceof Error && error.message.includes('rate limit')) {
        return null
      }
    }
    
    // Add additional context
    if (event.request) {
      // Add user agent and IP for better debugging
      event.contexts = {
        ...event.contexts,
        server: {
          url: event.request.url,
          method: event.request.method,
          headers: event.request.headers,
        }
      }
    }
    
    return event
  },
  
  // Custom tags for server
  initialScope: {
    tags: {
      component: 'server',
      platform: 'node'
    }
  },
  
  // Ignore specific server errors
  ignoreErrors: [
    // Client disconnections
    'ECONNRESET',
    'EPIPE',
    'ETIMEDOUT',
    
    // Rate limiting
    'Too Many Requests',
    
    // Expected auth errors
    'Invalid token',
    'Unauthorized',
    
    // Expected validation errors
    'Validation error',
    'Invalid input',
  ],
  
  // Context configuration
  maxBreadcrumbs: 100,
  
  // Additional server context
  beforeSendTransaction(event) {
    // Add server performance context
    if (process.memoryUsage) {
      const memory = process.memoryUsage()
      event.contexts = {
        ...event.contexts,
        runtime: {
          name: 'node',
          version: process.version,
        },
        memory: {
          used: memory.heapUsed,
          total: memory.heapTotal,
          external: memory.external,
        }
      }
    }
    
    return event
  }
}) 