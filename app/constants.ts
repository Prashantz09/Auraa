"use client";
import { Play } from "@/components/animate-ui/icons/play";
import { Check, Zap, TrendingUp } from "lucide-react";
export interface Project {
  id: number;
  title: string;
  category: string;
  description: string;
  video: string;
  image: string;
  format: "horizontal" | "vertical";
}

export interface TeamMember {
  name: string;
  role: string;
  image: string;
}

export interface Service {
  title: string;
  subtitle: string;
  description: string;
  price: string;
  period: string;
  accent: string;
  icon: React.ReactNode | (() => React.ReactNode);
  features: string[];
  featured?: boolean;
}

export const PROJECTS: Project[] = [
  // HORIZONTAL PROJECTS
  {
    id: 1,
    title: "Niche With Dikshya",
    category: "System Architecture",
    description: "Podcast | Investment | Women Empowerment.",
    video:
      "https://res.cloudinary.com/dwpp9kkp3/video/upload/v1772269718/Niche_with_dikshya_xgcn8t.mp4",
    image: "/th1.png",
    format: "horizontal",
  },
  {
    id: 2,
    title: "NIK DHIMAL",
    category: "Quantum Finance",
    description: "Podcast | Motivation | Entrepreneur.",
    video:
      "https://res.cloudinary.com/dwpp9kkp3/video/upload/v1772272177/Nikxgaagan_pardan_utx241.mp4",
    image: "/th2.png",
    format: "horizontal",
  },
  {
    id: 3,
    title: "Karak With Mahreen",
    category: "Artificial Intelligence",
    description: "Podcast | Fun | Entrepreneur.",
    video:
      "https://res.cloudinary.com/dwpp9kkp3/video/upload/v1772272185/Kahareen_with_mahereen_uxj1py.mp4",
    image: "/th3.png",
    format: "horizontal",
  },
  {
    id: 4,
    title: "Rohan Dhawan",
    category: "Security",
    description: "Passion → Profit | Borderless Opportunities | Premium Skills",
    video:
      "https://res.cloudinary.com/dwpp9kkp3/video/upload/v1772270614/Four_gwdnpj.mp4",
    image: "/th4.png",
    format: "horizontal",
  },

  // VERTICAL PROJECTS
  {
    id: 5,
    title: "TALKING HEAD REELS",
    category: "Content Creation",
    description: "Next-gen ion thruster UI interfaces.",
    video:
      "https://res.cloudinary.com/dwpp9kkp3/video/upload/v1772270618/Kyle_Craichy_hgxe47.mp4",
    image: "/th5.jpg",
    format: "vertical",
  },
  {
    id: 6,
    title: "CAR REVIEWS",
    category: "Bio-Telemetry",
    description: "Real-time vitals monitoring for cryo-sleep pods.",
    video:
      "https://res.cloudinary.com/dwpp9kkp3/video/upload/v1772269717/READY_PORSCHE_xo0pjv.mp4", // ⏳ Replace with Cloudinary URL when ready
    image: "/th6.jpg",
    format: "vertical",
  },
  {
    id: 7,
    title: "PODCAST SHORTS",
    category: "Energy Systems",
    description: "Interplanetary power distribution network.",
    video:
      "https://res.cloudinary.com/dwpp9kkp3/video/upload/v1772272254/sevenn_ykfy5t.mp4",
    image: "/th7.jpg",
    format: "vertical",
  },
  {
    id: 8,
    title: "MOTION GRAPHIC REELS",
    category: "Interface Design",
    description: "Immersive control panels for space pilots.",
    video:
      "https://res.cloudinary.com/dwpp9kkp3/video/upload/v1772271260/Eight_acmjyu.mp4",
    image: "/th8.png",
    format: "vertical",
  },
  {
    id: 9,
    title: "PODCAST SHORTS",
    category: "Interface Design",
    description: "Immersive control panels for space pilots.",
    video:
      "https://res.cloudinary.com/dwpp9kkp3/video/upload/v1772281203/Raised_with_responsibility_guided_by_a_strong_mother_and_shaped_by_early_maturity._nischewithd_nbobjt.mp4",
    image: "/kok.jpg",
    format: "vertical",
  },
];

