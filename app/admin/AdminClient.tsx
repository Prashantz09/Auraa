"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileUpload } from "@/components/ui/file-upload";
import TagInput from "@/components/ui/multiple-input";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";

interface Props {
  fetchVideos: () => void;
  editVideo?: any;
  clearEdit?: () => void;
}

export default function AddVideoForm({
  fetchVideos,
  editVideo,
  clearEdit,
}: Props) {
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    tags: string[];
    videoUrl: string;
    imageUrl: string;
    type: string;
  }>({
    title: "",
    description: "",
    tags: [],
    videoUrl: "",
    imageUrl: "",
    type: "horizontal",
  });
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [videoDriveLink, setVideoDriveLink] = useState("");
  const [message, setMessage] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editVideo) {
      setFormData({
        title: editVideo.title,
        description: editVideo.description,
        tags: editVideo.tags || [],
        videoUrl: editVideo.videoUrl,
        imageUrl: editVideo.imageUrl,
        type: editVideo.type,
      });
      setVideoDriveLink(editVideo.videoUrl);
      setThumbnailFile(null);
    }
  }, [editVideo]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    setThumbnailFile(e.target.files[0]);
  };

  const handleFileUpload = (files: File[]) => {
    if (files.length > 0) {
      setThumbnailFile(files[0]);
      setFormData((prev) => ({
        ...prev,
        imageUrl: "",
      }));
    }
  };
  const toggleVideoType = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      type: checked ? "vertical" : "horizontal",
    }));
  };
  const uploadToCloudinary = (file: File, folder = "videos") => {
    return new Promise<string>((resolve, reject) => {
      const cloudName = process.env.NEXT_PUBLIC_CLOUD_NAME;
      if (!cloudName)
        return reject(new Error("NEXT_PUBLIC_CLOUD_NAME not found"));

      const url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;
      const formDataCloud = new FormData();
      formDataCloud.append("file", file);
      formDataCloud.append("upload_preset", "Auraa Video Upload");
      formDataCloud.append("folder", folder);

      const xhr = new XMLHttpRequest();
      xhr.open("POST", url);

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable)
          setUploadProgress(Math.round((e.loaded / e.total) * 100));
      };

      xhr.onload = () => {
        if (xhr.status === 200)
          resolve(JSON.parse(xhr.responseText).secure_url);
        else reject(new Error(`Upload failed: ${xhr.status}`));
      };
      xhr.onerror = () => reject(new Error("Upload failed"));
      xhr.send(formDataCloud);
    });
  };

  const processGoogleDriveLink = (shareLink: string) => {
    const match = shareLink.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    return match?.[1]
      ? `https://drive.google.com/file/d/${match[1]}/preview`
      : shareLink;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      let imageUrl = editVideo?.imageUrl;
      if (thumbnailFile)
        imageUrl = await uploadToCloudinary(thumbnailFile, "thumbnails");
      const videoUrl = processGoogleDriveLink(videoDriveLink);

      const body: {
        videoUrl: string;
        imageUrl: any;
        title: string;
        description: string;
        type: string;
        tags: string[];
        id?: number;
      } = { ...formData, videoUrl, imageUrl };
      const method = editVideo ? "PUT" : "POST";
      if (editVideo) body.id = editVideo.id;

      const res = await fetch("/api/video", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (data.success) {
        setMessage(editVideo ? "🎉 Video updated!" : "🎉 Video added!");
        fetchVideos();
        clearEdit?.();
        setFormData({
          title: "",
          description: "",
          tags: [],
          videoUrl: "",
          imageUrl: "",
          type: "horizontal",
        });
        setVideoDriveLink("");
        setThumbnailFile(null);
        setUploadProgress(0);
      } else setMessage("❌ " + data.error);
    } catch (err) {
      console.error(err);
      setMessage("❌ Error processing video.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-10 backdrop-blur-sm bg-white/10 border border-white/20 rounded-2xl shadow-xl">
      <h1 className="text-3xl font-bold text-white mb-6 text-center">
        {editVideo ? "Edit Video" : "Add New Video"}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 rounded-lg border border-white/30 bg-white/10 text-white placeholder-white/60 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition"
        />
        {/* Description */}
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 rounded-lg border border-white/30 bg-white/10 text-white placeholder-white/60 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition"
        />
        {/* Selects */}
        <TagInput
          defaultValue={formData.tags}
          placeholder="Add tags…"
          onChange={(values: string[]) =>
            setFormData((prev) => ({ ...prev, tags: values }))
          }
        />

        {/* Thumbnail */}

        <FileUpload
          onChange={(files: File[]) => {
            if (files.length > 0) {
              setThumbnailFile(files[0]);
              setFormData((prev) => ({ ...prev, imageUrl: "" })); // clear old URL
            }
          }}
        />
        {/* Google Drive Link */}
        <h2 className="mt-8">Google Drive Video Link</h2>
        <input
          type="url"
          placeholder="Google Drive Video Link"
          value={videoDriveLink}
          onChange={(e) => {
            setVideoDriveLink(e.target.value);
            setFormData((prev) => ({ ...prev, videoUrl: e.target.value }));
          }}
          required
        />

        {/* Checkbox */}

        <FieldGroup className="mx-2 ">
          <Field orientation="horizontal">
            <Checkbox
              id="video-format-checkbox"
              name="video-format-checkbox"
              checked={formData.type === "vertical"}
              onCheckedChange={(checked) => toggleVideoType(checked as boolean)}
            />
            <FieldLabel htmlFor="terms-checkbox-basic">
              Select if Provided video from Google Drive is in Vertical (Reels)
              format
            </FieldLabel>
          </Field>
        </FieldGroup>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition"
        >
          {loading ? "Processing..." : "Add Video"}
        </button>
      </form>

      {/* Upload Progress */}
      <AnimatePresence>
        {uploadProgress > 0 && (
          <motion.div
            className="mt-4 w-full bg-white/20 h-2 rounded-full overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="h-2 bg-blue-500"
              initial={{ width: "0%" }}
              animate={{ width: `${uploadProgress}%` }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Message */}
      <AnimatePresence>
        {message && (
          <motion.p
            className="mt-4 text-center text-white font-medium"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {message}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
