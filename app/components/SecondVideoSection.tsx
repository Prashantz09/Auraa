"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { TESTIMONIALS } from "../constants";

/* ─────────────────────────────────────────────────────
   STAR
───────────────────────────────────────────────────── */
function Star({ filled }: { filled: boolean }) {
  return (
    <svg
      className={`w-3.5 h-3.5 transition-colors ${
        filled ? "text-blue-400/90" : "text-white/10"
      }`}
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364 1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────
   CARD
───────────────────────────────────────────────────── */
function TestimonialCard({ name, review, image, rating = 5 }: any) {
  const initial = name.trim().charAt(0).toUpperCase();

  return (
    <li className="shrink-0 list-none mx-3 sm:mx-4 md:mx-5 w-[320px] sm:w-[340px] md:w-[360px]">
      <div
        className="
          relative group rounded-[22px] p-7 overflow-hidden
          bg-gradient-to-br from-[#0d0d20] via-[#09091a] to-[#060610]
          border border-white/[0.07]
          hover:border-blue-500/30
          shadow-2xl shadow-black/70
          transition-all duration-500 ease-out
        "
      >
        {/* Hover glow */}
        <div
          className="
          absolute inset-0 opacity-0 group-hover:opacity-100
          transition-opacity duration-700 pointer-events-none
          bg-[radial-gradient(ellipse_at_top_left,rgba(37,99,235,0.12),transparent_60%)]
        "
        />

        {/* Top-right corner aurora */}
        <div
          className="
          absolute -top-8 -right-8 w-36 h-36 rounded-full
          bg-blue-600/[0.08] blur-3xl pointer-events-none
          group-hover:bg-blue-500/[0.13] transition-colors duration-700
        "
        />

        {/* Bottom-left accent */}
        <div
          className="
          absolute -bottom-6 -left-6 w-28 h-28 rounded-full
          bg-indigo-700/[0.06] blur-2xl pointer-events-none
        "
        />

        {/* Decorative quote mark */}
        <span
          aria-hidden="true"
          className="
            absolute top-4 right-6 font-serif leading-none select-none
            text-[90px] text-blue-300/10
            group-hover:text-blue-300/20 transition-colors duration-500
          "
        >
          &ldquo;
        </span>

        {/* Stars */}
        <div className="relative z-10 flex items-center gap-1 mb-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} filled={i < rating} />
          ))}
          <span className="ml-2 text-[10.5px] text-blue-400/40 font-light tracking-wider">
            {rating}.0
          </span>
        </div>

        {/* Review */}
        <p
          className="
          relative z-10
          text-white/65 text-[18px] italic leading-[1.85]
          font-light mb-6 tracking-[0.01em]
        "
        >
          &ldquo;{review}&rdquo;
        </p>

        {/* Separator */}
        <div
          className="
          relative z-10 h-px mb-6
          bg-gradient-to-r from-blue-500/35 via-blue-400/12 to-transparent
        "
        />

        {/* Author */}
        <div className="relative z-10 flex items-center gap-4">
          {/* Avatar */}
          <div className="relative shrink-0">
            {image ? (
              <img
                src={image}
                alt={name}
                className="
                  w-12 h-12 rounded-full object-cover
                  ring-[1.5px] ring-blue-500/40
                  ring-offset-[3px] ring-offset-[#0d0d20]
                  shadow-xl shadow-black/50
                "
              />
            ) : (
              <div
                className="
                w-12 h-12 rounded-full
                flex items-center justify-center
                bg-gradient-to-br from-blue-900/70 to-indigo-900/60
                text-blue-300/70 text-base font-medium
                ring-[1.5px] ring-blue-500/25
                ring-offset-[3px] ring-offset-[#0d0d20]
              "
              >
                {initial}
              </div>
            )}
            {/* Glowing online dot */}
            <span
              className="
              absolute -bottom-0.5 -right-0.5
              w-3 h-3 rounded-full bg-blue-500
              border-2 border-[#0d0d20]
              shadow-[0_0_8px_2px_rgba(59,130,246,0.7)]
            "
            />
          </div>

          {/* Name + label */}
          <div>
            <p className="text-[18px] font-semibold text-white/88 leading-tight tracking-[0.01em]">
              {name}
            </p>
            <p className="text-[11px] text-blue-400/55 tracking-[0.1em] mt-1 font-light">
              ✦ Verified Client
            </p>
          </div>
        </div>
      </div>
    </li>
  );
}

/* ─────────────────────────────────────────────────────
   SECTION
───────────────────────────────────────────────────── */
export default function TestimonialsSection() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const ulRef = useRef<HTMLUListElement>(null);
  const posRef = useRef(0);
  const rafRef = useRef(0);
  const pausedRef = useRef(false);
  const loopRef = useRef(0);

  // CHANGED: Reduced speed from 0.4 to 0.2
  const SPEED = 0.2;

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const ul = ulRef.current;
    if (!wrapper || !ul) return;

    const init = setTimeout(() => {
      loopRef.current = ul.scrollWidth / 2;
    }, 80);

    const tick = () => {
      if (!pausedRef.current && loopRef.current > 0) {
        posRef.current += SPEED;

        if (posRef.current >= loopRef.current) {
          posRef.current -= loopRef.current;
        }

        ul.style.transform = `translateX(-${posRef.current}px)`;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      clearTimeout(init);
    };
  }, []);

  return (
    // CHANGED: Improved responsive padding
    <section className="relative w-full py-8 sm:py-10 md:py-12 lg:py-16 bg-black overflow-hidden">
      {/* ── Ambient background lighting ────────────────── */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/25 to-transparent" />
      <div
        className="
        absolute left-1/2 top-0 -translate-x-1/2
        w-[900px] h-[280px]
        bg-blue-700/[0.05] blur-[100px] rounded-full pointer-events-none
      "
      />
      <div
        className="
        absolute -left-32 top-1/2 -translate-y-1/2
        w-[400px] h-[400px] rounded-full
        bg-indigo-800/[0.06] blur-[90px] pointer-events-none
      "
      />
      <div
        className="
        absolute -right-32 top-1/2 -translate-y-1/2
        w-[400px] h-[400px] rounded-full
        bg-blue-700/[0.06] blur-[90px] pointer-events-none
      "
      />

      {/* ── Header ─────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        // CHANGED: Improved responsive margin bottom
        className="relative z-10 text-center mb-6 sm:mb-8 md:mb-10 px-4"
      >
        <p
          className="
          inline-flex items-center gap-3 mb-3
          text-[10px] tracking-[0.38em] uppercase font-light
          text-blue-400/60
        "
        >
          <span className="w-8 h-px bg-gradient-to-r from-transparent to-blue-500/50" />
          Client Stories
          <span className="w-8 h-px bg-gradient-to-l from-transparent to-blue-500/50" />
        </p>

        <h2
          className="
          text-2xl sm:text-3xl md:text-4xl font-thin
          tracking-[0.22em] text-white/85 leading-tight
        "
        >
          The Auraa Experience
        </h2>

        <p className="text-white/28 text-[12px] font-light mt-3 tracking-[0.06em]">
          Trusted by creators &amp; studios worldwide
        </p>
      </motion.div>

      {/* ── Scrolling strip ────────────────────────────── */}
      <div
        ref={wrapperRef}
        className="
          relative z-10 w-full overflow-hidden
          [mask-image:linear-gradient(to_right,transparent,white_5%,white_95%,transparent)]
        "
        onMouseEnter={() => {
          pausedRef.current = true;
        }}
        onMouseLeave={() => {
          pausedRef.current = false;
        }}
      >
        <ul
          ref={ulRef}
          style={{ width: "max-content" }}
          className="flex flex-nowrap py-3 sm:py-4 will-change-transform"
        >
          {[...TESTIMONIALS, ...TESTIMONIALS].map((item, idx) => (
            <TestimonialCard key={idx} {...item} />
          ))}
        </ul>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
    </section>
  );
}
