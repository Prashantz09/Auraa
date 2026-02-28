"use client";

import { FloatingDock } from "@/components/ui/floating-dock";
import { DynamicIslandNav } from "./DynamicIslandNav";
import { Home, BookOpen, Briefcase, Mail } from "lucide-react";
import { useEffect, useState } from "react";

const navItems = [
  { title: "Home", href: "/", icon: <Home className="w-full h-full" /> },
  {
    title: "Works",
    href: "/works",
    icon: <BookOpen className="w-full h-full" />,
  },
  {
    title: "Services",
    href: "/services",
    icon: <Briefcase className="w-full h-full" />,
  },
  {
    title: "Contact",
    href: "/contact",
    icon: <Mail className="w-full h-full" />,
  },
];

export default function DockWrapper({
  isBookingModalOpen,
  setIsBookingModalOpen,
}: {
  isBookingModalOpen: boolean;
  setIsBookingModalOpen: (open: boolean) => void;
}) {
  const [onFirstSection, setOnFirstSection] = useState(true);

  useEffect(() => {
    const onScroll = () =>
      setOnFirstSection(window.scrollY < window.innerHeight * 0.85);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/*
        FloatingDock behaviour:
          lg+ (desktop)  → visible only on first section, hides after
          <lg (mobile/tablet) → always visible bottom-right (FloatingDock handles this internally)

        DynamicIslandNav behaviour:
          lg+ (desktop)  → visible only from second section onwards
          <lg (mobile/tablet) → always hidden (hidden lg:flex inside DynamicIslandNav)
      */}

      {/* desktopHidden=true hides the lg desktop dock after first section.
          The mobile dock inside FloatingDock is NOT affected by desktopHidden. */}
      <FloatingDock
        side="left"
        items={navItems}
        desktopHidden={!onFirstSection}
      />

      {/* Island nav: only renders in DOM when past first section,
          but its own className="hidden lg:flex" ensures it never shows on mobile */}
      {!onFirstSection && (
        <DynamicIslandNav
          isBookingModalOpen={isBookingModalOpen}
          setIsBookingModalOpen={setIsBookingModalOpen}
        />
      )}
    </>
  );
}
