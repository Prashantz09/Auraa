const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
  theme: {
    extend: {
      animation: {
        "testimonial-scroll": "testimonial-scroll 40s linear infinite",
      },
      keyframes: {
        "testimonial-scroll": {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
      },
    },
  },
};

export default config;
