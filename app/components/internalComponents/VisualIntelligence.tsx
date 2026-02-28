"use client";
import React, { useState, useRef, useEffect } from "react";
import { Upload, Link as LinkIcon, X, Activity } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import GlassCard from "./GlassCard";

export const VideoRequestCore = () => {
  const [mode, setMode] = useState<"upload" | "link">("upload");
  const [fileName, setFileName] = useState<string | null>(null);
  const [videoLink, setVideoLink] = useState("");
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [linkError, setLinkError] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const MAX_SIZE = 500 * 1024 * 1024; // 500MB

  const reset = () => {
    setFileName(null);
    setVideoLink("");
    setSelectedFile(null);
    setFileError(null);
    setLinkError(null);
  };

  const notifySuccess = (msg: string) => {
    toast.success(msg, {
      position: "top-right",
      duration: 5000,
    });
  };

  const notifyWarning = (msg: string) => {
    toast.warning(msg, {
      position: "top-right",
      duration: 5500,
    });
  };

  const notifyError = (msg: string) => {
    toast.error(msg, {
      position: "top-right",
      duration: 5500,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > MAX_SIZE) {
        setFileError("File too large! Max size is 500MB.");
        notifyWarning("⚠️ File too large! Maximum allowed size is 500MB.");
        setFileName(null);
        setSelectedFile(null);
      } else {
        setFileError(null);
        setFileName(file.name);
        setSelectedFile(file);
        notifySuccess("✅ File ready to upload!");
      }
    }
  };
  console.log("EMAIL:", process.env.GOOGLE_CLIENT_EMAIL);
  console.log("KEY:", !!process.env.GOOGLE_PRIVATE_KEY);
  const validateLink = (url: string) => {
    const pattern =
      /^(https?:\/\/)?(www\.)?(drive\.google\.com|dropbox\.com|we\.tl)/i;
    return pattern.test(url);
  };

  useEffect(() => {
    if (mode === "link" && videoLink.length > 0) {
      if (!validateLink(videoLink)) {
        setLinkError("Invalid video link.");
        notifyWarning(
          "⚠️ Only Google Drive, Dropbox or WeTransfer links allowed!",
        );
      } else {
        setLinkError(null);
      }
    }
  }, [videoLink, mode]);

  // Sumbit Function
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (fileError || linkError) {
      notifyWarning("⚠️ Please fix all errors before submitting!");
      return;
    }

    if (mode === "upload" && !selectedFile) {
      notifyWarning("⚠️ Please select a video file to upload!");
      return;
    }

    if (mode === "link" && !videoLink) {
      notifyWarning("⚠️ Please enter a video link!");
      return;
    }

    const formData = new FormData(e.target as HTMLFormElement);
    formData.append("mode", mode);

    if (mode === "upload" && selectedFile) {
      formData.append("file", selectedFile);
    }
    if (mode === "link") {
      formData.append("videoLink", videoLink);
    }

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/video-request");

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = (event.loaded / event.total) * 100;
        setProgress(Math.round(percent));
      }
    };

    xhr.onloadstart = () => setUploading(true);
    xhr.onloadend = () => {
      setUploading(false);
      setProgress(0);
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        notifySuccess("🚀 Request sent! We’ll be in touch soon.");
        reset();
      } else {
        notifyError("❌ Upload failed. Try again or contact support.");
      }
    };

    xhr.onerror = () => {
      notifyError("❌ Upload failed unexpectedly!");
    };

    xhr.send(formData);
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <Activity className="w-5 h-5 text-cyan-400 animate-pulse" />
        <h2 className="text-xl tracking-[0.3em] font-light text-white/90">
          VIDEO_REQUEST_CORE
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-[500px]">
        {/* LEFT PANEL */}
        <GlassCard className="p-6 flex flex-col relative">
          <div className=" top-0 right-0 pb-4 pl-4 opacity-50 font-mono text-[14px] tracking-widest">
            Upload Video Here
          </div>

          {/* Toggle */}
          <div className="flex mb-6 bg-black/30 border border-white/10 rounded-lg overflow-hidden text-xs font-mono tracking-wider">
            <button
              onClick={() => {
                reset();
                setMode("upload");
              }}
              className={`flex-1 p-3 transition-all ${
                mode === "upload"
                  ? "bg-cyan-500/20 text-cyan-300"
                  : "text-white/40 hover:bg-white/5"
              }`}
            >
              UPLOAD FILE
            </button>
            <button
              onClick={() => {
                reset();
                setMode("link");
              }}
              className={`flex-1 p-3 transition-all ${
                mode === "link"
                  ? "bg-cyan-500/20 text-cyan-300"
                  : "text-white/40 hover:bg-white/5"
              }`}
            >
              PASTE LINK
            </button>
          </div>

          {/* Upload Mode */}
          <AnimatePresence mode="wait">
            {mode === "upload" ? (
              <motion.div
                key="upload"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1"
              >
                {!fileName ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="h-full border border-dashed border-white/20 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-colors"
                  >
                    <Upload className="w-8 h-8 text-white/40 mb-4" />
                    <span className="text-xs tracking-[0.2em] text-white/60">
                      UPLOAD VIDEO ASSET
                    </span>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="video/*"
                      onChange={handleFileChange}
                    />
                  </div>
                ) : (
                  <div className="relative h-full bg-black/40 rounded-lg flex items-center justify-center">
                    <span className="text-cyan-300 text-sm font-mono">
                      {fileName}
                    </span>
                    <button
                      onClick={reset}
                      className="absolute top-2 right-2 p-2 bg-black/50 hover:bg-red-500/50 rounded-full transition-colors"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                  </div>
                )}
                {fileError && (
                  <p className="text-red-400 text-xs mt-2 font-mono">
                    {fileError}
                  </p>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="link"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col justify-center"
              >
                <div className="flex items-center gap-3 mb-3 text-white/40 text-xs font-mono tracking-wider">
                  <LinkIcon className="w-4 h-4" />
                  ENTER VIDEO LINK
                </div>
                <input
                  type="text"
                  value={videoLink}
                  onChange={(e) => setVideoLink(e.target.value)}
                  placeholder="https://drive.google.com/..."
                  className="w-full bg-black/30 border border-white/10 rounded p-4 text-sm font-mono text-cyan-200 placeholder:text-white/20 focus:outline-none focus:border-cyan-500/50 transition-all"
                />
                {linkError && (
                  <p className="text-red-400 text-xs mt-2 font-mono">
                    {linkError}
                  </p>
                )}
              </motion.div>
            )}
            {uploading && (
              <div className="mt-4 w-full bg-black/40 rounded h-2 overflow-hidden">
                <div
                  className="bg-cyan-400 h-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}
          </AnimatePresence>
        </GlassCard>

        {/* RIGHT PANEL - FORM */}
        <GlassCard className="p-6 flex flex-col relative">
          <div className=" top-0 right-0 pb-4 pl-4 opacity-50 font-mono text-[14px] tracking-widest">
            REQUEST_FORM_BUFFER
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6 mt-8">
            <input
              type="text"
              placeholder="FIRST NAME"
              className="bg-black/30 border border-white/10 rounded p-4 text-sm font-mono text-cyan-200 placeholder:text-white/20 focus:outline-none focus:border-cyan-500/50"
            />

            <input
              type="text"
              placeholder="LAST NAME"
              className="bg-black/30 border border-white/10 rounded p-4 text-sm font-mono text-cyan-200 placeholder:text-white/20 focus:outline-none focus:border-cyan-500/50"
            />

            <input
              type="email"
              placeholder="EMAIL ADDRESS"
              className="bg-black/30 border border-white/10 rounded p-4 text-sm font-mono text-cyan-200 placeholder:text-white/20 focus:outline-none focus:border-cyan-500/50"
            />

            <textarea
              placeholder="DESCRIBE VIDEO EDIT REQUIREMENTS..."
              rows={4}
              className="bg-black/30 border border-white/10 rounded p-4 text-sm font-mono text-cyan-200 placeholder:text-white/20 focus:outline-none focus:border-cyan-500/50 resize-none"
            />

            <button
              type="submit"
              className="mt-4 p-4 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/30 text-cyan-300 text-xs tracking-[0.3em] font-mono transition-all"
            >
              TRANSMIT REQUEST
            </button>
          </form>
        </GlassCard>
      </div>
    </div>
  );
};
