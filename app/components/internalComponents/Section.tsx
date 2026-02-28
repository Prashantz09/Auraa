import React from "react";

const Section: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = "",
}) => (
  <section
    className={`w-full flex flex-col justify-center items-center relative py-16 md:py-20 lg:py-24 px-4 md:px-8 lg:px-16 border-t border-white/10 ${className}`}
  >
    {children}
  </section>
);

export default Section;
