"use client";

import { cn } from "@/app/lib/utils";
import { IconLayoutNavbarCollapse } from "@tabler/icons-react";
import {
  AnimatePresence,
  MotionValue,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import { createPortal } from "react-dom";
import { useEffect, useRef, useState } from "react";

interface DockItem {
  title: string;
  icon: React.ReactNode;
  href: string;
}

export const FloatingDock = ({
  items,
  side = "left",
  desktopClassName,
  mobileClassName,
  desktopHidden = false,
}: {
  items: DockItem[];
  side?: "left" | "right";
  desktopClassName?: string;
  mobileClassName?: string;
  desktopHidden?: boolean;
}) => {
  return (
    <>
      <AnimatePresence>
        {!desktopHidden && (
          <motion.div
            key="floating-dock-desktop"
            initial={{ opacity: 0, x: side === "left" ? -40 : 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: side === "left" ? -40 : 40 }}
            transition={{ duration: 0.35 }}
            className="hidden lg:block"
            style={{
              position: "fixed",
              top: "30%",
              transform: "translateY(-50%)",
              [side]: "20px",
              zIndex: 50,
            }}
          >
            <FloatingDockDesktop
              items={items}
              side={side}
              className={desktopClassName}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <FloatingDockMobile items={items} className={mobileClassName} />
    </>
  );
};

const FloatingDockMobile = ({
  items,
  className,
}: {
  items: DockItem[];
  className?: string;
}) => {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.65)",
              backdropFilter: "blur(6px)",
              WebkitBackdropFilter: "blur(6px)",
              zIndex: 999,
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-menu-items"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={{
              visible: { transition: { staggerChildren: 0.06 } },
              hidden: {},
            }}
            style={{
              position: "fixed",
              bottom: "100px",
              right: "24px",
              zIndex: 1001,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: "10px",
            }}
          >
            {items.map((item) => (
              <motion.div
                key={item.title}
                variants={{
                  hidden: { opacity: 0, y: 12, scale: 0.9 },
                  visible: { opacity: 1, y: 0, scale: 1 },
                }}
                transition={{ duration: 0.25 }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 500,
                    color: "white",
                    background: "rgba(12,12,12,0.95)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    padding: "4px 12px",
                    borderRadius: 999,
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.title}
                </span>

                <a
                  href={item.href}
                  onClick={() => setOpen(false)}
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    background: "rgba(18,18,18,0.98)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 4px 24px rgba(0,0,0,0.6)",
                    color: "white",
                  }}
                >
                  <div style={{ width: 18, height: 18 }}>{item.icon}</div>
                </a>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className={cn("lg:hidden", className)}
        style={{
          position: "fixed",
          bottom: "28px",
          right: "24px",
          zIndex: 1000,
        }}
      >
        <button
          onClick={() => setOpen((prev) => !prev)}
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            background: "rgba(18,18,18,0.98)",
            border: "1px solid rgba(255,255,255,0.14)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 8px 32px rgba(0,0,0,0.7)",
            cursor: "pointer",
            color: "white",
          }}
        >
          <motion.div animate={{ rotate: open ? 180 : 0 }}>
            <IconLayoutNavbarCollapse size={24} />
          </motion.div>
        </button>
      </div>
    </>,
    document.body,
  );
};

const FloatingDockDesktop = ({
  items,
  side,
  className,
}: {
  items: DockItem[];
  side: "left" | "right";
  className?: string;
}) => {
  let mouseY = useMotionValue(Infinity);

  return (
    <motion.div
      onMouseMove={(e) => mouseY.set(e.pageY)}
      onMouseLeave={() => mouseY.set(Infinity)}
      className={cn("flex flex-col items-center gap-4 py-4 px-3", className)}
    >
      {items.map((item) => (
        <IconContainer mouseY={mouseY} key={item.title} side={side} {...item} />
      ))}
    </motion.div>
  );
};

function IconContainer({
  mouseY,
  title,
  icon,
  href,
  side,
}: {
  mouseY: MotionValue;
  title: string;
  icon: React.ReactNode;
  href: string;
  side: "left" | "right";
}) {
  let ref = useRef<HTMLDivElement>(null);

  let distance = useTransform(mouseY, (val) => {
    let bounds = ref.current?.getBoundingClientRect() ?? { y: 0, height: 0 };
    return val - bounds.y - bounds.height / 2;
  });

  let width = useSpring(useTransform(distance, [-150, 0, 150], [40, 80, 40]));
  let height = useSpring(useTransform(distance, [-150, 0, 150], [40, 80, 40]));
  let widthIcon = useSpring(
    useTransform(distance, [-150, 0, 150], [20, 40, 20]),
  );
  let heightIcon = useSpring(
    useTransform(distance, [-150, 0, 150], [20, 40, 20]),
  );

  const [hovered, setHovered] = useState(false);
  const tooltipSide = side === "left" ? "left-full ml-3" : "right-full mr-3";

  return (
    <a href={href}>
      <motion.div
        ref={ref}
        style={{ width, height }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="relative flex aspect-square items-center justify-center rounded-full bg-white/5 border border-white/10"
      >
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={cn(
                "absolute top-1/2 -translate-y-1/2 px-2 py-0.5 text-xs bg-black text-white rounded",
                tooltipSide,
              )}
            >
              {title}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          style={{ width: widthIcon, height: heightIcon }}
          className="flex items-center justify-center"
        >
          {icon}
        </motion.div>
      </motion.div>
    </a>
  );
}
