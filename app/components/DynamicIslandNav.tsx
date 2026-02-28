"use client";

import { useState } from "react";
import { motion } from "motion/react";
import Link from "next/link";

const NAV_LINKS = [
  { name: "Home", href: "#home" },
  { name: "Pricing", href: "#pricing" },
  { name: "About Us", href: "#about" },
];

const GMAIL_COMPOSE_URL =
  "https://mail.google.com/mail/u/0/#inbox?compose=GTvVlcRzCMjsbRzXJXcjrRNgtzqZLZkSrldHvFPskFMvQdjDJdsFWCkWBgtDmstWxSPvlRXHRMGbh";

export const DynamicIslandNav = ({
  isBookingModalOpen,
  setIsBookingModalOpen,
}: {
  isBookingModalOpen: boolean;
  setIsBookingModalOpen: (open: boolean) => void;
}) => {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
      className="hidden lg:flex"
      style={{
        position: "fixed",
        top: 24,
        left: "38%",
        transform: "translateX(-50%)",
        zIndex: 50,
        padding: "6px",
        borderRadius: 999,
        background: "rgba(20, 20, 20, 0.65)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        boxShadow:
          "0 8px 32px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.03) inset",
        alignItems: "center",
        gap: "2px",
        whiteSpace: "nowrap",
      }}
    >
      {NAV_LINKS.map((link) => (
        <Link
          key={link.name}
          href={link.href}
          style={{
            textDecoration: "none",
            color:
              hovered === link.name
                ? "rgba(255,255,255,1)"
                : "rgba(255,255,255,0.55)",
            fontSize: "13.5px",
            fontWeight: 500,
            padding: "8px 18px",
            borderRadius: 99,
            transition: "all 0.25s ease",
            background:
              hovered === link.name ? "rgba(255,255,255,0.07)" : "transparent",
            letterSpacing: "0.01em",
          }}
          onMouseEnter={() => setHovered(link.name)}
          onMouseLeave={() => setHovered(null)}
        >
          {link.name}
        </Link>
      ))}

      {/* Divider */}
      <div
        style={{
          width: 1,
          height: 18,
          background: "rgba(255,255,255,0.08)",
          margin: "0 4px",
          borderRadius: 1,
        }}
      />

      {/* Get Started → opens booking modal */}
      <motion.button
        onClick={() => setIsBookingModalOpen(true)}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "7px",
          background:
            "linear-gradient(135deg, #1a3a8f 0%, #1e4fd8 60%, #2563eb 100%)",
          color: "#fff",
          border: "none",
          padding: "8px 18px",
          borderRadius: 99,
          fontSize: "13.5px",
          fontWeight: 600,
          cursor: "pointer",
          letterSpacing: "0.01em",
          boxShadow:
            "0 2px 12px rgba(37,99,235,0.45), 0 0 0 1px rgba(255,255,255,0.08) inset",
          transition: "box-shadow 0.25s ease",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.boxShadow =
            "0 4px 20px rgba(37,99,235,0.65), 0 0 0 1px rgba(255,255,255,0.12) inset";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.boxShadow =
            "0 2px 12px rgba(37,99,235,0.45), 0 0 0 1px rgba(255,255,255,0.08) inset";
        }}
      >
        {/* Mail icon */}
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.2}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ opacity: 0.9 }}
        >
          <rect width="20" height="16" x="2" y="4" rx="3" />
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
        Get Started
      </motion.button>
    </motion.nav>
  );
};
