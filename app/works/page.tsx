"use client";

import PortfolioCards from "@/components/expandable-card-demo-grid";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function WorkPage() {
  const router = useRouter();
  const [screenSize, setScreenSize] = useState<
    "mobile" | "mobileLg" | "tablet" | "desktop"
  >("desktop");

  // Responsive sizing for logo
  const sizeMap = {
    mobile: { container: 48, logo: 30, radius: 12, top: 14, left: 14 },
    mobileLg: { container: 54, logo: 34, radius: 13, top: 16, left: 16 },
    tablet: { container: 60, logo: 38, radius: 14, top: 18, left: 18 },
    desktop: { container: 64, logo: 42, radius: 16, top: 20, left: 22 },
  };

  const s = sizeMap[screenSize];

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

  return (
    <>
      {/* Logo Top Left - Universal Responsive */}
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

      {/* Portfolio Content */}
      <PortfolioCards />
    </>
  );
}
