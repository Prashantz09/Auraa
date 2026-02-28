import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

function useBreakpoint() {
  const [width, setWidth] = useState(1200);
  useEffect(() => {
    const update = () => setWidth(window.innerWidth);
    update();
    window.addEventListener("resize", update, { passive: true });
    return () => window.removeEventListener("resize", update);
  }, []);
  return {
    isMobile: width < 640,
    isTablet: width >= 640 && width < 1024,
    isDesktop: width >= 1024,
  };
}

const ROWS = {
  lower: [
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
    ["SHIFT", "z", "x", "c", "v", "b", "n", "m", "BACKSPACE"],
  ],
  upper: [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["SHIFT", "Z", "X", "C", "V", "B", "N", "M", "BACKSPACE"],
  ],
};

function Key({
  label,
  onPress,
  isActive,
  wide,
}: {
  label: string;
  onPress: (l: string) => void;
  isActive?: boolean;
  wide?: boolean;
}) {
  const [pressed, setPressed] = useState(false);
  const handlePress = () => {
    setPressed(true);
    setTimeout(() => setPressed(false), 100);
    onPress(label);
  };
  const isSpecial = label === "SHIFT" || label === "BACKSPACE";
  return (
    <button
      onPointerDown={handlePress}
      style={{
        flex: wide ? "2 1 0" : isSpecial ? "1.5 1 0" : "1 1 0",
        minWidth: 0,
        height: 46,
        background: pressed
          ? "rgba(255,255,255,0.35)"
          : isSpecial
            ? "rgba(255,255,255,0.06)"
            : "rgba(255,255,255,0.14)",
        borderRadius: 8,
        border: "none",
        color: "#fff",
        fontSize: isSpecial ? 11 : 17,
        fontWeight: isSpecial ? 500 : 400,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "background 0.08s ease",
        boxShadow: pressed ? "none" : "0 2px 0 rgba(0,0,0,0.55)",
        transform: pressed ? "translateY(1px)" : "translateY(0)",
        userSelect: "none",
        WebkitUserSelect: "none",
        touchAction: "manipulation",
        outline: "none",
        ...(label === "SHIFT" &&
          isActive && {
            background: "rgba(255,255,255,0.85)",
            color: "#1c1c1e",
          }),
      }}
    >
      {label === "BACKSPACE" ? (
        <svg width="22" height="16" viewBox="0 0 22 16" fill="none">
          <path
            d="M9 2H20C20.55 2 21 2.45 21 3V13C21 13.55 20.55 14 20 14H9L2 8L9 2Z"
            fill="rgba(255,255,255,0.75)"
          />
          <path
            d="M12 6L17 11M17 6L12 11"
            stroke="#1c1c1e"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      ) : label === "SHIFT" ? (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path
            d="M9 2L16 9H12V16H6V9H2L9 2Z"
            fill={isActive ? "#1c1c1e" : "rgba(255,255,255,0.8)"}
          />
        </svg>
      ) : (
        label
      )}
    </button>
  );
}

function PhoneKeyboard({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [shifted, setShifted] = useState(false);
  const [capsLock, setCapsLock] = useState(false);
  const shiftRef = useRef({ lastTap: 0 });
  const rows = shifted || capsLock ? ROWS.upper : ROWS.lower;
  const handleKey = (label: string) => {
    if (label === "SHIFT") {
      const now = Date.now();
      const diff = now - shiftRef.current.lastTap;
      shiftRef.current.lastTap = now;
      if (diff < 350) {
        setCapsLock((c) => !c);
        setShifted(false);
      } else if (!capsLock) setShifted((s) => !s);
      return;
    }
    if (label === "BACKSPACE") {
      onChange(value.slice(0, -1));
      return;
    }
    onChange(value + label);
    if (shifted && !capsLock) setShifted(false);
  };
  return (
    <div
      style={{
        background: "#1c1c1e",
        padding: "10px 4px 14px",
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      {rows.map((row, ri) => (
        <div
          key={ri}
          style={{
            display: "flex",
            gap: 6,
            justifyContent: "center",
            paddingLeft: ri === 1 ? "5%" : 0,
            paddingRight: ri === 1 ? "5%" : 0,
          }}
        >
          {row.map((k) => (
            <Key
              key={k}
              label={k}
              onPress={handleKey}
              isActive={
                (k === "SHIFT" && shifted) || (k === "SHIFT" && capsLock)
              }
            />
          ))}
        </div>
      ))}
      <div style={{ display: "flex", gap: 6, paddingTop: 2 }}>
        <button
          style={{
            flex: "1.2 1 0",
            height: 46,
            background: "rgba(255,255,255,0.06)",
            borderRadius: 8,
            border: "none",
            color: "#fff",
            fontSize: 15,
            fontWeight: 500,
            cursor: "pointer",
            boxShadow: "0 2px 0 rgba(0,0,0,0.55)",
            outline: "none",
            touchAction: "manipulation",
          }}
        >
          123
        </button>
        <button
          onPointerDown={() => onChange(value + " ")}
          style={{
            flex: "5 1 0",
            height: 46,
            background: "rgba(255,255,255,0.14)",
            borderRadius: 8,
            border: "none",
            color: "rgba(255,255,255,0.5)",
            fontSize: 14,
            cursor: "pointer",
            boxShadow: "0 2px 0 rgba(0,0,0,0.55)",
            outline: "none",
            touchAction: "manipulation",
          }}
        >
          space
        </button>
        <button
          onPointerDown={() => onChange(value + "\n")}
          style={{
            flex: "1.8 1 0",
            height: 46,
            background: "rgba(255,255,255,0.06)",
            borderRadius: 8,
            border: "none",
            color: "#fff",
            fontSize: 13,
            fontWeight: 500,
            cursor: "pointer",
            boxShadow: "0 2px 0 rgba(0,0,0,0.55)",
            outline: "none",
            touchAction: "manipulation",
          }}
        >
          return
        </button>
      </div>
    </div>
  );
}

function InputBar({
  value,
  onChange,
  onSend,
}: {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
}) {
  return (
    <div
      style={{
        background: "#1f2c34",
        padding: "8px 10px",
        display: "flex",
        alignItems: "flex-end",
        gap: 8,
      }}
    >
      <div
        style={{
          flex: 1,
          background: "#2a3942",
          borderRadius: 22,
          padding: "8px 14px",
          color: value ? "#fff" : "rgba(255,255,255,0.4)",
          fontSize: 14,
          lineHeight: "1.4",
          minHeight: 36,
          maxHeight: 100,
          overflowY: "auto",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
        }}
      >
        {value || "Message"}
      </div>
      <div
        onPointerDown={value ? onSend : undefined}
        style={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          background: value ? "#00a884" : "transparent",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          cursor: value ? "pointer" : "default",
          transition: "background 0.2s ease",
        }}
      >
        {value ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M22 2L11 13"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M22 2L15 22L11 13L2 9L22 2Z"
              stroke="#fff"
              strokeWidth="2"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <rect
              x="9"
              y="2"
              width="6"
              height="12"
              rx="3"
              fill="rgba(255,255,255,0.5)"
            />
            <path
              d="M5 11C5 14.866 8.13401 18 12 18C15.866 18 19 14.866 19 11"
              stroke="rgba(255,255,255,0.5)"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <line
              x1="12"
              y1="18"
              x2="12"
              y2="22"
              stroke="rgba(255,255,255,0.5)"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        )}
      </div>
    </div>
  );
}

function useTypewriter(text: string, speed = 22, enabled = false) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!enabled) {
      setDisplayed("");
      setDone(false);
      return;
    }
    setDisplayed("");
    setDone(false);
    let i = 0;
    const iv = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(iv);
        setDone(true);
      }
    }, speed);
    return () => clearInterval(iv);
  }, [text, speed, enabled]);
  return { displayed, done };
}

