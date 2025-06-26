import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://chosn.dev';
  
  const robots = `User-agent: *
Allow: /
Allow: /developers
Allow: /companies
Allow: /pricing
Allow: /contact

Disallow: /api/
Disallow: /profile
Disallow: /settings
Disallow: /messages
Disallow: /matches
Disallow: /onboarding
Disallow: /auth/

Sitemap: ${baseUrl}/sitemap.xml`;

  return new NextResponse(robots, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400'
    }
  });
} 