"use client";
import Section from "./internalComponents/Section";
import PricingFlipCards from "./internalComponents/PricingFlipCards";

const FourthServiceSection = () => {
  return (
    // ✅ Removed overflow-hidden and min-h — let PricingFlipCards control its own height
    <Section className="w-full flex flex-col items-center">
      <div className="w-full max-w-[1400px] overflow-x-hidden">
        <PricingFlipCards />
      </div>
    </Section>
  );
};

export default FourthServiceSection;
