import { Metric, getCLS, getFCP, getFID, getLCP, getTTFB } from 'web-vitals'

// Performance thresholds based on Google's recommendations
const PERFORMANCE_THRESHOLDS = {
  LCP: { good: 2500, needsImprovement: 4000 },  // Largest Contentful Paint
  FID: { good: 100, needsImprovement: 300 },   // First Input Delay
  CLS: { good: 0.1, needsImprovement: 0.25 },  // Cumulative Layout Shift
  FCP: { good: 1800, needsImprovement: 3000 }, // First Contentful Paint
  TTFB: { good: 800, needsImprovement: 1800 }  // Time to First Byte
}

interface PerformanceData {
  metric: Metric
  threshold: 'good' | 'needs-improvement' | 'poor'
  timestamp: number
  url: string
  userAgent: string
  connectionType?: string
}

function getThresholdStatus(metricName: string, value: number): 'good' | 'needs-improvement' | 'poor' {
  const thresholds = PERFORMANCE_THRESHOLDS[metricName as keyof typeof PERFORMANCE_THRESHOLDS]
  
  if (!thresholds) return 'good'
  
  if (value <= thresholds.good) return 'good'
  if (value <= thresholds.needsImprovement) return 'needs-improvement'
  return 'poor'
}

function getConnectionType(): string {
  // @ts-ignore - navigator.connection is experimental
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection
  
  if (!connection) return 'unknown'
  
  return connection.effectiveType || connection.type || 'unknown'
}

function sendMetricToAnalytics(data: PerformanceData) {
  // Send to multiple analytics services for comprehensive tracking
  
  // Send to Vercel Analytics
  if (typeof window !== 'undefined' && window.va) {
    window.va('track', 'Web Vital', {
      metric: data.metric.name,
      value: data.metric.value,
      threshold: data.threshold,
      url: data.url
    })
  }
  
  // Send to Google Analytics 4 if available
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', data.metric.name, {
      value: Math.round(data.metric.name === 'CLS' ? data.metric.value * 1000 : data.metric.value),
      metric_rating: data.threshold,
      custom_parameters: {
        page_location: data.url,
        connection_type: data.connectionType
      }
    })
  }
  
  // Send to custom analytics endpoint
  if (process.env.NODE_ENV === 'production') {
    fetch('/api/analytics/vitals', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }).catch((error) => {
      console.warn('Failed to send vitals data:', error)
    })
  }
  
  // Console log in development
  if (process.env.NODE_ENV === 'development') {
    console.group(`🔍 Web Vital: ${data.metric.name}`)
    console.log(`Value: ${data.metric.value.toFixed(2)}${data.metric.name === 'CLS' ? '' : 'ms'}`)
    console.log(`Rating: ${data.threshold}`)
    console.log(`URL: ${data.url}`)
    console.log(`Connection: ${data.connectionType}`)
    console.groupEnd()
  }
}

function createMetricHandler(metricName: string) {
  return (metric: Metric) => {
    const performanceData: PerformanceData = {
      metric,
      threshold: getThresholdStatus(metricName, metric.value),
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      connectionType: getConnectionType()
    }
    
    sendMetricToAnalytics(performanceData)
  }
}

// Main function to report all Web Vitals
export function reportWebVitals() {
  try {
    // Core Web Vitals (affect SEO)
    getCLS(createMetricHandler('CLS'))
    getFID(createMetricHandler('FID'))
    getLCP(createMetricHandler('LCP'))
    
    // Other important metrics
    getFCP(createMetricHandler('FCP'))
    getTTFB(createMetricHandler('TTFB'))
  } catch (error) {
    console.warn('Failed to initialize Web Vitals reporting:', error)
  }
}

