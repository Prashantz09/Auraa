import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";

/* ===========================
   GET ALL VIDEOS
=========================== */
export async function GET() {
  try {
    const videos = await prisma.video.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: videos });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch videos" },
      { status: 500 },
    );
  }
}

/* ===========================
   CREATE VIDEO
=========================== */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const video = await prisma.video.create({
      data: {
        title: body.title,
        description: body.description,
        tags: Array.isArray(body.tags) ? body.tags : [],
        videoUrl: body.videoUrl,
        imageUrl: body.imageUrl,
        type: body.type,
      },
    });

    return NextResponse.json({ success: true, data: video }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: "Failed to create video" },
      { status: 400 },
    );
  }
}

/* ===========================
   UPDATE VIDEO
=========================== */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    const updated = await prisma.video.update({
      where: { id: Number(body.id) }, // 🔥 force number
      data: {
        title: body.title,
        description: body.description,
        tags: Array.isArray(body.tags) ? body.tags : [],
        videoUrl: body.videoUrl,
        imageUrl: body.imageUrl,
        type: body.type,
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: "Failed to update video" },
      { status: 400 },
    );
  }
}

/* ===========================
   DELETE VIDEO
=========================== */
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();

    await prisma.video.delete({
      where: { id: Number(body.id) }, // 🔥 force number
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: "Failed to delete video" },
      { status: 400 },
    );
  }
}
