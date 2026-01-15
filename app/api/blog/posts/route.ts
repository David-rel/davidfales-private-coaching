import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySessionToken } from '@/app/lib/auth/adminAuth';
import { getPublishedPosts, getAllPostsForAdmin, createPost, checkSlugExists } from '@/app/lib/db/queries';

// GET all posts (public or admin)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const publishedOnly = searchParams.get('published') !== 'false';
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    let posts;
    if (publishedOnly) {
      posts = await getPublishedPosts(limit, offset);
    } else {
      // Admin view - check authentication
      const cookieStore = await cookies();
      const sessionToken = cookieStore.get('blogAdminSession')?.value;
      if (!verifySessionToken(sessionToken)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      posts = await getAllPostsForAdmin(limit, offset);
    }

    return NextResponse.json({ posts });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

// POST create new post (admin only)
export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('blogAdminSession')?.value;
    if (!verifySessionToken(sessionToken)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Validate required fields
    if (!body.title || !body.slug || !body.content_html) {
      return NextResponse.json(
        { error: 'Missing required fields: title, slug, content_html' },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const slugExists = await checkSlugExists(body.slug);
    if (slugExists) {
      return NextResponse.json(
        { error: 'Slug already exists' },
        { status: 400 }
      );
    }

    const post = await createPost(body);

    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}
