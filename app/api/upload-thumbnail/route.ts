import { NextResponse } from "next/server";
import imagekit from "../../lib/imagekit";

export async function POST(req: Request) {
  try {
    const data = await req.formData();
    const file = data.get("file") as File;
    const fileName = data.get("fileName")?.toString() || "thumbnail";

    if (!file) {
      return NextResponse.json({ success: false, error: "No file provided" });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await imagekit.upload({
      file: buffer,
      fileName,
      folder: "/thumbnails",
    });

    return NextResponse.json({ success: true, url: result.url });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ success: false, error: error.message });
  }
}
