"use client";

import Section from "./internalComponents/Section";

import { TEAM, TeamMember } from "../constants";

import { motion } from "framer-motion";

import Image from "next/image";

import { useRef, useEffect, useState } from "react";

const SixthTeamSection = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();

    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;

    if (!el) return;

    let animId: number;

    let lastTime = performance.now();

    const initPosition = () => {
      if (isMobile) {
        el.scrollLeft = el.scrollWidth / 2;
      }
    };

    const timeout = setTimeout(initPosition, 300);

    const step = (time: number) => {
      const delta = time - lastTime;

      lastTime = time;

      if (isMobile) {
        const speed = 0.03; // Increased speed for better visibility

        el.scrollLeft -= delta * speed;

        const half = el.scrollWidth / 2;

        if (el.scrollLeft <= 0) {
          el.scrollLeft = half;
        } else if (el.scrollLeft >= half) {
          el.scrollLeft = 0;
        }
      }

      animId = requestAnimationFrame(step);
    };

    animId = requestAnimationFrame(step);

    return () => {
      clearTimeout(timeout);

      cancelAnimationFrame(animId);
    };
  }, []);

  const renderCard = (
    member: TeamMember,

    index: number,

    keyPrefix = "",

    isDuplicate = false,
  ) => {
    const isCenter = index === 2;

    const isFlipped = index > 2;

    return (
      <motion.div
        key={`${keyPrefix}${index}`}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 1,

          ease: [0.22, 1, 0.36, 1],

          delay: index * 0.08,
        }}
        className={`flex flex-col items-center flex-shrink-0 ${isCenter ? "lg:scale-105 lg:z-20" : "lg:scale-95 lg:z-10"} ${isDuplicate ? "lg:hidden" : ""}`}
      >
        <div
          className={`relative overflow-hidden rounded-2xl md:rounded-3xl shadow-lg shadow-black/40 bg-neutral-900 ${isCenter ? "w-40 h-[260px] sm:w-44 sm:h-[300px] md:w-56 md:h-[380px] lg:w-72 lg:h-[480px]" : "w-32 h-[220px] sm:w-36 sm:h-[260px] md:w-48 md:h-[340px] lg:w-60 lg:h-[420px]"}`}
        >
          <Image
            src={member.image}
            alt={member.name}
            fill
            unoptimized
            priority={isCenter}
            loading={isCenter ? "eager" : "lazy"}
            sizes="(max-width: 640px) 160px,

                   (max-width: 768px) 200px,

                   (max-width: 1024px) 240px,

                   288px"
            className={`object-cover grayscale contrast-125 ${isFlipped ? "scale-x-[-1]" : ""}`}
          />

          <div className="absolute inset-0 bg-black/30 pointer-events-none" />
        </div>

        <div className="mt-4 mb-2 flex flex-col items-center min-h-[48px]">
          <h3
            className={`font-semibold text-center text-white truncate ${isCenter ? "text-sm sm:text-base md:text-lg lg:text-xl" : "text-xs sm:text-sm md:text-base"}`}
          >
            {member.name}
          </h3>

          <p className="mt-1.5 text-center text-white/60 text-xs sm:text-sm truncate">
            {member.role}
          </p>
        </div>
      </motion.div>
    );
  };

  return (
    // FIX 1: Added isolate + increased top padding so nothing bleeds in from above

    <Section className="relative isolate bg-[#050508] text-white pt-28 md:pt-36 pb-0 overflow-hidden">
      {/* FIX 2: Explicit z-10 so the title/subtitle always sits above the card row */}

      <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col items-center px-6">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-center"
        >
          OUR CREW
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="text-white/50 text-xs sm:text-sm md:text-base mt-4 text-center max-w-xl"
        >
          The creative force behind Auraa. Filmmakers, editors and strategists
          building cinematic digital experiences.
        </motion.p>
      </div>

      {/* FIX 3: Removed mb-16 from header — spacing is now controlled by mt-14

          here on the row itself, cleanly separating header from cards */}

      <div
        ref={scrollRef}
        className={`relative z-0 w-full flex items-end gap-6 md:gap-8 lg:gap-10 px-6 pb-6 mt-14 md:mt-16 lg:mt-20 ${isMobile ? "overflow-x-auto" : "overflow-x-visible"} lg:overflow-visible lg:justify-center lg:max-w-6xl lg:mx-auto scrollbar-hide`}
      >
        {TEAM.map((member, index) => renderCard(member, index, "a-", false))}

        {TEAM.map((member, index) => renderCard(member, index, "b-", true))}
      </div>

      <footer className="w-full border-t border-white/10 mt-20 md:mt-24 pt-14 md:pt-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:justify-between gap-12 md:gap-16">
            <div className="max-w-xs">
              <h4 className="text-white font-semibold mb-4 tracking-widest text-xs uppercase">
                Auraa
              </h4>

              <p className="text-white/50 text-sm leading-relaxed">
                A cinematic video editing and digital production agency crafting
                immersive brand experiences worldwide.
              </p>
            </div>

            <div className="flex gap-16 sm:gap-20 md:gap-24">
              <div>
                <h4 className="text-white font-semibold mb-4 tracking-widest text-xs uppercase">
                  Contact
                </h4>

                <ul className="space-y-3 text-sm text-white/50">
                  <li>hub4digital.ads@gmail.com</li>

                  <li>+977 9745911955</li>

                  <li>Bhairahawa, Nepal</li>
                </ul>
              </div>

              <div>
                <h4 className="text-white font-semibold mb-4 tracking-widest text-xs uppercase">
                  Follow Us
                </h4>

                <ul className="space-y-3 text-sm text-white/50">
                  <li>Instagram</li>

                  <li>YouTube</li>

                  <li>LinkedIn</li>

                  <li>Facebook</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 mt-12 md:mt-14 pt-6 pb-6">
            <p className="text-center text-xs text-white/30 tracking-widest">
              © 2024 AURAA AGENCY. ALL RIGHTS RESERVED.
            </p>
          </div>
        </div>
      </footer>
    </Section>
  );
};

export default SixthTeamSection;
