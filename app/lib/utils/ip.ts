import { NextRequest } from 'next/server';

export function getClientIp(request: NextRequest): string {
  // Try x-forwarded-for first (Vercel, proxies)
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  // Try x-real-ip
  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }

  // Fallback
  return 'unknown';
}
