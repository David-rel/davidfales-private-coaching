import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { generateSessionToken, verifyPassword } from '@/app/lib/auth/adminAuth';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    if (!verifyPassword(password)) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }

    // Generate session token
    const sessionToken = generateSessionToken();

    // Set HTTP-only cookie
    const cookieStore = await cookies();
    cookieStore.set('blogAdminSession', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}
