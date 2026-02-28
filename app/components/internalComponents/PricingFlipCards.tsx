import React, { useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Crown, Shield, Circle } from "lucide-react";
import { SERVICES } from "@/app/constants";

interface Service {
  title: string;
  subtitle: string;
  description: string;
  price: string;
  period: string;
  accent: string;
  icon: React.ReactNode | (() => React.ReactNode) | React.ComponentType<any>;
  features: string[];
  featured?: boolean;
}

const easeOut = [0.16, 1, 0.3, 1] as const;

function PricingCard({
  service,
  index,
}: {
  service: Service;
  index: number;
}): React.ReactElement {
  const [isFlipped, setIsFlipped] = useState(false);

  const getCardColors = (cardIndex: number) => {
    switch (cardIndex) {
      case 0:
        return {
          primary: "rgba(205, 127, 50, 0.15)",
          secondary: "rgba(139, 69, 19, 0.08)",
          border: "rgba(205, 127, 50, 0.3)",
          accent: "rgba(205, 127, 50, 0.9)",
          glow: "rgba(205, 127, 50, 0.2)",
        };
      case 1:
        return {
          primary: "rgba(255, 215, 0, 0.18)",
          secondary: "rgba(184, 134, 11, 0.1)",
          border: "rgba(255, 215, 0, 0.4)",
          accent: "rgba(255, 215, 0, 0.95)",
          glow: "rgba(255, 215, 0, 0.25)",
        };
      case 2:
        return {
          primary: "rgba(192, 192, 192, 0.12)",
          secondary: "rgba(128, 128, 128, 0.06)",
          border: "rgba(192, 192, 192, 0.25)",
          accent: "rgba(192, 192, 192, 0.85)",
          glow: "rgba(192, 192, 192, 0.15)",
        };
      default:
        return {
          primary: "rgba(255, 255, 255, 0.1)",
          secondary: "rgba(255, 255, 255, 0.05)",
          border: "rgba(255, 255, 255, 0.2)",
          accent: "rgba(255, 255, 255, 0.8)",
          glow: "rgba(255, 255, 255, 0.1)",
        };
    }
  };

  const cardColors = getCardColors(index);

  const renderIcon = (): React.ReactNode => {
    if (index === 0)
      return <Circle size={28} style={{ color: cardColors.accent }} />;
    if (index === 1)
      return <Crown size={28} style={{ color: cardColors.accent }} />;
    if (index === 2)
      return <Shield size={28} style={{ color: cardColors.accent }} />;

    const icon = service.icon;
    if (typeof icon === "function") {
      try {
        const result = (icon as any)();
        if (React.isValidElement(result)) return result;
      } catch {
        const IconComponent = icon as React.ComponentType<any>;
        return <IconComponent size={28} style={{ color: service.accent }} />;
      }
    }
    if (React.isValidElement(icon)) return icon;
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: index * 0.15, ease: easeOut }}
      className="relative"
      style={{ perspective: "1200px" }}
    >
      {service.featured && (
        <div
          className="absolute inset-0 rounded-2xl blur-3xl opacity-20 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at center, ${service.accent}, transparent 70%)`,
            transform: "scale(1.1)",
          }}
        />
      )}

      {/* ✅ KEY FIX: explicit pixel height so absolute children have a parent to fill */}
      <div
        className="relative w-full cursor-pointer"
        style={{ height: "580px" }}
        onClick={() => setIsFlipped((f) => !f)}
      >
        {/* FRONT */}
        <motion.div
          className="absolute inset-0 rounded-2xl overflow-hidden w-full"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, ease: easeOut }}
          style={
            {
              background: "rgba(10, 10, 15, 0.9)",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transformStyle: "preserve-3d",
            } as React.CSSProperties
          }
        >
          <div
            className="absolute inset-0 opacity-30 pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.15'/%3E%3C/svg%3E")`,
            }}
          />

          <div
            className="absolute top-0 left-0 right-0 h-[1px]"
            style={{
              background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)`,
              opacity: service.featured ? 1 : 0.4,
            }}
          />

          <div className="relative h-full flex flex-col items-center justify-center pt-2 pb-4 text-center gap-6">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              {renderIcon()}
            </div>

            <div className="flex flex-col mt-8">
              <p
                className="text-xs tracking-[0.35em] font-medium mb-1"
                style={{ color: "rgba(255,255,255,0.6)" }}
              >
                PLAN
                {service.featured && (
                  <span className="ml-2 text-white/80 font-semibold">
                    · MOST POPULAR
                  </span>
                )}
              </p>
              <h3
                className="font-semibold tracking-wide"
                style={{
                  fontSize: "clamp(1.5rem, 3vw, 2rem)",
                  color: cardColors.accent,
                }}
              >
                {service.title}
              </h3>
            </div>

            <div className="flex items-baseline gap-1">
              <span className="font-semibold" style={{ fontSize: "2.5rem" }}>
                {service.price}
              </span>
              <span className="text-white/60 text-sm font-medium">
                {service.period}
              </span>
            </div>

            <p className="text-white/70 text-sm leading-relaxed max-w-[320px] font-light">
              {service.description}
            </p>

            <div className="absolute bottom-8 left-0 right-0 flex items-center justify-center gap-2 text-white/30 text-xs tracking-widest">
              <span className="w-16 h-[1px] bg-white/20" />
              <span className="font-medium">CLICK TO SEE FEATURES</span>
              <span className="w-16 h-[1px] bg-white/20" />
            </div>
          </div>
        </motion.div>

        {/* BACK */}
        <motion.div
          className="absolute inset-0 rounded-2xl overflow-hidden"
          animate={{ rotateY: isFlipped ? 0 : -180 }}
          transition={{ duration: 0.6, ease: easeOut }}
          style={
            {
              background: `linear-gradient(135deg, ${cardColors.primary}, ${cardColors.secondary})`,
              border: `1px solid ${cardColors.border}`,
              boxShadow: `0 0 30px ${cardColors.glow}, inset 0 1px 0 ${cardColors.border}`,
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transformStyle: "preserve-3d",
            } as React.CSSProperties
          }
        >
          <div
            className="absolute top-0 left-0 right-0 h-[1px]"
            style={{
              background: `linear-gradient(90deg, transparent, ${cardColors.border}, transparent)`,
            }}
          />

          <div className="relative h-full flex flex-col p-7 gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h4
                  className="font-black tracking-wider text-xl"
                  style={{ color: cardColors.accent }}
                >
                  {service.title}
                </h4>
                <p className="text-white/30 text-xs tracking-widest">
                  {service.price}/mo
                </p>
              </div>
              <button
                className="text-xs tracking-widest text-white/25 hover:text-white/50 transition-colors border border-white/10 hover:border-white/20 px-3 py-1 rounded-full"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFlipped(false);
                }}
              >
                ← BACK
              </button>
            </div>

            <div
              className="w-full h-[1px]"
              style={{
                background: `linear-gradient(90deg, ${cardColors.border}, transparent)`,
              }}
            />

            <ul className="flex-1 space-y-2.5 overflow-y-auto pr-1 custom-scroll">
              {service.features.map((feature, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{
                    opacity: isFlipped ? 1 : 0,
                    x: isFlipped ? 0 : -8,
                  }}
                  transition={{ delay: isFlipped ? i * 0.05 + 0.3 : 0 }}
                  className="flex items-start gap-3 text-md text-white/65"
                >
                  <div
                    className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: cardColors.primary }}
                  >
                    <Check size={10} style={{ color: cardColors.accent }} />
                  </div>
                  {feature}
                </motion.li>
              ))}
            </ul>

            <button
              className="w-full py-3 rounded-xl text-sm font-semibold tracking-widest transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: cardColors.primary,
                color: cardColors.accent,
                border: `1px solid ${cardColors.border}`,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              GET STARTED
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function PricingFlipCards(): React.ReactElement {
  const orderedServices = [SERVICES[0], SERVICES[1], SERVICES[2]];

  return (
    // ✅ KEY FIX: No h-[80vh], no overflow-hidden on mobile.
    // min-h-[80vh] only applies from lg up so desktop keeps its look.
    // overflow-hidden only on lg+ to clip ambient glows, not cards.
    <section
      className="relative flex flex-col items-center justify-center lg:min-h-[80vh] lg:overflow-hidden py-16 px-4"
      style={{ background: "#050508" }}
    >
      {/* Ambient glows — safely clipped only on desktop */}
      <div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(249,168,212,0.04), transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(165,180,252,0.04), transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: easeOut }}
        className="text-center mb-10 md:mb-16 relative z-10 flex flex-col items-center gap-4 md:gap-6"
      >
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-3xl md:text-4xl font-thin tracking-[0.2em] text-center text-white/80"
        >
          VIDEO EDITING PLANS
        </motion.h2>
        <p className="text-white/65 text-sm md:text-md max-w-md mx-auto">
          Click any card to reveal what's included
        </p>
      </motion.div>

      {/* Cards grid
          mobile:  1 column, cards stack naturally — each is 580px tall, full visible
          tablet:  still 1 col to avoid squishing
          desktop: 3 columns side by side
      */}
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10 px-0 md:px-6">
        {orderedServices.map((service, index) => (
          <PricingCard key={service.title} service={service} index={index} />
        ))}
      </div>

      <style>{`
        .custom-scroll::-webkit-scrollbar { width: 3px; }
        .custom-scroll::-webkit-scrollbar-track { background: transparent; }
        .custom-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
      `}</style>
    </section>
  );
}