function BallpenHighlight({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const pathD =
    "M 4,4 C 30,2 65,5 96,3 C 98,3 99,4 99,16 C 99,17 98,18 96,19 C 70,21 35,18 4,20 C 2,20 1,18 2,16 C 1,12 1,8 4,4 Z";
  return (
    <span
      style={{ position: "relative", display: "inline", whiteSpace: "nowrap" }}
    >
      <motion.svg
        aria-hidden="true"
        initial="hidden"
        animate="visible"
        style={{
          position: "absolute",
          top: "-8px",
          left: "-8px",
          width: "calc(100% + 16px)",
          height: "calc(100% + 16px)",
          overflow: "visible",
          zIndex: 0,
          pointerEvents: "none",
        }}
        viewBox="0 0 100 24"
        preserveAspectRatio="none"
      >
        <motion.path
          d={pathD}
          fill="rgba(22,13,203,0.18)"
          stroke="#2079d797"
          strokeWidth="1.1"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="240"
          variants={{
            hidden: { strokeDashoffset: 240, opacity: 0 },
            visible: {
              strokeDashoffset: 0,
              opacity: 1,
              transition: {
                strokeDashoffset: {
                  duration: 0.7,
                  delay,
                  ease: [0.4, 0, 0.15, 1],
                },
                opacity: { duration: 0.01, delay },
              },
            },
          }}
        />
        <motion.path
          d="M 5,6 C 35,4 68,6 95,5 C 97,5 98,6 98,7"
          fill="none"
          stroke="rgba(16,13,175,0.35)"
          strokeWidth="0.6"
          strokeLinecap="round"
          variants={{
            hidden: { pathLength: 0 },
            visible: {
              pathLength: 1,
              transition: {
                duration: 0.45,
                delay: delay + 0.3,
                ease: [0.4, 0, 0.2, 1],
              },
            },
          }}
        />
      </motion.svg>
      <span style={{ position: "relative", zIndex: 1 }}>{children}</span>
    </span>
  );
}

function BallpenUnderline({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <span style={{ position: "relative", display: "inline" }}>
      {children}
      <span
        style={{
          position: "absolute",
          left: "-2px",
          bottom: "-10px",
          width: "calc(100% + 4px)",
          height: 14,
          overflow: "visible",
          pointerEvents: "none",
        }}
      >
        <motion.svg
          aria-hidden="true"
          initial="hidden"
          animate="visible"
          style={{ width: "100%", height: "100%" }}
          viewBox="0 0 100 14"
          preserveAspectRatio="none"
        >
          <motion.path
            d="M 0,4.5 C 18,4.2 38,4.8 58,4.4 C 78,4.0 90,5.0 100,5.5"
            fill="none"
            stroke="#0c4edcb8"
            strokeWidth="1.0"
            strokeLinecap="round"
            variants={{
              hidden: { pathLength: 0 },
              visible: {
                pathLength: 1,
                transition: {
                  duration: 0.42,
                  delay,
                  ease: [0.4, 0, 0.15, 1],
                },
              },
            }}
          />
          <motion.path
            d="M 100,8.0 C 82,7.8 62,8.4 42,7.9 C 22,7.4 10,6.8 0,7.5"
            fill="none"
            stroke="#2600ffff"
            strokeWidth="0.9"
            strokeLinecap="round"
            opacity={0.8}
            variants={{
              hidden: { pathLength: 0 },
              visible: {
                pathLength: 1,
                transition: {
                  duration: 0.42,
                  delay: delay + 0.42,
                  ease: [0.4, 0, 0.15, 1],
                },
              },
            }}
          />
          <motion.path
            d="M 0,6.0 C 25,5.8 55,6.5 80,6.1 C 90,5.9 96,6.4 100,6.5"
            fill="none"
            stroke="rgba(77,77,255,0.45)"
            strokeWidth="0.7"
            strokeLinecap="round"
            variants={{
              hidden: { pathLength: 0 },
              visible: {
                pathLength: 1,
                transition: {
                  duration: 0.35,
                  delay: delay + 0.84,
                  ease: [0.4, 0, 0.2, 1],
                },
              },
            }}
          />
        </motion.svg>
      </span>
    </span>
  );
}

function TypingDots() {
  return (
    <div
      style={{
        display: "flex",
        gap: 5,
        alignItems: "center",
        padding: "10px 14px",
        background: "#373739",
        borderRadius: "18px 18px 18px 4px",
        alignSelf: "flex-start",
      }}
    >
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.55)",
            display: "inline-block",
          }}
          animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
          transition={{
            duration: 0.75,
            repeat: Infinity,
            delay: i * 0.16,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

function ChatBubble({
  text,
  triggerAt,
  isUser = false,
  onDone,
}: {
  text: string;
  triggerAt: number;
  isUser?: boolean;
  onDone?: () => void;
}) {
  const [started, setStarted] = useState(false);
  const { displayed, done } = useTypewriter(text, 22, started);
  useEffect(() => {
    const t = setTimeout(() => setStarted(true), triggerAt);
    return () => clearTimeout(t);
  }, [triggerAt]);
  useEffect(() => {
    if (done && onDone) onDone();
  }, [done]);
  if (!started) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 14, scale: 0.93 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background: isUser ? "#4a4a4e" : "#3a3a3c",
        borderRadius: isUser ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
        padding: "10px 14px",
        fontSize: 12.5,
        lineHeight: 1.5,
        color: "rgba(255,255,255,0.92)",
        maxWidth: "90%",
        alignSelf: isUser ? "flex-end" : "flex-start",
        wordBreak: "break-word",
      }}
    >
      {displayed}
      {!done && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
          style={{
            display: "inline-block",
            width: 2,
            height: "0.85em",
            background: "rgba(255,255,255,0.75)",
            marginLeft: 2,
            verticalAlign: "middle",
            borderRadius: 1,
          }}
        />
      )}
    </motion.div>
  );
}

