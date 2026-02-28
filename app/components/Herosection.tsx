"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import Section from "./internalComponents/Section";
import { ArrowDown, Volume2, VolumeX } from "lucide-react";
import AuroraVeil from "./AuroraVeil";
import DarkVeil from "./AuroraVeil";
import CinematicHero from "./NewHero";
import BookingModal from "./internalComponents/BookingModal";

const Herosection = ({
  isBookingModalOpen,
  setIsBookingModalOpen,
}: {
  isBookingModalOpen: boolean;
  setIsBookingModalOpen: (open: boolean) => void;
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true); // start muted for autoplay

  const toggleSound = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);

      // Optional: play again if browser requires interaction
      videoRef.current.play().catch(() => {});
    }
  };

  // Ensure video plays on mount
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          console.log("Autoplay blocked — user interaction required for sound");
        });
      }
    }
  }, [isMuted]);

  return (
    <div style={{ width: "100%", height: "100vh", position: "relative" }}>
      <CinematicHero
        isBookingModalOpen={isBookingModalOpen}
        setIsBookingModalOpen={setIsBookingModalOpen}
      />
      <BookingModal
        open={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
      />
    </div>
  );
};

export default Herosection;
