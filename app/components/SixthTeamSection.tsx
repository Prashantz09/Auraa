"use client";
import { motion } from "framer-motion";
import { TEAM, TeamMember } from "../constants";
import Section from "./internalComponents/Section";
import Image from "next/image";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";

const SixthTeamSection = () => {
  const renderCard = (
    member: TeamMember,
    index: number,
    keyPrefix = ""
  ) => {
    return (
      <div
        key={`${keyPrefix}${index}`}
        className={`flex flex-col items-center flex-shrink-0 mx-2 lg:mx-4 transition-transform duration-500 ${member.role === "Founder" || member.name === "Prash"
          ? "w-48 sm:w-56 lg:w-[280px] scale-105 z-10"
          : "w-40 sm:w-48 lg:w-64"
          }`}
      >
        <div
          className={`relative overflow-hidden shadow-lg shadow-black/40 bg-neutral-900 ${member.role === "Founder" || member.name === "Prash"
            ? "rounded-3xl w-48 h-[300px] sm:w-56 sm:h-[360px] lg:w-[280px] lg:h-[460px]"
            : "rounded-2xl md:rounded-3xl w-40 h-[260px] sm:w-48 sm:h-[320px] lg:w-64 lg:h-[420px]"
            }`}
        >
          <Image
            src={member.image}
            alt={member.name}
            fill
            unoptimized
            priority
            loading="eager"
            sizes="(max-width: 640px) 160px, (max-width: 768px) 200px, 288px"
            className={`object-cover grayscale contrast-125 ${member.name === "Radha" || member.name === "Samrat"
              ? "scale-x-[-1]"
              : ""
              }`}
          />
          <div className="absolute inset-0 bg-black/30 pointer-events-none" />
        </div>

        <div className="mt-4 mb-2 flex flex-col items-center min-h-[48px]">
          <h3
            className="font-semibold text-center text-white text-sm sm:text-base lg:text-lg truncate"
          >
            {member.name}
          </h3>
          <p className="mt-1.5 text-center text-white/60 text-xs sm:text-sm lg:text-base truncate">
            {member.role}
          </p>
        </div>
      </div>
    );
  };

  return (
    <Section className="relative isolate bg-[#050508] text-white pt-28 md:pt-36 pb-0 overflow-hidden">
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

      <div className="relative w-full mt-14 md:mt-16 lg:mt-20">
        <div className="w-full relative flex items-center justify-center -mx-4 lg:-mx-8">
          <InfiniteMovingCards
            items={TEAM}
            direction="left"
            speed="fast"
            pauseOnHover={false}
            className="py-10"
            renderItem={(member: TeamMember, idx?: number) => renderCard(member, idx ?? 0, "slider-")}
          />
        </div>
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
