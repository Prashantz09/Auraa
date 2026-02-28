import React from "react";

const GlassCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onClick?: () => void;
}> = ({
  children,
  className = "",
  hoverEffect = true,
  onMouseEnter,
  onMouseLeave,
  onClick,
}) => (
  <div
    className={`
    relative overflow-hidden
    bg-gradient-to-br from-white/10 to-white/5 
    backdrop-blur-md border border-white/10 
    shadow-[0_0_20px_rgba(0,0,0,0.5)]
    ${hoverEffect ? "transition-all duration-500 hover:bg-white/15 hover:border-white/20 hover:shadow-[0_0_30px_rgba(255,255,255,0.1)]" : ""}
    ${className}
  `}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
    onClick={onClick}
  >
    <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
    {children}
  </div>
);

export default GlassCard;
