"use client";

import { InfiniteMovingCards } from "./ui/infinite-moving-cards";
import { useEffect, useRef, useState, useCallback, useId } from "react";
import { motion, AnimatePresence } from "framer-motion";
// ─── Hook: close on outside click ─────────────────────────────────────────────

// ─── Types ─────────────────────────────────────────────────────────────────────
interface Video {
  id: number;
  title: string;
  description: string;
  tags: string[];
  videoUrl: string;
  imageUrl: string;
  type: string; // "horizontal" | "vertical" — drives layout

  createdAt: string;
}

// ─── Close icon ───────────────────────────────────────────────────────────────
const CloseIcon = () => (
  <motion.svg
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0, transition: { duration: 0.05 } }}
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M18 6l-12 12" />
    <path d="M6 6l12 12" />
  </motion.svg>
);

// ─── Reusable Popup ────────────────────────────────────────────────────────────

// ─── Reusable Popup ────────────────────────────────────────────────────────────

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getDriveEmbedUrl(url: string): string {
  if (!url) return url;
  const fileMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  const idMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  const fileId = fileMatch?.[1] ?? idMatch?.[1];
  if (fileId) {
    return `https://drive.google.com/file/d/${fileId}/preview?autoplay=1`;
  }
  if (url.includes("/preview")) {
    const sep = url.includes("?") ? "&" : "?";
    return url + sep + "autoplay=1";
  }
  return url;
}

function isDriveUrl(url: string): boolean {
  return url.includes("drive.google.com");
}

