import { NextRequest, NextResponse } from "next/server";
import { getCommentsByPostId, createComment } from "@/app/lib/db/queries";

// GET comments for a post
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get("postId");

    if (!postId) {
      return NextResponse.json(
        { error: "postId is required" },
        { status: 400 }
      );
    }

    const comments = await getCommentsByPostId(postId, true);

    return NextResponse.json({ comments });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}

// POST create comment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields (only post_id and content are required)
    if (!body.post_id || !body.content) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const authorName =
      typeof body.author_name === "string" && body.author_name.trim().length > 0
        ? body.author_name.trim()
        : "Anonymous";
    const authorEmail =
      typeof body.author_email === "string" &&
      body.author_email.trim().length > 0
        ? body.author_email.trim()
        : null;

    // Validate email format only if provided
    if (authorEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(authorEmail)) {
        return NextResponse.json(
          { error: "Invalid email address" },
          { status: 400 }
        );
      }
    }

    const comment = await createComment({
      post_id: body.post_id,
      author_name: authorName,
      author_email: authorEmail,
      content: body.content,
    });

    return NextResponse.json(
      {
        message: "Comment submitted for moderation",
        comment,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500 }
    );
  }
}
