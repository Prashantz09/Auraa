"use client";
import { motion } from "framer-motion";
import React, { useState } from "react";
import Section from "./internalComponents/Section";
import emailjs from "@emailjs/browser";
import {
  Link,
  Play,
  AlertCircle,
  CheckCircle,
  User,
  Mail,
  FileText,
  Send,
} from "lucide-react";

const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!;
const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!;
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!;

interface FormData {
  fullName: string;
  email: string;
  videoUrl: string;
  notes: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  videoUrl?: string;
  notes?: string;
}

const FifthAiImageSection = () => {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    videoUrl: "",
    notes: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sendError, setSendError] = useState("");

  const validateUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const validateEmail = (email: string): boolean =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (formData.videoUrl && !validateUrl(formData.videoUrl)) {
      newErrors.videoUrl = "Invalid URL";
    }
    if (!formData.notes.trim()) newErrors.notes = "Please add instructions";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setSendError("");
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name: formData.fullName,
          from_email: formData.email,
          video_url: formData.videoUrl || "No link",
          notes: formData.notes,
        },
        EMAILJS_PUBLIC_KEY,
      );
      setIsSubmitted(true);
    } catch {
      setSendError("Something went wrong. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // FIX: Adjusted padding to work with Section component's base padding
    <Section className="relative w-full bg-[#050508] overflow-hidden py-8 md:py-12 lg:py-16">
      {/* Ambient background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-white/5 blur-[140px] rounded-full" />
      </div>

      <div className="w-full max-w-7xl mx-auto relative z-10">
        <div className="grid md:grid-cols-2 gap-8 sm:gap-12 md:gap-16 lg:gap-20 items-start">
          {/* ── LEFT SIDE — VIDEO ─────────────────────────── */}
          <div>
            <div className="mb-6 sm:mb-8 md:mb-10">
              <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-full bg-gradient-to-b from-white/10 to-white/5 border border-white/10 flex items-center justify-center">
                  <Play className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white/90" />
                </div>
                <span className="text-white/90 tracking-[0.2em] sm:tracking-[0.25em] lg:tracking-[0.35em] text-xs sm:text-sm uppercase">
                  Instruction Video
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light text-white leading-tight tracking-wide">
                How To Submit Your Project
              </h2>

              <p className="text-white/60 mt-3 sm:mt-4 max-w-lg text-sm sm:text-base leading-relaxed">
                Follow these simple steps before submitting your footage. Watch
                carefully and prepare everything properly.
              </p>
            </div>

            {/* Video Card */}
            <div className="relative rounded-xl sm:rounded-2xl lg:rounded-3xl p-3 sm:p-4 lg:p-6 bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/10 backdrop-blur-2xl shadow-[0_0_80px_rgba(255,255,255,0.03)] overflow-hidden">
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-32 sm:-top-40 left-1/2 -translate-x-1/2 w-[400px] sm:w-[500px] lg:w-[600px] h-[300px] sm:h-[350px] lg:h-[400px] bg-white/5 blur-[80px] sm:blur-[100px] lg:blur-[120px] rounded-full" />
              </div>

              <div className="relative z-10">
                <video
                  src="https://res.cloudinary.com/dwpp9kkp3/video/upload/v1772271261/Howto_tclofw.mp4"
                  controls
                  className="w-full rounded-lg sm:rounded-xl lg:rounded-2xl border border-white/10"
                />
              </div>

              <div className="relative z-10 mt-3 sm:mt-4 lg:mt-6 space-y-1 sm:space-y-1.5 lg:space-y-2 text-white/60 text-xs sm:text-sm leading-relaxed">
                <p>Step 1: Watch the full instruction video</p>
                <p>Step 2: Prepare your raw footage</p>
                <p>Step 3: Fill the submission form</p>
              </div>
            </div>
          </div>

          {/* ── RIGHT SIDE — FORM ─────────────────────────── */}
          <div>
            <div className="mb-6 sm:mb-8 md:mb-10">
              <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-full bg-gradient-to-b from-white/10 to-white/5 border border-white/10 flex items-center justify-center">
                  <Play className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white/90" />
                </div>
                <span className="text-white/90 tracking-[0.2em] sm:tracking-[0.25em] lg:tracking-[0.35em] text-xs sm:text-sm uppercase">
                  Video Submission
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light text-white leading-tight tracking-wide">
                Submit Your Raw Footage
              </h2>

              <p className="text-white/60 mt-3 sm:mt-4 max-w-lg text-sm sm:text-base leading-relaxed">
                Upload your footage and provide clear instructions. Our team
                will professionally edit your content based on your vision in 48
                hours.
              </p>
            </div>

            {/* Form Card */}
            <div className="relative rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/10 backdrop-blur-2xl shadow-[0_0_80px_rgba(255,255,255,0.03)] overflow-hidden">
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-32 sm:-top-40 left-1/2 -translate-x-1/2 w-[400px] sm:w-[500px] lg:w-[600px] h-[300px] sm:h-[350px] lg:h-[400px] bg-white/5 blur-[80px] sm:blur-[100px] lg:blur-[120px] rounded-full" />
              </div>

              {isSubmitted ? (
                <div className="text-center py-6 sm:py-8 lg:py-12">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 mx-auto rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4 sm:mb-6 lg:mb-8">
                    <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-white/90" />
                  </div>
                  <h3 className="text-lg sm:text-xl lg:text-2xl text-white font-light mb-2 sm:mb-3 lg:mb-4 tracking-wide">
                    Request Submitted
                  </h3>
                  <p className="text-white/60 text-xs sm:text-sm">
                    We will contact you within 24 hours.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="space-y-4 sm:space-y-5 lg:space-y-6 relative z-10"
                >
                  <InputField
                    label="Full Name"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    error={errors.fullName}
                    icon={<User className="w-4 h-4 text-white/40" />}
                  />
                  <InputField
                    label="Email Address"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={errors.email}
                    icon={<Mail className="w-4 h-4 text-white/40" />}
                  />
                  <InputField
                    label="Video Link"
                    name="videoUrl"
                    value={formData.videoUrl}
                    onChange={handleChange}
                    error={errors.videoUrl}
                    icon={<Link className="w-4 h-4 text-white/40" />}
                  />

                  <div>
                    <label className="text-[10px] sm:text-xs tracking-[0.3em] uppercase text-white/50">
                      Editing Instructions *
                    </label>
                    <div className="relative mt-2 sm:mt-3">
                      <FileText className="absolute top-3 sm:top-3.5 lg:top-4 left-3 sm:left-3.5 lg:left-4 w-4 h-4 text-white/40" />
                      <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        rows={4}
                        className="w-full pl-9 sm:pl-10 lg:pl-12 pr-3 sm:pr-4 lg:pr-5 py-3 sm:py-3.5 lg:py-4 bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/10 focus:border-white/25 rounded-lg sm:rounded-xl lg:rounded-2xl text-white text-sm backdrop-blur-xl outline-none transition-all duration-300 resize-none"
                      />
                    </div>
                    {errors.notes && (
                      <p className="text-red-400 text-xs mt-2">
                        {errors.notes}
                      </p>
                    )}
                  </div>

                  {sendError && (
                    <div className="flex items-center gap-2 text-red-400 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      {sendError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="group relative w-full py-3 sm:py-3.5 lg:py-4 rounded-full bg-gradient-to-b from-white/10 to-white/5 border border-white/15 text-white text-sm sm:text-base font-medium tracking-wider hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-3">
                      {isLoading ? "Sending..." : "Submit Project"}
                      {!isLoading && (
                        <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      )}
                    </span>
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r from-transparent via-white/10 to-transparent blur-xl" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};

const InputField = ({ label, name, value, onChange, error, icon }: any) => (
  <div>
    <label className="text-[10px] sm:text-xs tracking-[0.3em] uppercase text-white/50">
      {label} *
    </label>
    <div className="relative mt-2 sm:mt-3">
      {icon && (
        <div className="absolute top-1/2 -translate-y-1/2 left-3 sm:left-3.5 lg:left-4">
          {icon}
        </div>
      )}
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        className="w-full pl-9 sm:pl-10 lg:pl-12 pr-3 sm:pr-4 lg:pr-5 py-3 sm:py-3.5 lg:py-4 bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/10 focus:border-white/25 rounded-lg sm:rounded-xl lg:rounded-2xl text-white text-sm backdrop-blur-xl outline-none transition-all duration-300"
      />
      {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
    </div>
  </div>
);

export default FifthAiImageSection;
