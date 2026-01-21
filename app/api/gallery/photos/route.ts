import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySessionToken } from "@/app/lib/auth/adminAuth";
import {
  getPublishedPhotos,
  getAllPhotosForAdmin,
  createPhoto,
} from "@/app/lib/db/queries";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const admin = searchParams.get("admin") === "true";

    if (admin) {
      // Verify admin authentication for admin list
      const cookieStore = await cookies();
      const sessionToken = cookieStore.get("galleryAdminSession")?.value;

      if (!verifySessionToken(sessionToken)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const photos = await getAllPhotosForAdmin();
      return NextResponse.json({ photos });
    }

    // Public photos
    const photos = await getPublishedPhotos(100, 0);
    return NextResponse.json({ photos });
  } catch (error) {
    console.error("Get photos error:", error);
    return NextResponse.json(
      { error: "Failed to fetch photos" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("galleryAdminSession")?.value;

    if (!verifySessionToken(sessionToken)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();

    // Validate required fields
    if (!data.title || !data.image_url || !data.alt_text || !data.slug) {
      return NextResponse.json(
        { error: "Missing required fields: title, image_url, alt_text, slug" },
        { status: 400 }
      );
    }

    const photo = await createPhoto(data);
    return NextResponse.json({ photo }, { status: 201 });
  } catch (error) {
    console.error("Create photo error:", error);
    return NextResponse.json(
      { error: "Failed to create photo" },
      { status: 500 }
    );
  }
}
