import * as Sentry from '@sentry/nextjs';

export function initSentry() {
  if (process.env.SENTRY_DSN) {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      environment: process.env.NODE_ENV,
      tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
      beforeSend(event) {
        // Filter out irrelevant errors
        if (event.exception) {
          const error = event.exception.values?.[0];
          if (error?.type === 'ChunkLoadError') {
            return null; // Don't send chunk load errors
          }
        }
        return event;
      },
      beforeSendTransaction(event) {
        // Sample transactions in production
        if (process.env.NODE_ENV === 'production') {
          return Math.random() < 0.1 ? event : null;
        }
        return event;
      }
    });
  }
}

export function captureError(error: Error, context?: Record<string, any>) {
  console.error('Error captured:', error);
  
  if (process.env.SENTRY_DSN) {
    Sentry.withScope((scope) => {
      if (context) {
        Object.entries(context).forEach(([key, value]) => {
          scope.setTag(key, value);
        });
      }
      Sentry.captureException(error);
    });
  }
}

export function captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info') {
  console.log(`[${level.toUpperCase()}] ${message}`);
  
  if (process.env.SENTRY_DSN) {
    Sentry.captureMessage(message, level);
  }
} 