function formatTime(s: number): string {
  if (!isFinite(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

function useOutsideClick<T extends HTMLElement>(
  ref: React.RefObject<T | null>,
  callback: () => void,
) {
  useEffect(() => {
    function handleClick(e: globalThis.MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) callback();
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [ref, callback]);
}

// ─── Custom Controls (only for native video) ──────────────────────────────────
function CustomControls({
  videoRef,
}: {
  videoRef: React.RefObject<HTMLVideoElement | null>;
}) {
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [showVolume, setShowVolume] = useState(false);
  const [visible, setVisible] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-hide controls after 3s of no mouse movement
  const resetHideTimer = useCallback(() => {
    setVisible(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => {
      if (playing) setVisible(false);
    }, 3000);
  }, [playing]);

  useEffect(() => {
    resetHideTimer();
    return () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, [playing]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const onPlay = () => setPlaying(true);
    const onPause = () => {
      setPlaying(false);
      setVisible(true);
    };
    const onTimeUpdate = () => setCurrentTime(v.currentTime);
    const onDuration = () => setDuration(v.duration);
    const onVolumeChange = () => {
      setVolume(v.volume);
      setMuted(v.muted);
    };

    v.addEventListener("play", onPlay);
    v.addEventListener("pause", onPause);
    v.addEventListener("timeupdate", onTimeUpdate);
    v.addEventListener("loadedmetadata", onDuration);
    v.addEventListener("volumechange", onVolumeChange);
    return () => {
      v.removeEventListener("play", onPlay);
      v.removeEventListener("pause", onPause);
      v.removeEventListener("timeupdate", onTimeUpdate);
      v.removeEventListener("loadedmetadata", onDuration);
      v.removeEventListener("volumechange", onVolumeChange);
    };
  }, [videoRef]);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    playing ? v.pause() : v.play();
  };

  const seek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = Number(e.target.value);
    setCurrentTime(Number(e.target.value));
  };

  const changeVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = videoRef.current;
    if (!v) return;
    const val = Number(e.target.value);
    v.volume = val;
    v.muted = val === 0;
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
  };

  const toggleFullscreen = () => {
    const el = containerRef.current?.closest(
      ".video-popup-container",
    ) as HTMLElement | null;
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen();
      setFullscreen(true);
    } else {
      document.exitFullscreen();
      setFullscreen(false);
    }
  };

  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 flex flex-col justify-end"
      onMouseMove={resetHideTimer}
      onClick={togglePlay}
      style={{ cursor: visible ? "default" : "none" }}
    >
      {/* Centre play/pause flash */}
      <AnimatePresence>
        {!playing && (
          <motion.div
            key="centre-play"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            transition={{ duration: 0.18 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.12)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls bar */}
      <AnimatePresence>
        {visible && (
          <motion.div
            key="controls"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.18 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              background:
                "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)",
              padding: "32px 16px 14px",
            }}
          >
            {/* Scrubber */}
            <div
              className="relative w-full mb-3 group"
              style={{ height: 16, display: "flex", alignItems: "center" }}
            >
              {/* Track background */}
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  height: 3,
                  borderRadius: 99,
                  background: "rgba(255,255,255,0.15)",
                }}
              />
              {/* Progress fill */}
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  height: 3,
                  borderRadius: 99,
                  background: "rgba(255,255,255,0.9)",
                  width: `${progress}%`,
                  transition: "width 0.1s linear",
                }}
              />
              {/* Thumb dot */}
              <div
                style={{
                  position: "absolute",
                  left: `${progress}%`,
                  transform: "translateX(-50%)",
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  background: "#fff",
                  boxShadow: "0 0 6px rgba(255,255,255,0.6)",
                  transition: "left 0.1s linear",
                  pointerEvents: "none",
                }}
              />
              <input
                type="range"
                min={0}
                max={duration || 100}
                step={0.01}
                value={currentTime}
                onChange={seek}
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  width: "100%",
                  opacity: 0,
                  cursor: "pointer",
                  height: 16,
                  margin: 0,
                }}
              />
            </div>

            {/* Bottom row */}
            <div className="flex items-center justify-between gap-3">
              {/* Left: play + time */}
              <div className="flex items-center gap-3">
                {/* Play/Pause */}
                <button
                  onClick={togglePlay}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    border: "1px solid rgba(255,255,255,0.2)",
                    background: "rgba(255,255,255,0.08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    color: "#fff",
                    flexShrink: 0,
                  }}
                >
                  {playing ? (
                    // Pause icon
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="white"
                    >
                      <rect x="6" y="4" width="4" height="16" rx="1" />
                      <rect x="14" y="4" width="4" height="16" rx="1" />
                    </svg>
                  ) : (
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="white"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  )}
                </button>

                {/* Time */}
                <span
                  style={{
                    fontSize: 11,
                    color: "rgba(255,255,255,0.7)",
                    fontVariantNumeric: "tabular-nums",
                    letterSpacing: "0.04em",
                    whiteSpace: "nowrap",
                  }}
                >
                  {formatTime(currentTime)}{" "}
                  <span style={{ color: "rgba(255,255,255,0.3)" }}>/</span>{" "}
                  {formatTime(duration)}
                </span>
              </div>

              {/* Right: volume + fullscreen */}
              <div className="flex items-center gap-2">
                {/* Volume */}
                <div
                  className="flex items-center gap-2"
                  onMouseEnter={() => setShowVolume(true)}
                  onMouseLeave={() => setShowVolume(false)}
                >
                  <AnimatePresence>
                    {showVolume && (
                      <motion.div
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 64 }}
                        exit={{ opacity: 0, width: 0 }}
                        style={{
                          overflow: "hidden",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <input
                          type="range"
                          min={0}
                          max={1}
                          step={0.01}
                          value={muted ? 0 : volume}
                          onChange={changeVolume}
                          style={{
                            width: 60,
                            accentColor: "rgba(255,255,255,0.9)",
                            cursor: "pointer",
                          }}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <button
                    onClick={toggleMute}
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      border: "1px solid rgba(255,255,255,0.15)",
                      background: "rgba(255,255,255,0.06)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      color: "#fff",
                      flexShrink: 0,
                    }}
                  >
                    {muted || volume === 0 ? (
                      // Muted icon
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                      >
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                        <line x1="23" y1="9" x2="17" y2="15" />
                        <line x1="17" y1="9" x2="23" y2="15" />
                      </svg>
                    ) : (
                      // Volume icon
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                      >
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                        <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                      </svg>
                    )}
                  </button>
                </div>

                {/* Fullscreen */}
                <button
                  onClick={toggleFullscreen}
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    border: "1px solid rgba(255,255,255,0.15)",
                    background: "rgba(255,255,255,0.06)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    flexShrink: 0,
                  }}
                >
                  {fullscreen ? (
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                    >
                      <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
                    </svg>
                  ) : (
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                    >
                      <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Drive iframe wrapper (no custom controls possible) ────────────────────────

function DrivePlayer({ url, title }: { url: string; title: string }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const embedUrl = getDriveEmbedUrl(
    "https://drive.google.com/file/d/1eT8uNfS9SRXk9iq5JCWfRKUtxdqswCWS/preview?autoplay=1   ",
  );

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden bg-black">
      {/* Google Drive label */}
      <div
        style={{
          position: "absolute",
          top: 12,
          left: 12,
          zIndex: 10,
          background: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 99,
          padding: "3px 10px",
          fontSize: 10,
          color: "rgba(255,255,255,0.5)",
          letterSpacing: "0.15em",
          pointerEvents: "none",
        }}
      >
        GOOGLE DRIVE
      </div>

      {/* Loading skeleton */}
      {!loaded && !error && (
        <div className="absolute inset-0 flex items-center justify-center text-white text-sm">
          Loading video...
        </div>
      )}

      {/* Error fallback */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center text-red-400 text-sm text-center p-4">
          Failed to load video.
          <br />
          Make sure file is public.
        </div>
      )}

      {embedUrl && (
        <iframe
          src={embedUrl}
          allow="autoplay; fullscreen"
          allowFullScreen
          className="w-full h-full border-0"
          style={{ border: "none" }}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
        />
      )}
    </div>
  );
}

