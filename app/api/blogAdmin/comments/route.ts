import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySessionToken } from "@/app/lib/auth/adminAuth";
import {
  approveComment,
  deleteComment,
  getAllCommentsForAdminWithPost,
} from "@/app/lib/db/queries";

async function requireAuth() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("blogAdminSession")?.value;
  return verifySessionToken(sessionToken);
}

export async function GET(request: NextRequest) {
  try {
    if (!(await requireAuth())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const postId = searchParams.get("postId") || undefined;

    const comments = await getAllCommentsForAdminWithPost(postId);
    return NextResponse.json({ comments });
  } catch (error) {
    console.error("Error fetching admin comments:", error);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    if (!(await requireAuth())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    if (!body?.id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    await approveComment(body.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error approving comment:", error);
    return NextResponse.json(
      { error: "Failed to approve comment" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    if (!(await requireAuth())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    if (!body?.id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    await deleteComment(body.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting comment:", error);
    return NextResponse.json(
      { error: "Failed to delete comment" },
      { status: 500 }
    );
  }
}