export const SERVICES = [
  {
    title: "BRONZE",
    subtitle: "PLAN",
    description:
      "Essential podcast editing for consistent, professional uploads.",
    price: "$499",
    period: "/month",
    accent: "#6ee7b7",
    icon: Zap,
    features: [
      "4 Podcast Episodes (Up to 60 mins)",
      "Multi-Camera Editing",
      "Clean Cuts & Smooth Transitions",
      "Basic Color Correction",
      "Audio Enhancement",
      "4 Short-Form Clips",
      "2 Revisions per Episode",
      "5 Day Delivery",
    ],
  },
  {
    title: "GOLD",
    subtitle: "PLAN · MOST POPULAR",
    description:
      "Complete Podcast Growth & Content Repurposing System designed to maximize reach and authority.",
    price: "$999",
    period: "/month",
    accent: "#f9a8d4",
    icon: Zap,
    featured: true,
    features: [
      "8 Podcast Episodes (Up to 60 mins)",
      "High-End Multi-Cam Editing",
      "Advanced Color Grading",
      "Professional Sound Design & Mixing",
      "Motion Graphics & Branding Elements",
      "20 Short-Form Clips (Reels/Shorts)",
      "Custom YouTube Thumbnails",
      "YouTube SEO Optimization",
      "Unlimited Revisions",
      "72-Hour Priority Delivery",
    ],
  },
  {
    title: "SILVER",
    subtitle: "PLAN",
    description:
      "Advanced editing support for creators scaling their content and audience.",
    price: "$799",
    period: "/month",
    accent: "#a5b4fc",
    icon: TrendingUp,
    features: [
      "6 Podcast Episodes",
      "Advanced Editing & Transitions",
      "Professional Color Grading",
      "Sound Design & Audio Mixing",
      "10 Short-Form Clips",
      "Custom Thumbnails",
      "3 Revisions per Episode",
      "3 Day Delivery",
    ],
  },
];

export const TESTIMONIALS = [
  {
    image: "/review_person_images/Dikshya_Limbu.jpeg",
    name: "Dikshya Limbu",
    review: "Perfect!! I love ittt",
    rating: 5,
  },
  {
    image: "/review_person_images/Saigrace.jpeg",
    name: "Saigrace Pokharel",
    review: "Greattt Love This",
    rating: 5,
  },
  {
    image: "/review_person_images/Sudikshya.png",
    name: "Sudikshya Shrestha",
    review: "I love the edit 🙌🙌🙌",
    rating: 5,
  },
  {
    image: "/review_person_images/Mahreen.png",
    name: "Mahreen Munir",
    review: "As Always team ❤️❤️",
    rating: 5,
  },
  {
    image: "/review_person_images/Rohan.png",
    name: "Rohan Dhawan",
    review: "Intro was 🔥🔥",
    rating: 5,
  },
  {
    image: "/review_person_images/jivraj.png",
    name: "Jivraj Singh Sachar",
    review: "Crazy output love it!!!",
    rating: 5,
  },
  {
    image: "/review_person_images/NIK.png",
    name: "Nik Dhimal",
    review: "Great!!",
    rating: 4,
  },
  {
    image: "/review_person_images/kyle.png",
    name: "Kyle Craichy",
    review: "Lovely man, This was the best edit I have seen!",
    rating: 5,
  },
];

export const TEAM: TeamMember[] = [
  {
    name: "Bishal",
    role: "Senior Editor",
    image: "/review_person_images/Bisha01.jpg",
  },
  {
    name: "Nishan",
    role: "Senior Editor",
    image: "/review_person_images/Nishan01.jpg",
  },
  {
    name: "Prash",
    role: "Founder",
    image: "/review_person_images/BIG.jpg",
  },
  {
    name: "Radha",
    role: "Media Manager",
    image: "/teams/Radha.png",
  },
  {
    name: "Samrat",
    role: "Web Developer",
    image: "/teams/Samrat.png",
  },
];
