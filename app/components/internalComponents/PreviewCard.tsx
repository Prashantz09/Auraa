"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useOutsideClick } from "@/hooks/use-outside-click";

interface VideoType {
  id: number;
  title: string;
  description: string;
  videoUrl: string;
  imageUrl: string;
  type?: string;
}

export default function ExpandableCardDemo({
  videos,
}: {
  videos: VideoType[];
}) {
  const [active, setActive] = useState<VideoType | null>(null);
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActive(null);
      }
    }

    document.body.style.overflow = active ? "hidden" : "auto";
    window.addEventListener("keydown", onKeyDown);

    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useEffect(() => {
    if (active && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  }, [active]);

  useOutsideClick(ref, () => setActive(null));

  return (
    <>
      {/* Overlay */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      {/* Expanded Card */}
      <AnimatePresence>
        {active && (
          <div className="fixed inset-0 grid place-items-center z-50 p-4">
            <motion.div
              layoutId={`card-${active.id}-${id}`}
              ref={ref}
              className="w-full max-w-3xl bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden shadow-2xl"
            >
              {/* 🔥 Video replaces image */}
              <video
                ref={videoRef}
                src={active.videoUrl}
                controls
                autoPlay
                className={`w-full ${
                  active.type === "vertical"
                    ? "h-[600px] object-contain"
                    : "h-[400px] object-cover"
                }`}
              />

              <div className="p-6 text-white">
                <h3 className="text-2xl font-light tracking-wide">
                  {active.title}
                </h3>

                <p className="text-white/60 mt-2">{active.description}</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Grid */}
      <ul className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <motion.li
            key={video.id}
            layoutId={`card-${video.id}-${id}`}
            onClick={() => setActive(video)}
            className="cursor-pointer group bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition"
          >
            <img
              src={video.imageUrl}
              alt={video.title}
              className={`w-full ${
                video.type === "vertical"
                  ? "h-80 object-contain"
                  : "h-64 object-cover"
              } group-hover:scale-105 transition duration-500`}
            />

            <div className="p-5 text-white">
              <h3 className="text-lg font-light tracking-wide group-hover:text-cyan-300 transition">
                {video.title}
              </h3>

              <p className="text-white/50 text-sm mt-2">{video.description}</p>
            </div>
          </motion.li>
        ))}
      </ul>
    </>
  );
}