// Custom performance monitoring
export class PerformanceMonitor {
  private static instance: PerformanceMonitor
  private observers: PerformanceObserver[] = []
  
  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor()
    }
    return PerformanceMonitor.instance
  }
  
  startMonitoring() {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
      return
    }
    
    // Monitor long tasks (main thread blocking)
    this.observeLongTasks()
    
    // Monitor layout shifts beyond CLS
    this.observeLayoutShifts()
    
    // Monitor resource loading
    this.observeResourceTiming()
    
    // Monitor navigation timing
    this.observeNavigationTiming()
  }
  
  private observeLongTasks() {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 50) { // Tasks longer than 50ms
            console.warn(`Long task detected: ${entry.duration.toFixed(2)}ms`)
            
            // Send to analytics
            if (process.env.NODE_ENV === 'production') {
              fetch('/api/analytics/performance', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  type: 'long-task',
                  duration: entry.duration,
                  url: window.location.href,
                  timestamp: Date.now()
                })
              }).catch(() => {})
            }
          }
        }
      })
      
      observer.observe({ entryTypes: ['longtask'] })
      this.observers.push(observer)
    } catch (error) {
      console.warn('Failed to observe long tasks:', error)
    }
  }
  
  private observeLayoutShifts() {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if ((entry as any).value > 0.1) { // Significant layout shift
            console.warn(`Layout shift detected: ${(entry as any).value.toFixed(4)}`)
          }
        }
      })
      
      observer.observe({ entryTypes: ['layout-shift'] })
      this.observers.push(observer)
    } catch (error) {
      console.warn('Failed to observe layout shifts:', error)
    }
  }
  
  private observeResourceTiming() {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const resource = entry as PerformanceResourceTiming
          
          // Check for slow resources (>2s)
          if (resource.duration > 2000) {
            console.warn(`Slow resource: ${resource.name} took ${resource.duration.toFixed(2)}ms`)
          }
          
          // Check for failed resources
          if (resource.transferSize === 0 && resource.decodedBodySize === 0) {
            console.warn(`Failed to load resource: ${resource.name}`)
          }
        }
      })
      
      observer.observe({ entryTypes: ['resource'] })
      this.observers.push(observer)
    } catch (error) {
      console.warn('Failed to observe resource timing:', error)
    }
  }
  
  private observeNavigationTiming() {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const navigation = entry as PerformanceNavigationTiming
          
          // Calculate key metrics
          const metrics = {
            dns: navigation.domainLookupEnd - navigation.domainLookupStart,
            tcp: navigation.connectEnd - navigation.connectStart,
            ssl: navigation.secureConnectionStart > 0 
              ? navigation.connectEnd - navigation.secureConnectionStart 
              : 0,
            ttfb: navigation.responseStart - navigation.requestStart,
            download: navigation.responseEnd - navigation.responseStart,
            domContentLoaded: navigation.domContentLoadedEventEnd - navigation.navigationStart,
            load: navigation.loadEventEnd - navigation.navigationStart
          }
          
          console.log('Navigation timing:', metrics)
          
          // Send to analytics if performance is concerning
          if (metrics.load > 3000 || metrics.ttfb > 1000) {
            fetch('/api/analytics/performance', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                type: 'navigation',
                metrics,
                url: window.location.href,
                timestamp: Date.now()
              })
            }).catch(() => {})
          }
        }
      })
      
      observer.observe({ entryTypes: ['navigation'] })
      this.observers.push(observer)
    } catch (error) {
      console.warn('Failed to observe navigation timing:', error)
    }
  }
  
  stopMonitoring() {
    this.observers.forEach(observer => observer.disconnect())
    this.observers = []
  }
}

// Initialize performance monitoring
export function initializePerformanceMonitoring() {
  if (typeof window !== 'undefined') {
    reportWebVitals()
    PerformanceMonitor.getInstance().startMonitoring()
  }
}

// Performance measurement utilities
export function measureAsyncOperation<T>(
  name: string,
  operation: () => Promise<T>
): Promise<T> {
  const start = performance.now()
  
  return operation().then(
    (result) => {
      const duration = performance.now() - start
      console.log(`⚡ ${name} completed in ${duration.toFixed(2)}ms`)
      
      if (duration > 1000) {
        console.warn(`⚠️ Slow operation: ${name} took ${duration.toFixed(2)}ms`)
      }
      
      return result
    },
    (error) => {
      const duration = performance.now() - start
      console.error(`❌ ${name} failed after ${duration.toFixed(2)}ms:`, error)
      throw error
    }
  )
}

// Component rendering performance
export function measureComponentRender(componentName: string) {
  return function <T extends React.ComponentType<any>>(Component: T): T {
    const WrappedComponent = (props: any) => {
      const renderStart = performance.now()
      
      React.useEffect(() => {
        const renderTime = performance.now() - renderStart
        
        if (renderTime > 16) { // Longer than one frame (60fps)
          console.warn(`🐌 Slow render: ${componentName} took ${renderTime.toFixed(2)}ms`)
        }
      })
      
      return React.createElement(Component, props)
    }
    
    WrappedComponent.displayName = `PerformanceMonitor(${componentName})`
    
    return WrappedComponent as T
  }
} 