// ─── VideoPopup ────────────────────────────────────────────────────────────────

export function VideoPopup({
  project,
  onClose,
  onPrev,
  onNext,
}: {
  project: Video;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const ref = useRef<HTMLDivElement>(null);
  const isVertical = project.type === "vertical";
  const isDrive = isDriveUrl(project.videoUrl);

  useOutsideClick(ref, onClose);

  // Try autoplay, fallback to manual controls
  useEffect(() => {
    if (!isDrive) {
      const playPromise = videoRef.current?.play();
      if (playPromise && typeof playPromise.then === "function") {
        playPromise.catch(() => {
          console.warn("Autoplay blocked, user can play manually.");
        });
      }
    }
  }, [project.id, isDrive]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        ref={ref}
        className={`video-popup-container relative w-full flex items-center justify-center ${
          isVertical ? "max-w-[360px] aspect-[9/16]" : "max-w-5xl aspect-video"
        }`}
        initial={{ scale: 0.88, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.88, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Video element always works */}
        {!isDrive ? (
          <video
            ref={videoRef}
            controls
            autoPlay
            className="w-[80%] h-[80%] rounded-xl object-contain bg-black"
          >
            <source src={project.videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          // Only fallback to iframe if it's a Drive URL
          <iframe
            key={project.id}
            src={project.videoUrl}
            className="w-[80%] h-[80%] rounded-xl object-contain"
            allow="autoplay; fullscreen"
            allowFullScreen
          />
        )}
        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            zIndex: 50,
            background: "rgba(255,255,255,0.08)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.12)",
            color: "rgba(255,255,255,0.7)",
            padding: "5px 14px",
            borderRadius: 6,
            fontSize: 11,
            letterSpacing: "0.15em",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
        >
          ✕ CLOSE
        </button>

        {/* Prev */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPrev();
          }}
          style={{
            position: "absolute",
            top: "50%",
            left: 10,
            transform: "translateY(-50%)",
            zIndex: 50,
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "rgba(255,255,255,0.5)",
            fontSize: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
        >
          ‹
        </button>

        {/* Next */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          style={{
            position: "absolute",
            top: "50%",
            right: 10,
            transform: "translateY(-50%)",
            zIndex: 50,
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "rgba(255,255,255,0.5)",
            fontSize: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
        >
          ›
        </button>
      </motion.div>
    </motion.div>
  );
}

// ─── Horizontal Card ───────────────────────────────────────────────────────────
function HorizontalCard({
  project,
  layoutId,
  onClick,
}: {
  project: Video;
  layoutId: string;
  onClick: () => void;
}) {
  return (
    <motion.li
      layoutId={layoutId}
      className="bg-[#13131a] border border-[#1e1e2e] rounded-2xl overflow-hidden cursor-pointer hover:border-[#c8a96e44] transition-colors"
      onClick={onClick}
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      style={{ listStyle: "none" }}
    >
      {/* 16:9 thumbnail */}
      <div className="relative w-full aspect-video overflow-hidden">
        <img
          src={project.imageUrl}
          alt={project.title}
          className="w-full h-full object-cover object-top transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute bottom-2 left-2 flex gap-1.5">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="flex items-center justify-center text-[10px] font-medium uppercase  px-2.5 py-1 rounded-full bg-white/90 text-black"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Card body */}
      <div className="p-4">
        <h3 className="font-semibold text-[#f0ece3] text-sm mb-1 truncate">
          {project.title}
        </h3>
        <p className="text-[#6b6b7b] text-xs line-clamp-2 leading-relaxed">
          {project.description}
        </p>
        <div className="flex items-center justify-between mt-3">
          <span className="text-[#3e3e52] text-[10px]">
            {new Date(project.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
            })}
          </span>
          <span className="text-[#c8a96e88] text-[10px] flex items-center gap-1">
            <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            Watch
          </span>
        </div>
      </div>
    </motion.li>
  );
}

// ─── Vertical Card ─────────────────────────────────────────────────────────────
function VerticalCard({
  project,
  layoutId,
  onClick,
}: {
  project: Video;
  layoutId: string;
  onClick: () => void;
}) {
  return (
    <motion.li
      layoutId={layoutId}
      className="bg-[#13131a] border border-[#1e1e2e] rounded-2xl overflow-hidden cursor-pointer hover:border-[#c8a96e44] transition-colors flex flex-col"
      onClick={onClick}
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      style={{ listStyle: "none" }}
    >
      {/* 9:16 thumbnail */}
      <div className="relative w-full aspect-[9/16] overflow-hidden">
        <img
          src={project.imageUrl}
          alt={project.title}
          className="w-full h-full object-cover object-top transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute bottom-2 left-2 flex gap-1.5 flex-wrap">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="flex items-center justify-center text-[10px] font-medium uppercase  px-2.5 py-1 rounded-full bg-white/90 text-black"
            >
              {tag}
            </span>
          ))}
        </div>
        {/* Play overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/30">
          <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
            <svg className="w-5 h-5 fill-black ml-0.5" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Card body */}
      <div className="p-3 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-semibold text-[#f0ece3] text-sm mb-1 truncate">
            {project.title}
          </h3>
          <p className="text-[#6b6b7b] text-xs line-clamp-2 leading-relaxed">
            {project.description}
          </p>
        </div>
        <span className="text-[#3e3e52] text-[10px] mt-2 block">
          {new Date(project.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
          })}
        </span>
      </div>
    </motion.li>
  );
}

// ─── Section Header ────────────────────────────────────────────────────────────
function SectionHeader({
  title,
  count,
  children,
}: {
  title: string;
  count: number;
  children?: React.ReactNode;
}) {
  return (
    <>
      <div className="flex items-center gap-4 mb-6">
        <h2 className="text-xs tracking-[0.4em] uppercase text-white/60">
          {title}
        </h2>
        <span className="text-xs text-[#c8a96e] font-medium">
          {count} projects
        </span>
      </div>
      {children}
    </>
  );
}

// ─── Thumbnails Section ────────────────────────────────────────────────────────────
function AllThumbnails({
  projects,
  onClick,
}: {
  projects: Video[];
  onClick: (project: Video, index: number, list: Video[]) => void;
}) {
  if (projects.length === 0) return null;

  return (
    <div className="mt-4 border-t border-">
      {" "}
      <SectionHeader title="All Thumbnails" count={projects.length}>
        <ul className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 p-0">
          {projects.map((project, i) => (
            <li
              key={project.id}
              className="cursor-pointer rounded-lg overflow-hidden border border-white/10 hover:border-[#c8a96e44] transition"
              onClick={() => onClick(project, i, projects)}
            >
              <img
                src={project.imageUrl}
                alt={project.title}
                className="w-full h-20 object-cover hover:scale-105 transition-transform duration-200"
              />
            </li>
          ))}
        </ul>
      </SectionHeader>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function PortfolioCards() {
  const [projects, setProjects] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  // Popup state
  const [activeProject, setActiveProject] = useState<Video | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeList, setActiveList] = useState<Video[]>([]);
  const thumbnailItems = projects.map((p) => ({ imgUrl: p.imageUrl }));

  const id = useId();

  // ── Fetch ──
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await fetch("/api/video");
        const json = await res.json();
        if (json.success) setProjects(json.data);
      } catch (err) {
        console.error("Failed to fetch videos:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  // ── Split by type — same logic as ThirdWorkSection ──
  const horizontalProjects = projects.filter((p) => p.type === "horizontal");
  const verticalProjects = projects.filter((p) => p.type === "vertical");
  console.log(horizontalProjects, "horizontalProjects");
  console.log(verticalProjects, "verticalProjects");

  // ── Popup handlers ──
  const openPopup = (project: Video, index: number, list: Video[]) => {
    setActiveProject(project);
    setActiveIndex(index);
    setActiveList(list);
  };

  const handlePopupPrev = () => {
    const newIndex = (activeIndex - 1 + activeList.length) % activeList.length;
    setActiveIndex(newIndex);
    setActiveProject(activeList[newIndex]);
  };

  const handlePopupNext = () => {
    const newIndex = (activeIndex + 1) % activeList.length;
    setActiveIndex(newIndex);
    setActiveProject(activeList[newIndex]);
  };

  useEffect(() => {
    if (activeProject) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [activeProject]);
  console.log(
    "types in DB:",
    projects.map((p) => p.type),
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!activeProject) return;
      if (e.key === "Escape") setActiveProject(null);
      if (e.key === "ArrowLeft") handlePopupPrev();
      if (e.key === "ArrowRight") handlePopupNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeProject, activeIndex, activeList]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32">
        <div className="text-white/40 text-sm tracking-widest animate-pulse">
          LOADING…
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] px-6 md:px-32 py-16">
      <div className="max-w-7xl mx-auto">
        {/* Page title */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-thin tracking-[0.2em] text-white/80 text-center mb-20"
        >
          OUR WORKS
        </motion.h1>

        {/* ── HORIZONTAL SECTION ── */}
        {horizontalProjects.length > 0 && (
          <section className="mb-20">
            <SectionHeader
              title="Horizontal Projects"
              count={horizontalProjects.length}
            />
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-6 p-0">
              {horizontalProjects.map((project, i) => (
                <HorizontalCard
                  key={project.id}
                  project={project}
                  layoutId={`card-${project.id}-${id}`}
                  onClick={() => openPopup(project, i, horizontalProjects)}
                />
              ))}
            </ul>
          </section>
        )}

        {/* ── VERTICAL / REELS SECTION ── */}
        {verticalProjects.length > 0 && (
          <section className="mb-16">
            <div className="border-t border-white/10 pt-16 mb-6">
              <SectionHeader
                title="Reels Projects"
                count={verticalProjects.length}
              />
            </div>
            {/* 
              Vertical cards are narrower — show more columns.
              On mobile: 2 cols. On md: 3. On lg: 4.
            */}
            <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-0">
              {verticalProjects.map((project, i) => (
                <VerticalCard
                  key={project.id}
                  project={project}
                  layoutId={`card-${project.id}-${id}`}
                  onClick={() => openPopup(project, i, verticalProjects)}
                />
              ))}
            </ul>
          </section>
        )}

        {/* ── ALL THUMBNAILS ── */}
        {/* ── HORIZONTAL THUMBNAILS ── */}
        <section>
          <div className="border-t border-white/10 pt-16 mb-6">
            <SectionHeader
              title="Horizontal Thumbnails"
              count={horizontalProjects.length}
            />
          </div>

          <InfiniteMovingCards
            items={horizontalProjects.map((p) => ({
              image: p.imageUrl,
              name: p.title,
              review: p.description,
              rating: 5,
            }))}
            direction="left"
            speed="fast"
            pauseOnHover={true}
            className=""
          />
        </section>

        {/* ── VERTICAL THUMBNAILS ── */}
        <section>
          <InfiniteMovingCards
            items={verticalProjects.map((p) => ({
              image: p.imageUrl,
              name: p.title,
              review: p.description,
              rating: 5,
            }))}
            direction="right"
            speed="fast"
            pauseOnHover={true}
            className=""
          />
        </section>

        {/* Empty state */}
        {projects.length === 0 && (
          <div className="flex justify-center items-center py-32 text-white/30 text-sm tracking-widest">
            NO PROJECTS FOUND
          </div>
        )}
      </div>

      {/* ── POPUP ── */}
      <AnimatePresence>
        {activeProject && (
          <VideoPopup
            project={activeProject}
            onClose={() => setActiveProject(null)}
            onPrev={handlePopupPrev}
            onNext={handlePopupNext}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
