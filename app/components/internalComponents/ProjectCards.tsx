"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import GlassCard from "./GlassCard";

interface ProjectCardProps {
  project: any;
  isVertical?: boolean;
  userInteracted: boolean;
  onClick: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  isVertical = false,
  userInteracted,
  onClick,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hovered, setHovered] = useState(false);

  const handleMouseEnter = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.muted = !userInteracted;
      videoRef.current.play().catch(() => {});
      setHovered(true);
    }
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      setHovered(false);
    }
  };

  return (
    <div>
      <GlassCard
        className={`group cursor-pointer ${
          isVertical ? "p-4" : "p-6"
        } rounded-xl relative overflow-hidden`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
      >
        <div className="flex justify-between items-center mb-4">
          <span className="font-mono text-xs text-white/40">0{project.id}</span>
        </div>

        <div
          className={`w-full ${
            isVertical ? "aspect-[9/16]" : "aspect-video"
          } rounded-lg overflow-hidden relative mb-4 bg-gray-800`}
        >
          <Image
            src={project.image}
            alt={project.title}
            fill={true}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className={`object-cover absolute transition-opacity duration-300 z-10 ${
              hovered ? "opacity-0" : "opacity-100"
            }`}
            onLoad={() => {
              console.log("Image loaded successfully:", project.image);
            }}
            onError={(e) => {
              console.error("Image failed to load:", project.image);
            }}
          />

          <video
            ref={videoRef}
            src={project.video}
            loop
            playsInline
            className={`w-full h-full object-cover absolute transition-opacity duration-300 ${
              hovered ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          />
        </div>

        <h4
          className={`${
            isVertical ? "text-sm text-center" : "text-lg"
          } font-light tracking-wide group-hover:text-cyan-100 transition-colors`}
        >
          {project.title}
        </h4>

        {!isVertical && project.description && (
          <p className="text-white/50 text-sm mt-2">{project.description}</p>
        )}
      </GlassCard>
    </div>
  );
};

export default ProjectCard;