const VIDEO_URL =
  "https://res.cloudinary.com/dwpp9kkp3/video/upload/v1772296079/Open_gasmit.mp4";
const MSG1 = "Hey Auraa! Can you pull up my latest video project?";
const MSG2 = "Of course! Here's your recent video edit ready for review.";

function PhoneMockup() {
  const [showTyping, setShowTyping] = useState(false);
  const [showMsg2, setShowMsg2] = useState(false);
  const [showImages, setShowImages] = useState(false);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [message, setMessage] = useState("");
  const [sentMessages, setSentMessages] = useState<string[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMsg1Done = () => {
    setTimeout(() => setShowTyping(true), 300);
    setTimeout(() => {
      setShowTyping(false);
      setShowMsg2(true);
    }, 2000);
  };
  const handleMsg2Done = () => setTimeout(() => setShowImages(true), 400);

  // Ensure video plays when shown
  useEffect(() => {
    if (showImages && videoRef.current) {
      const video = videoRef.current;
      // Try to play video (browser may block autoplay)
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.log("Autoplay prevented, adding user interaction fallback");
          // Add click listener to start video on first interaction
          const startVideoOnInteraction = () => {
            video.play().catch((e) => console.error("Video play failed:", e));
            document.removeEventListener("click", startVideoOnInteraction);
          };
          document.addEventListener("click", startVideoOnInteraction, {
            once: true,
          });
        });
      }
    }
  }, [showImages]);

  useEffect(() => {
    if (showImages) {
      const t = setTimeout(() => setShowKeyboard(true), 600);
      return () => clearTimeout(t);
    }
  }, [showImages]);
  const handleSend = () => {
    if (!message.trim()) return;
    setSentMessages((p) => [...p, message]);
    setMessage("");
  };

  return (
    <div className="w-[260px] sm:w-[280px] md:w-[320px] lg:w-[360px] flex-shrink-0 relative">
      <PhoneStatusBar />
      <div
        style={{
          borderRadius: 52,
          border: "4px solid rgba(255,255,255,0.92)",
          background: "#111",
          padding: "18px 14px 28px",
          boxShadow: "0 60px 120px rgba(0,0,0,0.85)",
        }}
      >
        <div
          style={{
            width: 110,
            height: 30,
            background: "#000",
            borderRadius: 24,
            margin: "0 auto 18px",
          }}
        />
        <div
          style={{
            background: "#0b141a",
            borderRadius: 36,
            height: 620,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <div
            style={{
              flex: 1,
              padding: "18px 14px",
              display: "flex",
              flexDirection: "column",
              gap: 14,
              overflowY: "auto",
            }}
          >
            <ChatBubble
              text={MSG1}
              triggerAt={700}
              isUser={true}
              onDone={handleMsg1Done}
            />
            <AnimatePresence>
              {showTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <TypingDots />
                </motion.div>
              )}
            </AnimatePresence>
            {showMsg2 && (
              <ChatBubble
                text={MSG2}
                triggerAt={0}
                isUser={false}
                onDone={handleMsg2Done}
              />
            )}
            <AnimatePresence>
              {showImages && (
                <motion.video
                  ref={videoRef}
                  key="hero-video"
                  src={VIDEO_URL}
                  autoPlay
                  muted
                  loop
                  playsInline
                  controls={false}
                  preload="auto"
                  style={{
                    borderRadius: 14,
                    width: "100%",
                    aspectRatio: "16/9",
                    objectFit: "cover",
                  }}
                  onError={(e) => {
                    console.error("Video failed to load:", e);
                    // Fallback: try to reload video
                    const video = e.target as HTMLVideoElement;
                    setTimeout(() => {
                      video.load();
                    }, 1000);
                  }}
                  onLoadedData={() => {
                    console.log("Video loaded successfully");
                  }}
                />
              )}
            </AnimatePresence>
            {sentMessages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 6, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  alignSelf: "flex-end",
                  background: "#4a4a4e",
                  borderRadius: "18px 18px 4px 18px",
                  padding: "10px 14px",
                  maxWidth: "90%",
                  color: "rgba(255,255,255,0.92)",
                  fontSize: 12.5,
                  lineHeight: 1.5,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              >
                {msg}
              </motion.div>
            ))}
          </div>
          <AnimatePresence>
            {showKeyboard && (
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                <InputBar
                  value={message}
                  onChange={(v) => setMessage(v)}
                  onSend={handleSend}
                />
                <PhoneKeyboard value={message} onChange={setMessage} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function WordReveal({
  text,
  baseDelay = 0,
}: {
  text: string;
  baseDelay?: number;
}) {
  return (
    <span style={{ display: "inline" }}>
      {text.split(" ").map((word, i, arr) => (
        <motion.span
          key={i}
          style={{
            display: "inline-block",
            overflow: "hidden",
            verticalAlign: "bottom",
          }}
        >
          <motion.span
            style={{ display: "inline-block" }}
            initial={{ y: "105%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            transition={{
              duration: 0.5,
              delay: baseDelay + i * 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {word}
            {i < arr.length - 1 ? "\u00A0" : ""}
          </motion.span>
        </motion.span>
      ))}
    </span>
  );
}

function PhoneStatusBar() {
  return (
    <div
      style={{
        position: "absolute",
        top: 30,
        left: 20,
        right: 20,
        padding: "0 10px",
        height: 18,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        color: "#fff",
        fontSize: 11,
        fontWeight: 500,
        pointerEvents: "none",
        zIndex: 5,
      }}
    >
      <span>9:41</span>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <svg width="18" height="12" viewBox="0 0 18 12">
          <rect x="0" y="6" width="2" height="6" fill="white" />
          <rect x="4" y="4" width="2" height="8" fill="white" />
          <rect x="8" y="2" width="2" height="10" fill="white" />
          <rect x="12" y="0" width="2" height="12" fill="white" />
        </svg>
        <svg width="16" height="12" viewBox="0 0 16 12">
          <path
            d="M1 4.5C4.5 1.5 11.5 1.5 15 4.5"
            stroke="white"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          <path
            d="M4 7C6 5.5 10 5.5 12 7"
            stroke="white"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          <circle cx="8" cy="9.5" r="1.2" fill="white" />
        </svg>
        <svg width="26" height="12" viewBox="0 0 26 12">
          <rect
            x="0"
            y="0"
            width="22"
            height="12"
            rx="3"
            stroke="white"
            strokeWidth="1.4"
          />
          <rect x="22" y="3.5" width="3" height="5" rx="1" fill="white" />
          <rect x="2" y="2" width="18" height="8" rx="2" fill="white" />
        </svg>
      </div>
    </div>
  );
}

const SPARKLES = [
  { top: "14%", left: "20%", size: 3, dur: 2.8, delay: 0.0 },
  { top: "44%", left: "60%", size: 2, dur: 3.2, delay: 0.7 },
  { top: "70%", left: "36%", size: 4, dur: 2.4, delay: 1.5 },
  { top: "26%", left: "76%", size: 2, dur: 3.6, delay: 0.3 },
  { top: "58%", left: "12%", size: 3, dur: 2.6, delay: 1.1 },
  { top: "82%", left: "54%", size: 2, dur: 3.0, delay: 1.9 },
  { top: "8%", left: "48%", size: 3, dur: 2.9, delay: 0.5 },
  { top: "50%", left: "88%", size: 2, dur: 3.4, delay: 1.3 },
];

function LiquidGlassBackground() {
  const { isMobile, isTablet } = useBreakpoint();

  const ringA = isMobile ? 150 : isTablet ? 240 : 320;
  const ringB = isMobile ? 195 : isTablet ? 310 : 440;
  const ringC = isMobile ? 95 : isTablet ? 148 : 200;

  const sphereMd = isMobile ? 110 : isTablet ? 160 : 210;
  const sphereSm = isMobile ? 68 : isTablet ? 100 : 128;
  const sphereTiny = isMobile ? 44 : isTablet ? 58 : 74;

  const glassBlobA = isMobile
    ? "clamp(220px, 90vw, 880px)"
    : isTablet
      ? "clamp(360px, 72vw, 880px)"
      : "clamp(480px, 60vw, 880px)";

  const glassBlobB = isMobile
    ? "clamp(200px, 85vw, 820px)"
    : isTablet
      ? "clamp(330px, 68vw, 820px)"
      : "clamp(440px, 56vw, 820px)";

  const showPills = !isMobile;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      {/* ══ AURORA BLOBS ══════════════════════════════════════════ */}

      {/* Ultramarine — top-left anchor */}
      <motion.div
        animate={{
          x: [0, 60, -42, 24, 0],
          y: [0, -50, 36, -20, 0],
          scale: [1, 1.13, 0.89, 1.07, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
          repeatType: "mirror",
        }}
        style={{
          position: "absolute",
          top: "-28%",
          left: "-20%",
          width: isMobile
            ? "clamp(240px, 90vw, 700px)"
            : isTablet
              ? "clamp(400px, 80vw, 900px)"
              : "clamp(580px, 74vw, 1080px)",
          height: isMobile
            ? "clamp(240px, 90vw, 700px)"
            : isTablet
              ? "clamp(400px, 80vw, 900px)"
              : "clamp(580px, 74vw, 1080px)",
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 42% 40%, rgba(18,10,143,0.95) 0%, rgba(14,51,134,0.55) 36%, rgba(23,64,191,0.18) 60%, transparent 78%)",
          filter: "blur(75px)",
          willChange: "transform",
        }}
      />

      {/* Electric blue — top-right */}
      <motion.div
        animate={{
          x: [0, -58, 40, -30, 0],
          y: [0, 40, -30, 48, 0],
          scale: [1, 0.89, 1.19, 0.95, 1],
        }}
        transition={{
          duration: 26,
          repeat: Infinity,
          ease: "easeInOut",
          repeatType: "mirror",
        }}
        style={{
          position: "absolute",
          top: "4%",
          right: "-18%",
          width: isMobile
            ? "clamp(200px, 80vw, 620px)"
            : isTablet
              ? "clamp(340px, 70vw, 800px)"
              : "clamp(500px, 64vw, 940px)",
          height: isMobile
            ? "clamp(200px, 80vw, 620px)"
            : isTablet
              ? "clamp(340px, 70vw, 800px)"
              : "clamp(500px, 64vw, 940px)",
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 54% 44%, rgba(37,99,235,0.88) 0%, rgba(29,78,216,0.42) 38%, rgba(14,51,134,0.12) 64%, transparent 80%)",
          filter: "blur(70px)",
          willChange: "transform",
        }}
      />

      {/* Ocean deep — bottom-centre */}
      <motion.div
        animate={{
          x: [0, 44, -34, 20, 0],
          y: [0, -30, 44, -16, 0],
          scale: [1, 1.17, 0.87, 1.05, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
          repeatType: "mirror",
        }}
        style={{
          position: "absolute",
          bottom: "-20%",
          left: "24%",
          width: isMobile
            ? "clamp(190px, 75vw, 580px)"
            : isTablet
              ? "clamp(320px, 65vw, 720px)"
              : "clamp(460px, 58vw, 840px)",
          height: isMobile
            ? "clamp(190px, 75vw, 580px)"
            : isTablet
              ? "clamp(320px, 65vw, 720px)"
              : "clamp(460px, 58vw, 840px)",
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 50% 55%, rgba(0,65,106,0.82) 0%, rgba(14,51,134,0.40) 38%, rgba(6,11,46,0.12) 62%, transparent 80%)",
          filter: "blur(78px)",
          willChange: "transform",
        }}
      />

      {/* Royal navy pulse — centre-left */}
      <motion.div
        animate={{
          scale: [1, 1.24, 0.88, 1.1, 1],
          opacity: [0.6, 1.0, 0.68, 0.92, 0.6],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          top: "30%",
          left: "6%",
          width: isMobile
            ? "clamp(160px, 60vw, 380px)"
            : isTablet
              ? "clamp(220px, 48vw, 480px)"
              : "clamp(290px, 37vw, 560px)",
          height: isMobile
            ? "clamp(160px, 60vw, 380px)"
            : isTablet
              ? "clamp(220px, 48vw, 480px)"
              : "clamp(290px, 37vw, 560px)",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(14,51,134,0.85) 0%, rgba(37,99,235,0.35) 46%, transparent 74%)",
          filter: "blur(62px)",
          willChange: "transform, opacity",
        }}
      />

      {/* Bright ice blue — top-right corner */}
      <motion.div
        animate={{
          x: [0, -26, 20, -12, 0],
          y: [0, 18, -24, 14, 0],
          scale: [1, 1.12, 0.93, 1.05, 1],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut",
          repeatType: "mirror",
        }}
        style={{
          position: "absolute",
          top: "6%",
          right: "12%",
          width: isMobile
            ? "clamp(100px, 38vw, 240px)"
            : isTablet
              ? "clamp(140px, 28vw, 290px)"
              : "clamp(180px, 22vw, 340px)",
          height: isMobile
            ? "clamp(100px, 38vw, 240px)"
            : isTablet
              ? "clamp(140px, 28vw, 290px)"
              : "clamp(180px, 22vw, 340px)",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(59,130,246,0.70) 0%, rgba(37,99,235,0.28) 50%, transparent 75%)",
          filter: "blur(50px)",
          willChange: "transform",
        }}
      />

      {/* Deep midnight — bottom-left */}
      <motion.div
        animate={{
          x: [0, 30, -22, 14, 0],
          y: [0, -20, 28, -12, 0],
          scale: [1, 1.08, 0.94, 1.03, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
          repeatType: "mirror",
        }}
        style={{
          position: "absolute",
          bottom: "5%",
          left: "-8%",
          width: isMobile
            ? "clamp(150px, 55vw, 420px)"
            : isTablet
              ? "clamp(240px, 44vw, 520px)"
              : "clamp(340px, 42vw, 620px)",
          height: isMobile
            ? "clamp(150px, 55vw, 420px)"
            : isTablet
              ? "clamp(240px, 44vw, 520px)"
              : "clamp(340px, 42vw, 620px)",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(6,11,46,0.90) 0%, rgba(18,10,143,0.38) 48%, transparent 74%)",
          filter: "blur(66px)",
          willChange: "transform",
        }}
      />

      {/* Cobalt mid-tone — centre filler */}
      <motion.div
        animate={{
          x: [0, -18, 28, -10, 0],
          y: [0, 24, -16, 20, 0],
          scale: [1, 1.1, 0.92, 1.04, 1],
        }}
        transition={{
          duration: 34,
          repeat: Infinity,
          ease: "easeInOut",
          repeatType: "mirror",
        }}
        style={{
          position: "absolute",
          top: "42%",
          left: "35%",
          width: isMobile
            ? "clamp(130px, 48vw, 320px)"
            : isTablet
              ? "clamp(200px, 38vw, 400px)"
              : "clamp(260px, 32vw, 480px)",
          height: isMobile
            ? "clamp(130px, 48vw, 320px)"
            : isTablet
              ? "clamp(200px, 38vw, 400px)"
              : "clamp(260px, 32vw, 480px)",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(23,64,191,0.65) 0%, rgba(14,51,134,0.22) 52%, transparent 76%)",
          filter: "blur(58px)",
          willChange: "transform",
        }}
      />

      {/* ══ ORBIT RINGS ══════════════════════════════════════════ */}
      <motion.div
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 48, repeat: Infinity, ease: "linear" }}
        style={{
          position: "absolute",
          top: "10%",
          left: "4%",
          width: ringA,
          height: ringA,
          borderRadius: "50%",
          border: "1px solid rgba(59,130,246,0.18)",
          boxShadow: "0 0 28px rgba(37,99,235,0.20)",
        }}
      />
      <motion.div
        animate={{ rotate: [360, 0] }}
        transition={{ duration: 64, repeat: Infinity, ease: "linear" }}
        style={{
          position: "absolute",
          bottom: "12%",
          right: "6%",
          width: ringB,
          height: ringB,
          borderRadius: "50%",
          border: "1px solid rgba(14,51,134,0.16)",
          boxShadow: "0 0 32px rgba(18,10,143,0.16)",
        }}
      />
      <motion.div
        animate={{ rotate: [0, -360] }}
        transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
        style={{
          position: "absolute",
          top: "38%",
          right: "22%",
          width: ringC,
          height: ringC,
          borderRadius: "50%",
          border: "1px solid rgba(59,130,246,0.10)",
        }}
      />

      {/* ══ SPARKLES ═════════════════════════════════════════════ */}
      {SPARKLES.map((dot, i) => (
        <motion.div
          key={i}
          animate={{ opacity: [0.12, 0.85, 0.12], scale: [1, 1.6, 1] }}
          transition={{
            duration: dot.dur,
            repeat: Infinity,
            ease: "easeInOut",
            delay: dot.delay,
          }}
          style={{
            position: "absolute",
            top: dot.top,
            left: dot.left,
            width: isMobile ? Math.max(1, dot.size - 1) : dot.size,
            height: isMobile ? Math.max(1, dot.size - 1) : dot.size,
            borderRadius: "50%",
            background: "rgba(147,197,253,0.90)",
            boxShadow: "0 0 8px rgba(59,130,246,0.60)",
          }}
        />
      ))}

      {/* ══ GLASS BLOBS ══════════════════════════════════════════ */}
      <motion.div
        animate={{
          x: [0, 30, -20, 14, 0],
          y: [0, -20, 28, -10, 0],
          borderRadius: [
            "62% 38% 54% 46% / 46% 54% 48% 52%",
            "46% 54% 38% 62% / 54% 46% 62% 38%",
            "54% 46% 62% 38% / 38% 62% 46% 54%",
            "62% 38% 54% 46% / 46% 54% 48% 52%",
          ],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
          repeatType: "mirror",
        }}
        style={{
          position: "absolute",
          top: "-14%",
          left: "-14%",
          width: glassBlobA,
          height: glassBlobA,
          backdropFilter: "blur(90px) saturate(210%) brightness(1.06)",
          WebkitBackdropFilter: "blur(90px) saturate(210%) brightness(1.06)",
          background:
            "linear-gradient(148deg, rgba(59,130,246,0.06) 0%, rgba(14,51,134,0.03) 45%, rgba(18,10,143,0.05) 100%)",
          border: "1px solid rgba(59,130,246,0.14)",
          boxShadow: [
            "inset 0 1.5px 0 rgba(147,197,253,0.22)",
            "inset 0 -1px 0 rgba(0,0,0,0.10)",
            "inset 1px 0 0 rgba(59,130,246,0.08)",
            "0 30px 100px rgba(0,0,0,0.45)",
          ].join(", "),
          willChange: "transform, border-radius",
        }}
      />
      <motion.div
        animate={{
          x: [0, -24, 18, -10, 0],
          y: [0, 24, -18, 10, 0],
          borderRadius: [
            "46% 54% 40% 60% / 58% 42% 60% 40%",
            "60% 40% 54% 46% / 42% 58% 40% 60%",
            "50% 50% 46% 54% / 60% 40% 52% 48%",
            "46% 54% 40% 60% / 58% 42% 60% 40%",
          ],
        }}
        transition={{
          duration: 24,
          repeat: Infinity,
          ease: "easeInOut",
          repeatType: "mirror",
        }}
        style={{
          position: "absolute",
          bottom: "-12%",
          right: "-12%",
          width: glassBlobB,
          height: glassBlobB,
          backdropFilter: "blur(80px) saturate(195%) brightness(1.05)",
          WebkitBackdropFilter: "blur(80px) saturate(195%) brightness(1.05)",
          background:
            "linear-gradient(322deg, rgba(37,99,235,0.055) 0%, rgba(14,51,134,0.018) 55%, rgba(0,65,106,0.04) 100%)",
          border: "1px solid rgba(37,99,235,0.10)",
          boxShadow: [
            "inset 0 1.5px 0 rgba(147,197,253,0.18)",
            "inset 0 -1px 0 rgba(0,0,0,0.08)",
            "0 25px 80px rgba(0,0,0,0.38)",
          ].join(", "),
          willChange: "transform, border-radius",
        }}
      />

      {/* ══ GLASS SPHERES ════════════════════════════════════════ */}
      <motion.div
        animate={{ y: [0, -24, 0], x: [0, 11, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          top: "16%",
          right: "24%",
          width: sphereMd,
          height: sphereMd,
          borderRadius: "50%",
          backdropFilter: "blur(55px) saturate(240%) brightness(1.14)",
          WebkitBackdropFilter: "blur(55px) saturate(240%) brightness(1.14)",
          background:
            "radial-gradient(circle at 34% 28%, rgba(147,197,253,0.22) 0%, rgba(59,130,246,0.08) 36%, rgba(37,99,235,0.02) 64%, transparent 100%)",
          border: "1px solid rgba(147,197,253,0.26)",
          boxShadow: [
            "inset 0 3px 8px rgba(147,197,253,0.22)",
            "inset 0 -2px 5px rgba(0,0,0,0.14)",
            "0 18px 55px rgba(0,0,0,0.42)",
            "0 0 110px rgba(37,99,235,0.22)",
          ].join(", "),
        }}
      />
      <motion.div
        animate={{ y: [0, -15, 0], x: [0, -8, 0] }}
        transition={{
          duration: 5.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.4,
        }}
        style={{
          position: "absolute",
          bottom: "27%",
          left: "15%",
          width: sphereSm,
          height: sphereSm,
          borderRadius: "50%",
          backdropFilter: "blur(38px) saturate(220%)",
          WebkitBackdropFilter: "blur(38px) saturate(220%)",
          background:
            "radial-gradient(circle at 35% 30%, rgba(147,197,253,0.18) 0%, rgba(59,130,246,0.06) 44%, transparent 100%)",
          border: "1px solid rgba(147,197,253,0.20)",
          boxShadow: [
            "inset 0 2px 5px rgba(147,197,253,0.18)",
            "0 10px 38px rgba(0,0,0,0.32)",
            "0 0 65px rgba(14,51,134,0.20)",
          ].join(", "),
        }}
      />
      <motion.div
        animate={{ y: [0, -12, 0], x: [0, 6, 0] }}
        transition={{
          duration: 4.8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2.2,
        }}
        style={{
          position: "absolute",
          top: "22%",
          left: "42%",
          width: sphereTiny,
          height: sphereTiny,
          borderRadius: "50%",
          backdropFilter: "blur(28px) saturate(200%)",
          WebkitBackdropFilter: "blur(28px) saturate(200%)",
          background:
            "radial-gradient(circle at 36% 30%, rgba(147,197,253,0.20) 0%, rgba(59,130,246,0.06) 50%, transparent 100%)",
          border: "1px solid rgba(147,197,253,0.22)",
          boxShadow: [
            "inset 0 1.5px 4px rgba(147,197,253,0.20)",
            "0 6px 24px rgba(0,0,0,0.30)",
            "0 0 40px rgba(37,99,235,0.18)",
          ].join(", "),
        }}
      />

      {/* ══ GLASS PILLS — tablet + desktop only ════════════════ */}
      {showPills && (
        <>
          <motion.div
            animate={{ y: [0, -11, 0] }}
            transition={{
              duration: 9,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.6,
            }}
            style={{
              position: "absolute",
              top: "54%",
              left: "46%",
              width: isTablet ? 130 : 170,
              height: isTablet ? 46 : 58,
              borderRadius: 29,
              transform: "rotate(-14deg)",
              backdropFilter: "blur(32px) saturate(200%)",
              WebkitBackdropFilter: "blur(32px) saturate(200%)",
              background:
                "linear-gradient(135deg, rgba(59,130,246,0.12) 0%, rgba(14,51,134,0.04) 100%)",
              border: "1px solid rgba(147,197,253,0.16)",
              boxShadow: [
                "inset 0 1.5px 0 rgba(147,197,253,0.20)",
                "0 8px 28px rgba(0,0,0,0.26)",
              ].join(", "),
            }}
          />
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{
              duration: 7.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 3.0,
            }}
            style={{
              position: "absolute",
              top: "72%",
              right: "32%",
              width: isTablet ? 85 : 110,
              height: isTablet ? 32 : 40,
              borderRadius: 20,
              transform: "rotate(10deg)",
              backdropFilter: "blur(25px) saturate(190%)",
              WebkitBackdropFilter: "blur(25px) saturate(190%)",
              background:
                "linear-gradient(135deg, rgba(37,99,235,0.10) 0%, rgba(14,51,134,0.03) 100%)",
              border: "1px solid rgba(59,130,246,0.14)",
              boxShadow:
                "inset 0 1px 0 rgba(147,197,253,0.16), 0 6px 22px rgba(0,0,0,0.24)",
            }}
          />
        </>
      )}

      {/* ══ LIGHT STREAKS ════════════════════════════════════════ */}
      <motion.div
        animate={{ opacity: [0, 0.18, 0], scaleX: [0.45, 1.12, 0.45] }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.8,
        }}
        style={{
          position: "absolute",
          top: "39%",
          left: 0,
          width: "100%",
          height: 2,
          background:
            "linear-gradient(90deg, transparent, rgba(147,197,253,0.50) 22%, rgba(255,255,255,0.75) 50%, rgba(147,197,253,0.50) 78%, transparent)",
          filter: "blur(4px)",
          transformOrigin: "center",
        }}
      />
      <motion.div
        animate={{ opacity: [0, 0.1, 0] }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 5.5,
        }}
        style={{
          position: "absolute",
          top: 0,
          left: "28%",
          width: 3,
          height: "100%",
          background:
            "linear-gradient(180deg, transparent, rgba(59,130,246,0.28) 25%, rgba(147,197,253,0.45) 50%, rgba(59,130,246,0.28) 75%, transparent)",
          filter: "blur(10px)",
          transform: "rotate(13deg)",
          transformOrigin: "top center",
        }}
      />
      <motion.div
        animate={{ opacity: [0, 0.07, 0] }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 10,
        }}
        style={{
          position: "absolute",
          top: 0,
          right: "35%",
          width: 2,
          height: "100%",
          background:
            "linear-gradient(180deg, transparent, rgba(37,99,235,0.22) 30%, rgba(59,130,246,0.36) 50%, rgba(37,99,235,0.22) 70%, transparent)",
          filter: "blur(8px)",
          transform: "rotate(-8deg)",
          transformOrigin: "top center",
        }}
      />

      {/* Film grain */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.88' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "180px 180px",
          opacity: 0.42,
          mixBlendMode: "overlay" as const,
          pointerEvents: "none",
        }}
      />

      {/* ══════════════════════════════════════════════════════════
          FULL BLACK BOTTOM GRADIENT
          Three stacked layers so the transition to the next
          black section is completely seamless on every viewport.

          Layer A — solid black floor (0 → 12%)
            Guarantees zero colour leakage at the very bottom edge.

          Layer B — deep fade (0 → 55%)
            Pulls the aurora colours down into pure black across
            roughly the bottom half of the hero.

          Layer C — wide atmospheric feather (0 → 75%)
            Softens the mid-section so the transition looks natural
            rather than abrupt, especially on tall desktop screens.
         ══════════════════════════════════════════════════════════ */}

      {/* Layer A — solid black floor */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "12%",
          background: "#000000",
          pointerEvents: "none",
          zIndex: 4,
        }}
      />

      {/* Layer B — deep fade to black */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          /* Taller on mobile (fewer visual elements, needs more coverage) */
          height: isMobile ? "62%" : isTablet ? "58%" : "55%",
          background:
            "linear-gradient(to top, #000000 0%, #000000 10%, rgba(0,0,0,0.97) 22%, rgba(0,0,0,0.88) 36%, rgba(0,0,0,0.65) 55%, rgba(0,0,0,0.30) 75%, transparent 100%)",
          pointerEvents: "none",
          zIndex: 3,
        }}
      />

      {/* Layer C — wide atmospheric feather */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "75%",
          background:
            "linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.18) 30%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 2,
        }}
      />

      {/* Side vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 50% 60%, transparent 40%, rgba(0,0,0,0.50) 100%)",
          pointerEvents: "none",
          zIndex: 3,
        }}
      />
    </div>
  );
}

export default function CinematicHero({
  isBookingModalOpen,
  setIsBookingModalOpen,
}: {
  isBookingModalOpen: boolean;
  setIsBookingModalOpen: (open: boolean) => void;
}) {
  const [hoverStart, setHoverStart] = useState(false);
  const [hoverWork, setHoverWork] = useState(false);
  const [mountKey] = useState(() => Date.now());
  const { isMobile, isTablet } = useBreakpoint();

  const overlayWidth = isMobile ? "100%" : isTablet ? "82%" : "68%";
  const overlayBackground = isMobile
    ? "radial-gradient(ellipse at 30% 44%, rgba(2,4,20,0.90) 0%, rgba(3,6,28,0.74) 28%, rgba(4,8,34,0.50) 58%, rgba(5,10,40,0.18) 82%, transparent 100%)"
    : [
        "linear-gradient(108deg, rgba(2,4,20,0.93) 0%, rgba(3,6,28,0.80) 18%, rgba(4,8,34,0.58) 38%, rgba(5,10,40,0.28) 58%, rgba(5,10,40,0.06) 76%, transparent 92%)",
        "linear-gradient(to top, rgba(2,3,16,0.45) 0%, transparent 38%)",
      ].join(", ");

  return (
    <section
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        /* Section base matches the solid black floor so there is
           zero gap between hero bottom and the next section.      */
        background: "#000000",
        overflow: "hidden",
        padding: "0 clamp(24px,5vw,80px)",
        fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif",
        boxSizing: "border-box",
        position: "relative",
      }}
    >
      <LiquidGlassBackground />

      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          width: overlayWidth,
          background: overlayBackground,
          pointerEvents: "none",
          zIndex: 1,
          transition: "width 0.3s ease",
        }}
      />

      <div
        key={mountKey}
        style={{
          width: "100%",
          maxWidth: 1200,
          padding: isMobile ? "48px 0 32px" : "24px 0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "clamp(40px,6vw,80px)",
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* LEFT */}
        <div
          style={{
            flex: 1,
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <h1
            style={{
              fontWeight: 700,
              fontSize: "clamp(1.75rem,4.2vw,3.5rem)",
              lineHeight: 1.15,
              color: "rgba(255,255,255,0.97)",
              letterSpacing: "-0.02em",
              margin: 0,
              textShadow: [
                "0 0 28px rgba(37,99,235,0.50)",
                "0 0 65px rgba(59,130,246,0.28)",
                "0 0 110px rgba(18,10,143,0.18)",
                "0 2px 8px rgba(0,0,0,0.72)",
              ].join(", "),
            }}
          >
            <span style={{ display: "block" }}>
              <WordReveal text="Your Creative Partner" baseDelay={0.1} />
            </span>
            <span style={{ display: "block", marginTop: 4 }}>
              <WordReveal text="for" baseDelay={0.4} />
              {"\u00A0"}
              <BallpenHighlight delay={0.55}>
                <span style={{ fontWeight: 800, letterSpacing: "-0.025em" }}>
                  Video &amp; Storytelling,
                </span>
              </BallpenHighlight>
            </span>
            <span style={{ display: "block", marginTop: 12 }}>
              <WordReveal text="Ready to Elevate" baseDelay={1.0} />
            </span>
            <span style={{ display: "block", marginTop: 4 }}>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.28, duration: 0.01 }}
              >
                <BallpenUnderline delay={1.3}>
                  <WordReveal text="Your Project." baseDelay={1.12} />
                </BallpenUnderline>
              </motion.span>
            </span>
          </h1>

          <motion.p
            style={{
              marginTop: 28,
              marginBottom: 36,
              maxWidth: isMobile ? "100%" : 420,
              fontSize: "clamp(0.875rem,1.3vw,1rem)",
              fontWeight: 400,
              color: "rgba(255,255,255,0.70)",
              lineHeight: 1.8,
            }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 2.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <strong
              style={{ color: "rgba(255,255,255,0.94)", fontWeight: 600 }}
            >
              Auraa
            </strong>{" "}
            brings premium video editing, and storytelling tools to your
            fingertips. Work smarter, launch faster, and make every project{" "}
            <strong
              style={{ color: "rgba(255,255,255,0.94)", fontWeight: 600 }}
            >
              unforgettable
            </strong>
            .
          </motion.p>

          <motion.div
            style={{ display: "flex", gap: 8, flexWrap: "wrap" }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.55,
              delay: 2.3,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <motion.button
              onClick={() => setIsBookingModalOpen(true)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#016abaff",
                color: "#fff",
                fontWeight: 600,
                fontSize: "0.88rem",
                letterSpacing: "0.01em",
                padding: isMobile ? "14px 30px" : "12px 26px",
                borderRadius: 8,
                border: "none",
                cursor: "pointer",
                textDecoration: "none",
                transition: "all 0.2s",
                transform: hoverStart ? "translateY(-1px)" : "translateY(0)",
                filter: hoverStart ? "brightness(1.10)" : "brightness(1)",
              }}
              onMouseEnter={() => setHoverStart(true)}
              onMouseLeave={() => setHoverStart(false)}
            >
              Get started free
            </motion.button>
            <Link
              href="/works"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                color: hoverWork
                  ? "rgba(255,255,255,0.9)"
                  : "rgba(255,255,255,0.55)",
                fontSize: "0.88rem",
                padding: isMobile ? "14px 20px" : "12px 18px",
                borderRadius: 8,
                textDecoration: "none",
                transition: "color 0.2s",
              }}
              onMouseEnter={() => setHoverWork(true)}
              onMouseLeave={() => setHoverWork(false)}
            >
              See our work →
            </Link>
          </motion.div>
        </div>

        {/* RIGHT — Phone mockup */}
        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="hidden md:block"
        >
          <PhoneMockup />
        </motion.div>
      </div>
    </section>
  );
}
