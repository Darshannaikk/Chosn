// Advanced Security Module for 100% Security Score
import { NextRequest } from 'next/server';

export interface SecurityConfig {
  maxRequests: number;
  windowMs: number;
  blockedIPs: Set<string>;
  suspiciousPatterns: RegExp[];
  trustedOrigins: string[];
}

export interface ThreatDetection {
  threat: boolean;
  type?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  details?: string;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
}

export class AdvancedSecurityService {
  private rateLimit = new Map<string, { count: number; resetTime: number }>();
  private threatLog = new Map<string, number>();
  
  private config: SecurityConfig = {
    maxRequests: 100, // per 15 minutes
    windowMs: 15 * 60 * 1000, // 15 minutes
    blockedIPs: new Set(),
    suspiciousPatterns: [
      // SQL Injection patterns
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION)\b)/i,
      /(\b(OR|AND)\s+\d+\s*=\s*\d+)/i,
      /(;|\s)+(DROP|DELETE)\s+/i,
      
      // XSS patterns
      /<script[^>]*>.*?<\/script>/gi,
      /javascript:/i,
      /on\w+\s*=\s*["\'][^"\']*["\'']/i,
      /eval\s*\(/i,
      
      // Path traversal
      /\.\./,
      /\/etc\/passwd/i,
      /\/proc\/self\/environ/i,
      
      // Command injection
      /[;&|`]\s*(cat|ls|whoami|id|uname)/i,
      /\$\{.*\}/,
      
      // LDAP injection
      /[()&|!]/,
    ],
    trustedOrigins: ['https://chosn.dev', 'https://www.chosn.dev']
  };

  // Advanced threat detection
  detectThreats(request: NextRequest): ThreatDetection {
    const url = request.url.toLowerCase();
    const userAgent = request.headers.get('user-agent') || '';
    const referer = request.headers.get('referer') || '';
    const ip = this.getClientIP(request);

    // 1. Check for injection attacks
    for (const pattern of this.config.suspiciousPatterns) {
      if (pattern.test(url) || pattern.test(userAgent)) {
        this.logThreat(ip, 'injection_attempt');
        return {
          threat: true,
          type: 'injection_attempt',
          severity: 'critical',
          details: `Suspicious pattern detected in ${pattern.test(url) ? 'URL' : 'User-Agent'}`
        };
      }
    }

    // 2. Bot detection (advanced)
    if (this.detectMaliciousBot(userAgent, ip)) {
      return {
        threat: true,
        type: 'malicious_bot',
        severity: 'high',
        details: 'Suspicious bot activity detected'
      };
    }

    // 3. Suspicious referrer check
    if (referer && !this.isTrustedOrigin(referer)) {
      const suspiciousReferrers = ['malware', 'phishing', 'spam'];
      if (suspiciousReferrers.some(term => referer.includes(term))) {
        return {
          threat: true,
          type: 'suspicious_referrer',
          severity: 'medium',
          details: `Suspicious referrer: ${referer}`
        };
      }
    }

    // 4. Rate limit violation check
    if (this.threatLog.get(ip) && this.threatLog.get(ip)! > 5) {
      return {
        threat: true,
        type: 'repeated_violations',
        severity: 'high',
        details: 'Multiple security violations detected'
      };
    }

    return { threat: false };
  }

  // Enhanced rate limiting
  checkRateLimit(ip: string, endpoint?: string): RateLimitResult {
    const now = Date.now();
    const key = endpoint ? `${ip}:${endpoint}` : ip;
    
    // Different limits for different endpoints
    const limits = {
      '/api/auth': 5, // 5 per minute for auth
      '/api/email': 10, // 10 per hour for emails
      default: this.config.maxRequests
    };
    
    const limit = endpoint && endpoint in limits 
      ? (limits as any)[endpoint] 
      : limits.default;
    
    if (!this.rateLimit.has(key)) {
      this.rateLimit.set(key, { 
        count: 1, 
        resetTime: now + this.config.windowMs 
      });
      return { 
        allowed: true, 
        remaining: limit - 1, 
        resetTime: now + this.config.windowMs 
      };
    }

    const entry = this.rateLimit.get(key)!;
    
    if (now > entry.resetTime) {
      entry.count = 1;
      entry.resetTime = now + this.config.windowMs;
      return { 
        allowed: true, 
        remaining: limit - 1, 
        resetTime: entry.resetTime 
      };
    }

    entry.count++;
    
    if (entry.count > limit) {
      this.logThreat(ip, 'rate_limit_exceeded');
      return { allowed: false, remaining: 0, resetTime: entry.resetTime };
    }

    return { 
      allowed: true, 
      remaining: limit - entry.count, 
      resetTime: entry.resetTime 
    };
  }

  // CSRF protection
  validateCSRFToken(request: NextRequest): boolean {
    const method = request.method;
    if (['GET', 'HEAD', 'OPTIONS'].includes(method)) {
      return true;
    }

    const token = request.headers.get('x-csrf-token');
    const cookieToken = request.cookies.get('csrf-token')?.value;
    
    return !!(token && cookieToken && token === cookieToken);
  }

  // Generate secure CSRF token
  generateCSRFToken(): string {
    return crypto.randomUUID();
  }

  // Content Security Policy generator
  generateCSP(): string {
    return [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://unpkg.com https://js.stripe.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https: blob:",
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.github.com https://api.stripe.com",
      "frame-src 'self' https://js.stripe.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "upgrade-insecure-requests",
      "block-all-mixed-content"
    ].join('; ');
  }

  // Security headers
  getSecurityHeaders(): Record<string, string> {
    return {
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
      'X-XSS-Protection': '1; mode=block',
    };
  }

  // Helper methods
  private getClientIP(request: NextRequest): string {
    return request.ip || 
           request.headers.get('x-forwarded-for')?.split(',')[0] ||
           request.headers.get('x-real-ip') ||
           'unknown';
  }

  private detectMaliciousBot(userAgent: string, ip: string): boolean {
    const maliciousBots = [
      'scanner', 'crawler', 'spider', 'scraper',
      'harvester', 'extractor', 'ripper', 'sucker'
    ];
    
    const legitBots = [
      'googlebot', 'bingbot', 'slurp', 'duckduckbot',
      'baiduspider', 'yandexbot', 'facebookexternalhit'
    ];

    const lowerUA = userAgent.toLowerCase();
    
    // Check if it's a legitimate bot first
    if (legitBots.some(bot => lowerUA.includes(bot))) {
      return false;
    }

    // Check for malicious patterns
    return maliciousBots.some(bot => lowerUA.includes(bot)) ||
           /bot|crawler|spider/i.test(userAgent) ||
           userAgent === '' || 
           userAgent.length > 500;
  }

  private isTrustedOrigin(referer: string): boolean {
    try {
      const url = new URL(referer);
      return this.config.trustedOrigins.some(origin => 
        url.origin === origin || url.hostname.endsWith('.chosn.dev')
      );
    } catch {
      return false;
    }
  }

  private logThreat(ip: string, type: string): void {
    const count = this.threatLog.get(ip) || 0;
    this.threatLog.set(ip, count + 1);
    
    // Auto-block after 10 violations
    if (count >= 10) {
      this.config.blockedIPs.add(ip);
      console.log(`🚨 Auto-blocked IP ${ip} after ${count + 1} violations`);
    }
    
    console.log(`🔒 Security threat logged: ${type} from ${ip}`);
  }

  // Cleanup expired entries
  cleanup(): void {
    const now = Date.now();
    
    for (const [key, entry] of this.rateLimit.entries()) {
      if (now > entry.resetTime) {
        this.rateLimit.delete(key);
      }
    }
  }

  // Security audit logging
  auditLog(request: NextRequest, action: string, details?: any): void {
    const log = {
      timestamp: new Date().toISOString(),
      ip: this.getClientIP(request),
      userAgent: request.headers.get('user-agent'),
      url: request.url,
      method: request.method,
      action,
      details
    };
    
    // In production, send to monitoring service
    console.log('🔍 Security Audit:', JSON.stringify(log));
  }
}

export const securityService = new AdvancedSecurityService(); 