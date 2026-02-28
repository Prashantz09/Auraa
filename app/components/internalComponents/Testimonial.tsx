"use client";

interface TestimonialCardProps {
  image: string;
  name: string;
  review: string;
  rating?: number;
}

const TestimonialCard = ({
  image,
  name,
  review,
  rating = 5,
}: TestimonialCardProps) => {
  return (
    <div className="w-[320px] mx-4 flex-shrink-0">
      <div
        className="
          relative
          bg-[#0a0a0f]
          border border-white/[0.06]
          rounded-2xl p-6
          transition-all duration-300
          hover:border-indigo-500/20
          hover:bg-[#0d0d18]
          group
        "
      >
        {/* Glow */}
        <div
          className="
          absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100
          transition-opacity duration-300 pointer-events-none
          bg-[radial-gradient(ellipse_at_top_left,rgba(79,70,229,0.05),transparent_60%)]
        "
        />

        {/* Stars — filled vs empty based on rating */}
        <div className="flex gap-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className={`w-3.5 h-3.5 transition-colors ${
                i < rating ? "text-indigo-400/80" : "text-white/10"
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>

        {/* Review */}
        <p className="text-white/50 text-sm leading-relaxed mb-6 italic">
          &ldquo;{review}&rdquo;
        </p>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent mb-5" />

        {/* Author */}
        <div className="flex items-center gap-3">
          <div className="relative flex-shrink-0">
            <div className="w-10 h-10 rounded-full overflow-hidden ring-1 ring-indigo-500/20">
              <img
                src={image}
                alt={name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-indigo-500 rounded-full border-2 border-[#0a0a0f]" />
          </div>
          <div>
            <h4 className="text-white/85 text-sm font-semibold leading-tight">
              {name}
            </h4>
            <p className="text-indigo-400/50 text-xs mt-0.5">Verified Client</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
