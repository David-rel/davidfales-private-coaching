import { NextRequest, NextResponse } from "next/server";
import { getPublishedPhotos } from "@/app/lib/db/queries";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    // Get all published photos
    const allPhotos = await getPublishedPhotos(100, 0);

    // Filter for featured photos and limit to 3
    const featuredPhotos = allPhotos
      .filter((photo) => photo.featured)
      .slice(0, 3);

    return NextResponse.json({ photos: featuredPhotos });
  } catch (error) {
    console.error("Get featured photos error:", error);
    return NextResponse.json(
      { error: "Failed to fetch featured photos" },
      { status: 500 }
    );
  }
}

