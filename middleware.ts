import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rate limiting store (in production, use Redis)
const rateLimit = new Map<string, { count: number; resetTime: number }>();

// Security configuration
const SECURITY_CONFIG = {
  maxRequests: 100, // per 15 minutes
  windowMs: 15 * 60 * 1000, // 15 minutes
  blockedIPs: new Set<string>(),
  suspiciousPatterns: [
    /\<script\>/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /eval\(/i,
    /union\s+select/i,
    /drop\s+table/i
  ]
};

// CSRF token validation
function validateCSRFToken(request: NextRequest): boolean {
  const method = request.method;
  if (['GET', 'HEAD', 'OPTIONS'].includes(method)) {
    return true; // Safe methods don't need CSRF protection
  }

  const token = request.headers.get('x-csrf-token');
  const cookieToken = request.cookies.get('csrf-token')?.value;
  
  return token && cookieToken && token === cookieToken;
}

// Advanced rate limiting
function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const key = ip;
  
  if (!rateLimit.has(key)) {
    rateLimit.set(key, { count: 1, resetTime: now + SECURITY_CONFIG.windowMs });
    return { allowed: true, remaining: SECURITY_CONFIG.maxRequests - 1 };
  }

  const entry = rateLimit.get(key)!;
  
  if (now > entry.resetTime) {
    // Reset window
    entry.count = 1;
    entry.resetTime = now + SECURITY_CONFIG.windowMs;
    return { allowed: true, remaining: SECURITY_CONFIG.maxRequests - 1 };
  }

  entry.count++;
  
  if (entry.count > SECURITY_CONFIG.maxRequests) {
    return { allowed: false, remaining: 0 };
  }

  return { allowed: true, remaining: SECURITY_CONFIG.maxRequests - entry.count };
}

// Security threat detection
function detectThreats(request: NextRequest): { threat: boolean; type?: string } {
  const url = request.url.toLowerCase();
  const userAgent = request.headers.get('user-agent') || '';
  
  // Check for SQL injection patterns
  if (SECURITY_CONFIG.suspiciousPatterns.some(pattern => pattern.test(url))) {
    return { threat: true, type: 'injection_attempt' };
  }

  // Check for bot patterns
  if (userAgent.includes('bot') && !userAgent.includes('googlebot')) {
    return { threat: true, type: 'suspicious_bot' };
  }

  // Check for excessive requests from same IP
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
  if (SECURITY_CONFIG.blockedIPs.has(ip)) {
    return { threat: true, type: 'blocked_ip' };
  }

  return { threat: false };
}

export async function middleware(request: NextRequest) {
  const startTime = Date.now();
  
  // Get client IP
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
  
  // 1. Security threat detection
  const threatCheck = detectThreats(request);
  if (threatCheck.threat) {
    console.log(`🚨 Security threat detected: ${threatCheck.type} from ${ip}`);
    return new NextResponse('Forbidden', { status: 403 });
  }

  // 2. Rate limiting
  const rateCheck = checkRateLimit(ip);
  if (!rateCheck.allowed) {
    console.log(`🚫 Rate limit exceeded for ${ip}`);
    return new NextResponse('Too Many Requests', { 
      status: 429,
      headers: {
        'Retry-After': '900', // 15 minutes
        'X-RateLimit-Remaining': '0'
      }
    });
  }

  // 3. CSRF protection for state-changing requests
  if (!validateCSRFToken(request) && request.nextUrl.pathname.startsWith('/api/')) {
    if (!['GET', 'HEAD', 'OPTIONS'].includes(request.method)) {
      console.log(`🛡️ CSRF validation failed for ${request.nextUrl.pathname}`);
      return new NextResponse('CSRF token missing or invalid', { status: 403 });
    }
  }

  // 4. Supabase authentication
  const response = NextResponse.next();
  const supabase = createMiddlewareClient({ req: request, res: response });
  
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // 5. Protected routes
  const protectedPaths = [
    '/dashboard',
    '/admin',
    '/settings',
    '/profile',
    '/messages',
    '/matches',
    '/analytics',
    '/companies/dashboard',
    '/onboarding'
  ];

  const isProtectedPath = protectedPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  );

  if (isProtectedPath && !session) {
    const redirectUrl = new URL('/login', request.url);
    redirectUrl.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // 6. Admin-only routes
  const adminPaths = ['/admin'];
  const isAdminPath = adminPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  );

  if (isAdminPath && session) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', session.user.id)
      .single();

    if (!profile?.is_admin) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  // 7. Add comprehensive security headers
  const securityHeaders = {
    // Content Security Policy
    'Content-Security-Policy': [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://unpkg.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https: blob:",
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.github.com",
      "frame-src 'none'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "upgrade-insecure-requests"
    ].join('; '),
    
    // Security headers
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'X-XSS-Protection': '1; mode=block',
    
    // Rate limiting headers
    'X-RateLimit-Limit': SECURITY_CONFIG.maxRequests.toString(),
    'X-RateLimit-Remaining': rateCheck.remaining.toString(),
    
    // Performance headers
    'X-Response-Time': `${Date.now() - startTime}ms`,
    'Cache-Control': 'public, max-age=0, must-revalidate',
    
    // CSRF token for forms
    'X-CSRF-Token': crypto.randomUUID(),
  };

  // Apply all security headers
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // Set CSRF token cookie
  response.cookies.set('csrf-token', securityHeaders['X-CSRF-Token'], {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 3600 // 1 hour
  });

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};