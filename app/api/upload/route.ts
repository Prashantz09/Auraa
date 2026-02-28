import { NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";
import cloudinary from "../../lib/cloudinary";
import imagekit from "../../lib/imagekit";
import { UploadApiErrorResponse, UploadApiResponse } from "cloudinary";

export async function POST(req: Request) {
  try {
    const data = await req.formData();

    // -----------------------------
    // Extract text fields
    // -----------------------------
    const title = data.get("title")?.toString() || "";
    const description = data.get("description")?.toString() || "";
    const features = data.get("features")?.toString() || "";
    const client = data.get("client")?.toString() || "";
    const category = data.get("category")?.toString() || "General";
    const type = data.get("type")?.toString() || "Free";
    const featured = data.get("featured") === "true";

    // -----------------------------
    // Extract files
    // -----------------------------
    const videoFile = data.get("video") as File;
    const imageFile = data.get("thumbnail") as File;

    if (!videoFile || !imageFile) {
      return NextResponse.json({
        success: false,
        error: "Video and thumbnail are required.",
      });
    }

    // -----------------------------
    // Upload video to Cloudinary
    // -----------------------------
    const videoBuffer = Buffer.from(await videoFile.arrayBuffer());

    const uploadVideo = () =>
      new Promise<string>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: "video", folder: "videos" },
          (
            error: UploadApiErrorResponse | undefined,
            result: UploadApiResponse | undefined,
          ) => {
            if (error) reject(error);
            else if (result) resolve(result.secure_url);
            else reject(new Error("Video upload failed"));
          },
        );
        stream.end(videoBuffer);
      });

    const videoUrl = await uploadVideo();

    // -----------------------------
    // Upload thumbnail to ImageKit
    // -----------------------------
    const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
    const imageUpload = await imagekit.upload({
      file: imageBuffer,
      fileName: imageFile.name,
      folder: "/thumbnails",
    });

    const imageUrl = imageUpload.url;

    // -----------------------------
    // Save metadata in Prisma
    // -----------------------------
    const video = await prisma.video.create({
      data: {
        title,
        description,

        // client,

        type,

        videoUrl,
        imageUrl,
      },
    });

    return NextResponse.json({ success: true, video });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ success: false, error: error.message });
  }
}
