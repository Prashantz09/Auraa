"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

interface WarpStar {
  id: number;
  angle: number;
  startR: number;
  speed: number;
  size: number;
  opacity: number;
  depth: number;
  hue: number;
}

const STAR_COUNT = 320;
const PHASE_DURATIONS = {
  fadeIn: 500,
  calm: 300,
  warpStart: 150,
  warp: 1500,
  arrival: 600,
  logoHold: 1800,
  exit: 900,
};

type Phase = "idle" | "calm" | "warping" | "arrival" | "logo" | "exit";

export function Loader({ onComplete }: { onComplete?: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const phaseRef = useRef<Phase>("idle");
  const warpSpeedRef = useRef(0);
  const mountedRef = useRef(false);
  const starsRef = useRef<WarpStar[]>([]);
  const prevOverflow = useRef("");
  const timerRefs = useRef<ReturnType<typeof setTimeout>[]>([]);

  const [phase, setPhase] = useState<Phase>("idle");
  const [loaderVisible, setVisible] = useState(true);

  const logoOpacity = useMotionValue(0);
  const logoBlur = useMotionValue(16);
  const logoScale = useMotionValue(0.92);

  // ── Build stars ──────────────────────────────────────────────
  const buildStars = useCallback(() => {
    starsRef.current = Array.from({ length: STAR_COUNT }, (_, i) => ({
      id: i,
      angle: Math.random() * Math.PI * 2,
      startR: Math.random() * 0.42 + 0.04,
      speed: Math.random() * 0.6 + 0.4,
      size: Math.random() * 1.5 + 0.3,
      opacity: Math.random() * 0.65 + 0.2,
      depth: Math.random(),
      hue: Math.random() * 40 - 20,
    }));
  }, []);

  // ── Canvas render loop ───────────────────────────────────────
  const renderFrame = useCallback((ts: number) => {
    const canvas = canvasRef.current;
    if (!canvas || !mountedRef.current) return;

    const ctx = canvas.getContext("2d")!;
    const W = canvas.width;
    const H = canvas.height;
    const cx = W / 2;
    const cy = H / 2;
    const diag = Math.sqrt(cx * cx + cy * cy);

    const raw = lastTimeRef.current ? (ts - lastTimeRef.current) / 16.67 : 1;
    const dt = Math.min(raw, 3);
    lastTimeRef.current = ts;

    const p = phaseRef.current;

    if (p === "warping") {
      warpSpeedRef.current = Math.min(warpSpeedRef.current + 0.03 * dt, 1);
    } else if (p === "arrival") {
      warpSpeedRef.current = Math.max(warpSpeedRef.current - 0.07 * dt, 0);
    } else if (p === "calm" || p === "logo" || p === "exit") {
      warpSpeedRef.current = Math.max(warpSpeedRef.current - 0.045 * dt, 0);
    }

    const ws = warpSpeedRef.current;
    const eased = ws * ws * (3 - 2 * ws);

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#020208";
    ctx.fillRect(0, 0, W, H);

    if (eased > 0.1) {
      const gr = ctx.createRadialGradient(cx, cy, 0, cx, cy, diag * 0.5);
      gr.addColorStop(0, `rgba(10, 5, 40, ${eased * 0.15})`);
      gr.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = gr;
      ctx.fillRect(0, 0, W, H);
    }

    ctx.save();
    ctx.globalCompositeOperation = "screen";

    for (const star of starsRef.current) {
      const baseSpeed = 0.0005 + star.depth * 0.001;
      const warpBoost = eased * (0.08 + star.depth * 0.2);
      star.startR += (baseSpeed + warpBoost) * dt;

      if (star.startR > 1.08) {
        star.startR = 0.01 + Math.random() * 0.05;
        star.angle = Math.random() * Math.PI * 2;
        star.speed = Math.random() * 0.6 + 0.4;
        star.depth = Math.random();
        star.opacity = Math.random() * 0.65 + 0.2;
        star.size = Math.random() * 1.5 + 0.3;
        star.hue = Math.random() * 40 - 20;
      }

      const r = star.startR * diag;
      const x = cx + Math.cos(star.angle) * r;
      const y = cy + Math.sin(star.angle) * r;
      const streak = eased * (10 + star.depth * 85) * star.speed;
      const tailX = cx + Math.cos(star.angle) * (r - streak - 2);
      const tailY = cy + Math.sin(star.angle) * (r - streak - 2);
      const dotR =
        star.size * (0.45 + star.startR * 0.9 + eased * star.depth * 2.4);
      const alpha =
        star.opacity * (0.25 + star.startR * 0.85) * (1 - eased * 0.12);
      const light = 82 + star.depth * 18 + eased * 10;
      const sat = 12 + star.hue * eased;

      if (streak > 1 && eased > 0.04) {
        const grad = ctx.createLinearGradient(tailX, tailY, x, y);
        grad.addColorStop(0, "rgba(255,255,255,0)");
        grad.addColorStop(1, `rgba(255,255,255,${Math.min(alpha, 0.95)})`);
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(x, y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = dotR * 0.85;
        ctx.lineCap = "round";
        ctx.stroke();
      } else {
        const dg = ctx.createRadialGradient(x, y, 0, x, y, dotR + 1.5);
        dg.addColorStop(
          0,
          `hsla(${210 + star.hue}, ${sat}%, ${light}%, ${alpha})`,
        );
        dg.addColorStop(0.5, `rgba(200,215,255,${alpha * 0.35})`);
        dg.addColorStop(1, "rgba(0,0,0,0)");
        ctx.beginPath();
        ctx.arc(x, y, dotR + 1.5, 0, Math.PI * 2);
        ctx.fillStyle = dg;
        ctx.fill();
      }
    }

    ctx.restore();

    if (eased > 0.04) {
      const tA = eased * 0.65;
      const tunnel = ctx.createRadialGradient(
        cx,
        cy,
        diag * 0.06,
        cx,
        cy,
        diag,
      );
      tunnel.addColorStop(0, "rgba(0,0,0,0)");
      tunnel.addColorStop(0.5, `rgba(0,0,6,${tA * 0.28})`);
      tunnel.addColorStop(1, `rgba(0,0,10,${tA})`);
      ctx.fillStyle = tunnel;
      ctx.fillRect(0, 0, W, H);
    }

    animFrameRef.current = requestAnimationFrame(renderFrame);
  }, []);

  // ── Phase sequencer ──────────────────────────────────────────
  const schedule = useCallback((fn: () => void, delay: number) => {
    const id = setTimeout(fn, delay);
    timerRefs.current.push(id);
  }, []);

  const startSequence = useCallback(() => {
    schedule(() => {
      phaseRef.current = "calm";
      setPhase("calm");
    }, PHASE_DURATIONS.fadeIn);
    schedule(
      () => {
        phaseRef.current = "warping";
        setPhase("warping");
      },
      PHASE_DURATIONS.fadeIn + PHASE_DURATIONS.calm + PHASE_DURATIONS.warpStart,
    );

    const arrivalAt =
      PHASE_DURATIONS.fadeIn +
      PHASE_DURATIONS.calm +
      PHASE_DURATIONS.warpStart +
      PHASE_DURATIONS.warp;

    schedule(() => {
      phaseRef.current = "arrival";
      setPhase("arrival");
    }, arrivalAt);

    schedule(() => {
      phaseRef.current = "logo";
      setPhase("logo");
      animate(logoOpacity, 1, { duration: 0.9, ease: [0.25, 0.1, 0.25, 1] });
      animate(logoBlur, 0, { duration: 1.1, ease: [0.25, 0.1, 0.25, 1] });
      animate(logoScale, 1.0, { duration: 1.0, ease: [0.34, 1.56, 0.64, 1] });
    }, arrivalAt + PHASE_DURATIONS.arrival);

    schedule(
      () => {
        animate(logoScale, 1.03, { duration: 0.7, ease: [0.4, 0, 0.2, 1] });
      },
      arrivalAt + PHASE_DURATIONS.arrival + PHASE_DURATIONS.logoHold * 0.5,
    );

    schedule(
      () => {
        phaseRef.current = "exit";
        setPhase("exit");
        animate(logoOpacity, 0, { duration: 0.7, ease: "easeIn" });
        schedule(() => {
          setVisible(false);
          document.body.style.overflow = prevOverflow.current;
          document.body.style.touchAction = "";
          onComplete?.();
        }, 800);
      },
      arrivalAt + PHASE_DURATIONS.arrival + PHASE_DURATIONS.logoHold,
    );
  }, [schedule, logoOpacity, logoBlur, logoScale, onComplete]);

  // ── Mount ────────────────────────────────────────────────────
  useEffect(() => {
    mountedRef.current = true;
    prevOverflow.current = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";

    buildStars();

    const resize = () => {
      const c = canvasRef.current;
      if (!c) return;
      c.width = window.innerWidth;
      c.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);
    resize();

    animFrameRef.current = requestAnimationFrame(renderFrame);
    startSequence();

    return () => {
      mountedRef.current = false;
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("resize", resize);
      timerRefs.current.forEach(clearTimeout);
      document.body.style.overflow = prevOverflow.current;
      document.body.style.touchAction = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const logoFilter = useTransform(logoBlur, (v) => `blur(${v}px)`);

  if (!loaderVisible) return null;

  return (
    <>
      {/* ── Only font changed: Bebas Neue — ultra-bold, geometric, premium ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');

        @keyframes textShimmer {
          0%   { background-position: 0%   50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0%   50%; }
        }

        .auraa-text {
          font-family    : 'Bebas Neue', -apple-system, BlinkMacSystemFont, sans-serif;
          font-weight    : 400; /* Bebas Neue is inherently ultra-bold at 400 */
          font-size      : clamp(52px, 13vw, 140px);
          letter-spacing : 0.22em;
          padding-left   : 0.22em;
          text-transform : uppercase;
          line-height    : 1;
          white-space    : nowrap;
          display        : block;

          background: linear-gradient(
            135deg,
            #050a1a  0%,
            #0d1f5c 18%,
            #1a3a9e 32%,
            #2d5be3 46%,
            #e8eeff 56%,
            #2d5be3 66%,
            #1a3a9e 78%,
            #0d1f5c 90%,
            #050a1a 100%
          );
          background-size         : 250% 250%;
          -webkit-background-clip : text;
          background-clip         : text;
          -webkit-text-fill-color : transparent;
          color                   : transparent;
          animation               : textShimmer 4s ease infinite;

          -webkit-font-smoothing : antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
      `}</style>

      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 9999,
          overflow: "hidden",
          backgroundColor: "#020208",
          WebkitTapHighlightColor: "transparent",
          touchAction: "none",
          userSelect: "none",
        }}
      >
        {/* Warp canvas */}
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "block",
            transform: "translateZ(0)",
          }}
        />

        {/* Vignette */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 2,
            pointerEvents: "none",
            background:
              "radial-gradient(ellipse 120% 120% at 50% 50%, transparent 40%, rgba(0,0,0,0.82) 100%)",
          }}
        />

        {/* Arrival ring — perfectly centred */}
        {phase === "arrival" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.05 }}
            animate={{ opacity: [0, 0.4, 0], scale: [0.05, 2.0, 4.0] }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: "min(34vw, 34vh)",
              height: "min(34vw, 34vh)",
              marginTop: "calc(-1 * min(34vw, 34vh) / 2)",
              marginLeft: "calc(-1 * min(34vw, 34vh) / 2)",
              borderRadius: "50%",
              border: "1px solid rgba(80,120,255,0.35)",
              boxShadow: "0 0 20px 3px rgba(40,80,220,0.12)",
              zIndex: 5,
              pointerEvents: "none",
            }}
          />
        )}

        {/* Logo — dead centre */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 10,
            pointerEvents: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <motion.div
            style={{
              opacity: logoOpacity,
              filter: logoFilter,
              scale: logoScale,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span className="auraa-text">AURAA</span>
          </motion.div>
        </div>

        {/* Fade-in overlay */}
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{
            duration: PHASE_DURATIONS.fadeIn / 1000,
            ease: "easeOut",
          }}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 50,
            background: "#020208",
            pointerEvents: "none",
          }}
        />

        {/* Exit overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: phase === "exit" ? 1 : 0 }}
          transition={{ duration: 0.9, ease: "easeIn" }}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 50,
            background: "#020208",
            pointerEvents: "none",
          }}
        />
      </div>
    </>
  );
}
