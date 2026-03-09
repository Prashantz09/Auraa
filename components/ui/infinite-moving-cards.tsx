"use client";

import { cn } from "@/app/lib/utils";
import React, { useEffect, useRef, useState } from "react";

// Updated: added animationDelay prop for staggered scroll start

export const InfiniteMovingCards = ({
  items,
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  className,
  renderItem,
}: {
  items: any[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
  renderItem?: (item: any, idx?: number) => React.ReactNode;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLUListElement>(null);
  const [start, setStart] = useState(false);

  useEffect(() => {
    if (!containerRef.current || !scrollerRef.current) return;

    // Direction
    containerRef.current.style.setProperty(
      "--animation-direction",
      direction === "left" ? "forwards" : "reverse"
    );

    // Speed
    const durations = { fast: "20s", normal: "40s", slow: "80s" };
    containerRef.current.style.setProperty(
      "--animation-duration",
      durations[speed]
    );

    setStart(true);
  }, [items, direction, speed]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "scroller relative z-20 max-w-7xl overflow-hidden",
        className, // ← className (e.g. h-[200px]) now actually controls height
      )}
      style={{
        // REMOVED hardcoded height:"700px" — was overriding className
        maskImage:
          "linear-gradient(to right, transparent, white 20%, white 80%, transparent)",
      }}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          "flex w-max min-w-full shrink-0 flex-nowrap py-4 h-full",
          start &&
          (direction === "left"
            ? "animate-scroll"
            : "animate-scroll-reverse"),
          pauseOnHover && "hover:[animation-play-state:paused]",
        )}
      >
        {[...items, ...items].map((item, idx) => (
          <li
            key={idx}
            className={cn(
              "relative shrink-0 rounded-2xl overflow-hidden mr-4",
            )}
          >
            {renderItem ? (
              renderItem(item)
            ) : (
              <div
                className={cn(
                  direction === "left"
                    ? "w-[280px] md:w-[384px] aspect-video"
                    : "w-[200px] md:w-[270px] aspect-[9/16]",
                )}
              >
                <img
                  src={item.image}
                  alt={`Project ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export const InfiniteMovingCardsVertical = ({
  items,
  speed = "fast",
  pauseOnHover = true,
  className,
  renderItem,
}: {
  items: {
    image: string;
    name: string;
    review: string;
    rating: number;
  }[];
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
  renderItem?: (item: any) => React.ReactNode;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLUListElement>(null);
  const [start, setStart] = useState(false);

  useEffect(() => {
    if (!containerRef.current || !scrollerRef.current) return;

    // Speed
    const durations = { fast: "20s", normal: "40s", slow: "80s" };
    containerRef.current.style.setProperty(
      "--animation-duration",
      durations[speed]
    );

    setStart(true);
  }, [items, speed]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "scroller-vertical relative z-20 max-w-7xl overflow-hidden",
        className,
      )}
      style={{
        maskImage:
          "linear-gradient(to bottom, transparent, white 20%, white 80%, transparent)",
      }}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          "flex flex-col max-h-full shrink-0 py-4 w-full",
          start && "animate-scroll-vertical",
          pauseOnHover && "hover:[animation-play-state:paused]",
        )}
      >
        {[...items, ...items].map((item, idx) => (
          <li
            key={idx}
            className={cn(
              "relative shrink-0 rounded-2xl overflow-hidden mb-4",
            )}
          >
            {renderItem ? (
              renderItem(item)
            ) : (
              <div className="w-[200px] md:w-[270px] aspect-[9/16]">
                <img
                  src={item.image}
                  alt={`Project ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
