import { NextRequest, NextResponse } from 'next/server';
import { toggleLike } from '@/app/lib/db/queries';
import { getClientIp } from '@/app/lib/utils/ip';

// POST toggle like
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.post_id) {
      return NextResponse.json(
        { error: 'post_id is required' },
        { status: 400 }
      );
    }

    // Get client IP address
    const ipAddress = getClientIp(request);

    const result = await toggleLike(body.post_id, ipAddress);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error toggling like:', error);
    return NextResponse.json(
      { error: 'Failed to toggle like' },
      { status: 500 }
    );
  }
}
