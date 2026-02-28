"use client";

import React, { useState, useEffect } from "react";
import { Loader } from "./components/internalComponents/Loader";
import SecondVideoSection from "./components/SecondVideoSection";
import Herosection from "./components/Herosection";
import ThirdWorkSection from "./components/ThirdWorkSection";
import FourthServiceSection from "./components/FourthServiceSection";
import FifthAiImageSection from "./components/FifthAiImageSection";
import SixthTeamSection from "./components/SixthTeamSection";
import DockWrapper from "./components/DockWrapper";
import Image from "next/image";
import { useRouter } from "next/navigation";

function App() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [screenSize, setScreenSize] = useState<
    "mobile" | "mobileLg" | "tablet" | "desktop"
  >("desktop");
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  useEffect(() => {
    const updateSize = () => {
      const w = window.innerWidth;
      if (w < 480) setScreenSize("mobile");
      else if (w < 768) setScreenSize("mobileLg");
      else if (w < 1024) setScreenSize("tablet");
      else setScreenSize("desktop");
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const sizeMap = {
    mobile: { container: 48, logo: 30, radius: 12, top: 14, left: 14 },
    mobileLg: { container: 54, logo: 34, radius: 13, top: 16, left: 16 },
    tablet: { container: 60, logo: 38, radius: 14, top: 18, left: 18 },
    desktop: { container: 64, logo: 42, radius: 16, top: 20, left: 22 },
  };

  const s = sizeMap[screenSize];

  return (
    <div className="w-full bg-black text-white relative overflow-x-hidden">
      {loading && <Loader onComplete={() => setLoading(false)} />}
      <DockWrapper
        isBookingModalOpen={isBookingModalOpen}
        setIsBookingModalOpen={setIsBookingModalOpen}
      />

      {/* Logo Top Left - Universal Responsive */}
      <button
        onClick={() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
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
          {/* Top shine streak */}
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

      <div
        className={`w-full transition-opacity duration-1000 ${
          loading ? "opacity-0" : "opacity-100"
        }`}
      >
        <Herosection
          isBookingModalOpen={isBookingModalOpen}
          setIsBookingModalOpen={setIsBookingModalOpen}
        />
        <ThirdWorkSection />
        <SecondVideoSection />
        <FourthServiceSection />
        <FifthAiImageSection />
        <SixthTeamSection />
      </div>

      {!loading && (
        <div className="fixed bottom-8 right-8 z-50 mix-blend-difference">
          <div
            className="w-2 h-2 bg-white rounded-full animate-pulse"
            title="Audio Systems Active"
          />
        </div>
      )}
    </div>
  );
}

export default App;
