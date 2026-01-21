import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { cookies } from 'next/headers';
import { verifySessionToken } from '@/app/lib/auth/adminAuth';

export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('blogAdminSession')?.value;

    if (!verifySessionToken(sessionToken)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get the file from the request
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type (images only)
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Only image files are allowed' },
        { status: 400 }
      );
    }

    // Validate file size (max 20MB)
    if (file.size > 20 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 20MB' },
        { status: 400 }
      );
    }

    // Upload to Vercel Blob
    const blob = await put(file.name, file, {
      access: 'public',
    });

    return NextResponse.json({ url: blob.url });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    );
  }
}
