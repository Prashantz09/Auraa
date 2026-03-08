"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PROJECTS } from "../constants";
import Section from "./internalComponents/Section";
import ProjectCard from "./internalComponents/ProjectCards";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
  X,
} from "lucide-react";

const ThirdWorkSection = () => {
  const router = useRouter();
  const horizontalProjects = PROJECTS.filter((p) => p.format === "horizontal");
  const verticalProjects = PROJECTS.filter((p) => p.format === "vertical");

  const [activeProject, setActiveProject] = useState<any | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeList, setActiveList] = useState<any[]>([]);
  const [userInteracted, setUserInteracted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [screenSize, setScreenSize] = useState<
    "mobile" | "mobileLg" | "tablet" | "desktop"
  >("desktop");

  const sizeMap = {
    mobile: { container: 48, logo: 36, radius: 12, top: 14, left: 14 },
    mobileLg: { container: 54, logo: 40, radius: 13, top: 16, left: 16 },
    tablet: { container: 60, logo: 44, radius: 14, top: 18, left: 18 },
    desktop: { container: 64, logo: 48, radius: 16, top: 20, left: 22 },
  };

  const s = sizeMap[screenSize];

  const [horizontalIndex, setHorizontalIndex] = useState(0);
  const [horizontalDirection, setHorizontalDirection] = useState(1);
  const [verticalIndex, setVerticalIndex] = useState(0);
  const [verticalDirection, setVerticalDirection] = useState(1);

  const HORIZONTAL_MOBILE = 1;
  const HORIZONTAL_DESKTOP = 2;
  const VERTICAL_MOBILE = 2;
  const VERTICAL_TABLET = 3;
  const VERTICAL_DESKTOP = 4;

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w < 768) {
        setIsMobile(true);
        setScreenSize(w < 480 ? "mobile" : "mobileLg");
      } else if (w < 1024) {
        setIsMobile(false);
        setScreenSize("tablet");
      } else {
        setIsMobile(false);
        setScreenSize("desktop");
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleInteraction = () => setUserInteracted(true);
    window.addEventListener("click", handleInteraction, { once: true });
    window.addEventListener("keydown", handleInteraction, { once: true });
    return () => {
      window.removeEventListener("click", handleInteraction);
      window.removeEventListener("keydown", handleInteraction);
    };
  }, []);

  const horizontalPageSize = isMobile ? HORIZONTAL_MOBILE : HORIZONTAL_DESKTOP;
  const visibleHorizontal = horizontalProjects.slice(
    horizontalIndex,
    horizontalIndex + horizontalPageSize,
  );

  const verticalPageSize = isMobile
    ? VERTICAL_MOBILE
    : screenSize === "tablet"
      ? VERTICAL_TABLET
      : VERTICAL_DESKTOP;
  const visibleVertical = verticalProjects.slice(
    verticalIndex,
    verticalIndex + verticalPageSize,
  );

  const handleNextHorizontal = () => {
    setHorizontalDirection(1);
    const next = horizontalIndex + horizontalPageSize;
    if (next >= horizontalProjects.length) {
      setHorizontalIndex(0);
    } else {
      setHorizontalIndex(next);
    }
  };

  const handlePrevHorizontal = () => {
    setHorizontalDirection(-1);
    const prev = horizontalIndex - horizontalPageSize;
    if (prev < 0) {
      const maxStart = Math.max(
        0,
        horizontalProjects.length - horizontalPageSize,
      );
      setHorizontalIndex(maxStart);
    } else {
      setHorizontalIndex(prev);
    }
  };

  const handleNextVertical = () => {
    setVerticalDirection(1);
    const next = verticalIndex + verticalPageSize;
    if (next >= verticalProjects.length) {
      setVerticalIndex(0);
    } else {
      setVerticalIndex(next);
    }
  };

  const handlePrevVertical = () => {
    setVerticalDirection(-1);
    const prev = verticalIndex - verticalPageSize;
    if (prev < 0) {
      const maxStart = Math.max(0, verticalProjects.length - verticalPageSize);
      setVerticalIndex(maxStart);
    } else {
      setVerticalIndex(prev);
    }
  };

  const handlePopupPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newIndex = (activeIndex - 1 + activeList.length) % activeList.length;
    setActiveIndex(newIndex);
    setActiveProject(activeList[newIndex]);
  };

  const handlePopupNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newIndex = (activeIndex + 1) % activeList.length;
    setActiveIndex(newIndex);
    setActiveProject(activeList[newIndex]);
  };

  const SectionHeader = ({
    title,
    onClick,
  }: {
    title: string;
    onClick: () => void;
  }) => (
    <div className="flex items-end justify-between border-b border-white/5 pb-3 md:pb-4 mb-5 md:mb-8">
      <div className="flex flex-col gap-0.5 md:gap-1">
        <span className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.25em] text-blue-400 font-semibold">
          Selected Works
        </span>
        <h2 className="text-lg sm:text-xl md:text-2xl font-light tracking-wide text-white/90">
          {title}
        </h2>
      </div>
      <button
        onClick={onClick}
        className="group flex items-center gap-1.5 md:gap-2 text-[10px] md:text-xs font-medium uppercase tracking-widest text-white/40 hover:text-white transition-colors"
      >
        View All
        <ArrowRight
          size={isMobile ? 12 : 14}
          className="group-hover:translate-x-1 transition-transform"
        />
      </button>
    </div>
  );

  const NavButtons = ({
    onPrev,
    onNext,
  }: {
    onPrev: () => void;
    onNext: () => void;
  }) => (
    <div className="flex justify-end gap-2 md:gap-3 mt-4 md:mt-6 mb-12 md:mb-16 lg:mb-20">
      <button
        onClick={onPrev}
        className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/10 hover:border-white/30 hover:bg-white/5 flex items-center justify-center text-white/60 hover:text-white transition-all active:scale-95"
      >
        <ArrowLeft size={isMobile ? 16 : 18} />
      </button>
      <button
        onClick={onNext}
        className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/10 hover:border-white/30 hover:bg-white/5 flex items-center justify-center text-white/60 hover:text-white transition-all active:scale-95"
      >
        <ArrowRight size={isMobile ? 16 : 18} />
      </button>
    </div>
  );

  return (
    <Section className="min-h-screen bg-[#02040a] relative overflow-hidden">
      {/* Logo Top Left */}
      <button
        onClick={() => router.push("/")}
        style={{
          position: "fixed",
          top: s.top,
          left: s.left,
          zIndex: 50,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.3s ease",
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 0,
        }}
      >
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: s.container,
            height: s.container,
            borderRadius: `${s.radius}px`,
            background:
              "linear-gradient(145deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.04) 100%)",
            border: "1.5px solid rgba(255, 255, 255, 0.15)",
            boxShadow:
              "0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.10)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            overflow: "hidden",
            transition: "all 0.3s ease",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "50%",
              borderRadius: `${s.radius}px ${s.radius}px 0 0`,
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0) 100%)",
              pointerEvents: "none",
              zIndex: 1,
            }}
          />
          <Image
            src="/review_person_images/New_logo_Svg.svg"
            alt="Logo"
            width={s.logo}
            height={s.logo}
            priority
            style={{
              position: "relative",
              zIndex: 2,
              width: s.logo,
              height: s.logo,
              objectFit: "contain",
              display: "block",
              filter:
                "brightness(0) invert(1) drop-shadow(0 2px 8px rgba(255,255,255,0.18))",
              transition: "all 0.3s ease",
            }}
          />
        </div>
      </button>

      {/* Background Glows */}
      <div className="absolute top-[20%] left-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-indigo-600/5 rounded-full blur-[80px] md:blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-blue-600/5 rounded-full blur-[80px] md:blur-[120px] pointer-events-none" />

      <div className="w-full max-w-7xl py-6 md:py-8 px-4 sm:px-6 md:px-8 relative z-10 mx-auto">
        {/* Main Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 md:mb-12"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extralight tracking-tight text-white mb-2 md:mb-4">
            Our Works
          </h2>
          <p className="text-white/40 max-w-md lg:max-w-lg mx-auto text-xs sm:text-sm md:text-base font-light leading-relaxed px-4">
            A curated selection of our finest visual storytelling, spanning
            cinematic campaigns to viral short-form content.
          </p>
        </motion.div>

        {/* ─── HORIZONTAL SECTION ─────────────────────────────── */}
        <SectionHeader
          title="Cinematic & Horizontal"
          onClick={() => router.push("/works")}
        />

        <div
          className="relative"
          style={{ minHeight: isMobile ? "auto" : "460px" }}
        >
          <motion.div
            key={horizontalIndex}
            initial={{ x: horizontalDirection * 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className={`grid ${
              isMobile
                ? "grid-cols-1 gap-6 max-w-sm mx-auto"
                : "grid-cols-2 gap-8 lg:gap-10"
            }`}
          >
            {visibleHorizontal.map((project, i) => (
              <div key={project.id} className="group">
                <ProjectCard
                  project={project}
                  userInteracted={userInteracted}
                  onClick={() => {
                    setActiveProject(project);
                    setActiveIndex(horizontalIndex + i);
                    setActiveList(horizontalProjects);
                  }}
                />
              </div>
            ))}
          </motion.div>
        </div>

        <NavButtons
          onPrev={handlePrevHorizontal}
          onNext={handleNextHorizontal}
        />

        {/* ─── VERTICAL SECTION ───────────────────────────────── */}
        <SectionHeader
          title="Reels & Short Form"
          onClick={() => router.push("/works")}
        />

        <div className="relative">
          <motion.div
            key={verticalIndex}
            initial={{ x: verticalDirection * 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className={`grid ${
              isMobile
                ? "grid-cols-2 gap-3 max-w-sm mx-auto"
                : screenSize === "tablet"
                  ? "grid-cols-3 gap-4 max-w-2xl mx-auto"
                  : "grid-cols-4 gap-5 max-w-4xl mx-auto"
            }`}
          >
            {visibleVertical.map((project, i) => (
              <ProjectCard
                key={project.id}
                project={project}
                isVertical
                userInteracted={userInteracted}
                onClick={() => {
                  setActiveProject(project);
                  setActiveIndex(verticalIndex + i);
                  setActiveList(verticalProjects);
                }}
              />
            ))}
          </motion.div>
        </div>

        <NavButtons onPrev={handlePrevVertical} onNext={handleNextVertical} />
      </div>

      {/* ─── POPUP MODAL ──────────────────────────────────────── */}
      <AnimatePresence>
        {activeProject && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md px-3 md:px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveProject(null)}
          >
            <motion.div
              className={`relative shadow-2xl overflow-hidden rounded-xl md:rounded-2xl bg-[#050505] border border-white/10 flex flex-col justify-center ${
                activeProject.format === "vertical"
                  ? "h-[80vh] md:h-[85vh] w-auto aspect-[9/16]"
                  : "w-full max-w-5xl lg:max-w-6xl aspect-video"
              }`}
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              <video
                key={activeProject.id}
                src={activeProject.video}
                autoPlay
                controls
                playsInline
                muted
                className="w-full h-full object-contain bg-black"
                style={{ maxHeight: "100%", maxWidth: "100%" }}
              />

              <button
                onClick={() => setActiveProject(null)}
                className="absolute top-2 right-2 md:top-4 md:right-4 z-50 p-1.5 md:p-2 rounded-full bg-black/60 hover:bg-white/20 text-white/80 hover:text-white backdrop-blur-md transition-all border border-white/5"
              >
                <X size={isMobile ? 16 : 20} />
              </button>

              <button
                onClick={handlePopupPrev}
                className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-50 p-2 md:p-3 rounded-full bg-black/20 hover:bg-white/10 text-white/50 hover:text-white backdrop-blur-sm transition-all border border-transparent hover:border-white/10"
              >
                <ChevronLeft size={isMobile ? 20 : 24} />
              </button>

              <button
                onClick={handlePopupNext}
                className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-50 p-2 md:p-3 rounded-full bg-black/20 hover:bg-white/10 text-white/50 hover:text-white backdrop-blur-sm transition-all border border-transparent hover:border-white/10"
              >
                <ChevronRight size={isMobile ? 20 : 24} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Section>
  );
};

export default ThirdWorkSection;
