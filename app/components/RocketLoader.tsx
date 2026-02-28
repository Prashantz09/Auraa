// "use client";

// import { useEffect, useRef, useState } from "react";
// import { gsap } from "gsap";

// interface RocketLoaderProps {
//   children: React.ReactNode;
// }

// export default function RocketLoader({ children }: RocketLoaderProps) {
//   const loaderRef = useRef<HTMLDivElement>(null);
//   const contentRef = useRef<HTMLDivElement>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     console.log("RocketLoader useEffect triggered");

//     const loader = loaderRef.current;
//     const content = contentRef.current;

//     if (!loader || !content) {
//       console.log("Refs not ready");
//       return;
//     }

//     console.log("Starting loader animation");

//     // Simple fade out animation
//     setTimeout(() => {
//       gsap.to(loader, {
//         opacity: 0,
//         duration: 1,
//         onComplete: () => {
//           setLoading(false);
//           gsap.to(content, { opacity: 1, duration: 1 });
//         },
//       });
//     }, 2000); // Show for 2 seconds
//   }, []);

//   return (
//     <>
//       {loading && (
//         <div
//           ref={loaderRef}
//           style={{
//             position: "fixed",
//             inset: 0,
//             background: "#000000",
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//             overflow: "hidden",
//             zIndex: 9999,
//           }}
//         >
//           <div
//             style={{
//               fontSize: "2rem",
//               color: "white",
//               fontWeight: "bold",
//             }}
//           >
//             🚀 Loading...
//           </div>
//         </div>
//       )}

//       {/* Main Website Content */}
//       <div
//         ref={contentRef}
//         style={{
//           opacity: 0,
//         }}
//       >
//         {children}
//       </div>
//     </>
//   );
// }
