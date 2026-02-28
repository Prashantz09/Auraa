import Image from "next/image";

export default function LogoTopLeft() {
  return (
    <div
      style={{
        position: "fixed",        // stays in the corner on scroll
        top: 24,                  // a bit closer to the top
        left: 24,                 // a bit closer to the left
        zIndex: 50,
        display: "flex",
        alignItems: "center",
      }}
    >
      <div
        style={{
          position: "relative",
          width: 48,
          height: 48,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Glow */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "9999px",
            background:
              "radial-gradient(circle at center, rgba(59,130,246,0.6), rgba(15,23,42,0))",
            filter: "blur(10px)",
            zIndex: 0,
          }}
        />

        {/* Logo */}
        <Image
          src="/review_person_images/New_logo.png"
          alt="Logo"
          width={40}
          height={40}
          style={{
            position: "relative",
            zIndex: 2,
            objectFit: "contain",
          }}
          priority
        />
      </div>
    </div>
  );
}
