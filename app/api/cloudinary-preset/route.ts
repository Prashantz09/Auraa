import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    cloudName: process.env.NEXT_PUBLIC_CLOUD_NAME,
    uploadPreset: "Auraa Video Upload", // Your actual unsigned preset name
    folder: "Auraa/Videos",             // Optional: default folder to upload to
  });
}