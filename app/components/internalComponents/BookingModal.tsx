"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Mail,
  ChevronLeft,
  ChevronRight,
  Check,
  Loader2,
  Smartphone,
  MonitorPlay,
  Mic,
  Image as ImageIcon,
  Film,
  Calendar as CalendarIcon,
  Clock,
} from "lucide-react";

// ── Constants ─────────────────────────────────────────────────────────────────

const SERVICES = [
  {
    id: "horizontal",
    label: "Horizontal Video",
    sub: "YouTube / Long-form",
    icon: <MonitorPlay size={16} />,
  },
  {
    id: "vertical",
    label: "Vertical / Shorts",
    sub: "Reels / TikTok",
    icon: <Smartphone size={16} />,
  },
  {
    id: "podcast",
    label: "Podcast Production",
    sub: "Audio & Video",
    icon: <Mic size={16} />,
  },
  {
    id: "thumbnail",
    label: "Thumbnail Design",
    sub: "High CTR Designs",
    icon: <ImageIcon size={16} />,
  },
];

const SERVICE_MAP: Record<string, string> = {
  "Horizontal Video": "Horizontal Video Editing",
  "Vertical / Shorts": "Short-form Content Editing",
  "Podcast Production": "Podcast Production",
  "Thumbnail Design": "Thumbnail Design",
};

const TIME_SLOTS = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
];

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function to12Hour(t: string) {
  const [h, m] = t.split(":").map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
}

function toDateStr(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

// ── Types ─────────────────────────────────────────────────────────────────────
interface Form {
  name: string;
  email: string;
  service: string;
  date: string;
  time: string;
  message: string;
}

type Step = "service" | "datetime" | "details" | "success";

// ── Main Component ────────────────────────────────────────────────────────────
export default function BookingModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [step, setStep] = useState<Step>("service");
  const [form, setForm] = useState<Form>({
    name: "",
    email: "",
    service: "",
    date: "",
    time: "",
    message: "",
  });
  const [calDate, setCalDate] = useState(new Date());
  const [bookedTimes, setBookedTimes] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const overlayRef = useRef<HTMLDivElement>(null);

  // Reset on open
  useEffect(() => {
    if (open) {
      setStep("service");
      setForm({
        name: "",
        email: "",
        service: "",
        date: "",
        time: "",
        message: "",
      });
      setError("");
    }
  }, [open]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Fetch booked slots
  useEffect(() => {
    if (!form.date) return;
    fetch(`/api/bookings?date=${form.date}`)
      .then((r) => r.json())
      .then((d) => setBookedTimes(d.bookedTimes ?? []))
      .catch(() => setBookedTimes([]));
  }, [form.date]);

  // Calendar helpers
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const calYear = calDate.getFullYear();
  const calMonth = calDate.getMonth();
  const firstDay = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const calCells = Array.from({ length: firstDay + daysInMonth }, (_, i) =>
    i < firstDay ? null : i - firstDay + 1,
  );

  function selectDay(day: number) {
    const d = new Date(calYear, calMonth, day);
    if (d < today || d.getDay() === 0 || d.getDay() === 6) return;
    setForm((f) => ({ ...f, date: toDateStr(d), time: "" }));
  }

  function isDayDisabled(day: number) {
    const d = new Date(calYear, calMonth, day);
    return d < today || d.getDay() === 0 || d.getDay() === 6;
  }

  // Submit
  async function handleSubmit() {
    setError("");
    if (!form.name.trim() || !form.email.trim()) {
      setError("Please fill in your name and email.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          service: SERVICE_MAP[form.service] ?? form.service,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to save booking.");
        return;
      }
      setStep("success");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (typeof window === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          ref={overlayRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => {
            if (e.target === overlayRef.current) onClose();
          }}
          className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6"
          style={{
            background: "rgba(0,0,0,0.85)",
            backdropFilter: "blur(8px)",
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl"
            style={{
              background: "linear-gradient(180deg, #02040a 0%, #0f172a 100%)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.8)",
            }}
          >
            {/* Top accent glow */}
            <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent opacity-50" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full flex items-center justify-center text-white/20 hover:text-white hover:bg-white/10 transition-all"
            >
              <X size={16} />
            </button>

            <div className="p-6 md:p-8">
              {/* ── STEP: SERVICE ─────────────────────────────────────────── */}
              {step === "service" && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mb-6">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-400 mb-2">
                      Start Here
                    </p>
                    <h2 className="text-2xl font-light text-white tracking-tight mb-1">
                      Select Project Type
                    </h2>
                    <p className="text-xs text-slate-400 font-light">
                      Choose the editing service you need.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {SERVICES.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => {
                          setForm((f) => ({ ...f, service: s.label }));
                          setStep("datetime");
                        }}
                        className="
                          group relative flex flex-col p-4
                          rounded-xl border text-left transition-all duration-300
                          bg-[#0b1121] border-white/[0.05]
                          hover:border-indigo-500/40 hover:bg-[#12192e]
                        "
                      >
                        <div className="flex items-start justify-between w-full mb-2">
                          <div
                            className="
                            w-8 h-8 rounded-lg flex items-center justify-center
                            text-indigo-400 bg-indigo-500/10 border border-indigo-500/10
                            group-hover:bg-indigo-500 group-hover:text-white group-hover:border-indigo-400
                            transition-all duration-300
                          "
                          >
                            {s.icon}
                          </div>
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity text-indigo-400">
                            <ChevronRight size={14} />
                          </div>
                        </div>

                        <span className="text-white text-sm font-medium tracking-wide mb-0.5">
                          {s.label}
                        </span>
                        <span className="text-slate-500 text-[10px] group-hover:text-slate-400 transition-colors">
                          {s.sub}
                        </span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* ── STEP: DATE + TIME (COMPACT) ───────────────────────────── */}
              {step === "datetime" && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <button
                    onClick={() => setStep("service")}
                    className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500 hover:text-white mb-5 transition-colors"
                  >
                    <ChevronLeft size={12} /> Back
                  </button>

                  <div className="mb-5 flex items-end justify-between">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-400 mb-1">
                        Schedule
                      </p>
                      <h2 className="text-xl font-light text-white">
                        Date & Time
                      </h2>
                    </div>
                    {/* Compact pill showing current service */}
                    <div className="hidden sm:block text-[10px] px-2 py-1 rounded border border-white/10 text-slate-400">
                      {form.service}
                    </div>
                  </div>

                  {/* Compact Side-by-Side Container */}
                  <div className="flex flex-col md:flex-row gap-4 h-[340px] md:h-[280px]">
                    {/* Calendar - Left Side */}
                    <div className="flex-1 bg-[#0b1121] border border-white/[0.08] rounded-2xl p-4 flex flex-col">
                      <div className="flex items-center justify-between mb-3">
                        <button
                          onClick={() =>
                            setCalDate(new Date(calYear, calMonth - 1, 1))
                          }
                          className="w-6 h-6 rounded flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 transition-all"
                        >
                          <ChevronLeft size={14} />
                        </button>
                        <span className="text-xs font-semibold text-white tracking-widest uppercase">
                          {MONTHS[calMonth]} {calYear}
                        </span>
                        <button
                          onClick={() =>
                            setCalDate(new Date(calYear, calMonth + 1, 1))
                          }
                          className="w-6 h-6 rounded flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 transition-all"
                        >
                          <ChevronRight size={14} />
                        </button>
                      </div>

                      {/* Days Header */}
                      <div className="grid grid-cols-7 mb-2">
                        {DAYS.map((d) => (
                          <div
                            key={d}
                            className="text-center text-[9px] font-bold text-slate-600 uppercase"
                          >
                            {d}
                          </div>
                        ))}
                      </div>

                      {/* Days Grid */}
                      <div className="grid grid-cols-7 gap-y-1 gap-x-0 flex-1 content-start">
                        {calCells.map((day, i) => {
                          if (!day) return <div key={i} />;
                          const disabled = isDayDisabled(day);
                          const dateStr = toDateStr(
                            new Date(calYear, calMonth, day),
                          );
                          const selected = form.date === dateStr;
                          return (
                            <div key={i} className="flex justify-center">
                              <button
                                disabled={disabled}
                                onClick={() => selectDay(day)}
                                className={`
                                  w-7 h-7 rounded-full text-[11px] font-medium transition-all duration-200 flex items-center justify-center
                                  ${
                                    disabled
                                      ? "text-white/5 cursor-not-allowed"
                                      : selected
                                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/50"
                                        : "text-slate-400 hover:bg-white/10 hover:text-white"
                                  }
                                `}
                              >
                                {day}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Time Slots - Right Side */}
                    <div className="w-full md:w-[200px] bg-[#0b1121] border border-white/[0.08] rounded-2xl p-4 flex flex-col">
                      <div className="flex items-center gap-2 mb-3 pb-3 border-b border-white/[0.05]">
                        <Clock size={12} className="text-indigo-400" />
                        <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                          {form.date
                            ? new Date(
                                form.date + "T00:00:00",
                              ).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })
                            : "Availability"}
                        </p>
                      </div>

                      {!form.date ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-600 gap-2">
                          <CalendarIcon size={20} className="opacity-20" />
                          <span className="text-[10px]">Select a date</span>
                        </div>
                      ) : (
                        // Tighter Grid for Time Slots (3 columns on desktop)
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-2 lg:grid-cols-3 gap-1.5 overflow-y-auto pr-1 custom-scrollbar">
                          {TIME_SLOTS.map((slot) => {
                            const booked = bookedTimes.includes(slot);
                            const selected = form.time === slot;
                            return (
                              <button
                                key={slot}
                                disabled={booked}
                                onClick={() =>
                                  setForm((f) => ({ ...f, time: slot }))
                                }
                                className={`
                                  py-1.5 px-1 rounded-md text-[10px] font-medium transition-all border
                                  ${
                                    booked
                                      ? "text-white/10 border-transparent bg-white/[0.02] line-through cursor-not-allowed"
                                      : selected
                                        ? "bg-indigo-600 border-indigo-500 text-white shadow"
                                        : "text-slate-300 border-white/5 hover:border-indigo-500/30 hover:bg-indigo-500/10 hover:text-white"
                                  }
                                `}
                              >
                                {to12Hour(slot)}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    disabled={!form.date || !form.time}
                    onClick={() => setStep("details")}
                    className="
                      mt-5 w-full py-3 rounded-xl text-xs font-bold tracking-wide uppercase
                      transition-all duration-200
                      disabled:opacity-30 disabled:cursor-not-allowed
                      bg-white text-black hover:bg-indigo-50
                      shadow-[0_0_15px_rgba(255,255,255,0.05)]
                    "
                  >
                    Continue
                  </button>
                </motion.div>
              )}

              {/* ── STEP: DETAILS ─────────────────────────────────────────── */}
              {step === "details" && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <button
                    onClick={() => setStep("datetime")}
                    className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500 hover:text-white mb-6 transition-colors"
                  >
                    <ChevronLeft size={12} /> Back
                  </button>

                  <div className="mb-6">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-400 mb-2">
                      Final Step
                    </p>
                    <h2 className="text-xl font-light text-white mb-1">
                      Your Details
                    </h2>
                  </div>

                  {/* Summary Pills */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {[
                      { icon: <Film size={12} />, val: form.service },
                      {
                        icon: null,
                        val:
                          form.date &&
                          new Date(form.date + "T00:00:00").toLocaleDateString(
                            "en-US",
                            { month: "short", day: "numeric" },
                          ),
                      },
                      { icon: null, val: form.time && to12Hour(form.time) },
                    ]
                      .filter((x) => x.val)
                      .map((item, i) => (
                        <span
                          key={i}
                          className="flex items-center gap-2 text-[11px] font-medium px-2.5 py-1 rounded bg-indigo-900/20 border border-indigo-500/20 text-indigo-200"
                        >
                          {item.icon}
                          {item.val}
                        </span>
                      ))}
                  </div>

                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="First Name"
                        value={form.name}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, name: e.target.value }))
                        }
                        className="
                          w-full bg-[#0b1121] border border-white/10
                          rounded-lg px-3 py-2.5 text-xs text-white
                          placeholder:text-slate-600
                          focus:outline-none focus:border-indigo-500/50 focus:bg-[#12192e]
                          transition-all
                        "
                      />
                      <input
                        type="email"
                        placeholder="Email Address"
                        value={form.email}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, email: e.target.value }))
                        }
                        className="
                          w-full bg-[#0b1121] border border-white/10
                          rounded-lg px-3 py-2.5 text-xs text-white
                          placeholder:text-slate-600
                          focus:outline-none focus:border-indigo-500/50 focus:bg-[#12192e]
                          transition-all
                        "
                      />
                    </div>

                    <textarea
                      rows={3}
                      placeholder="Project details..."
                      value={form.message}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, message: e.target.value }))
                      }
                      className="
                        w-full bg-[#0b1121] border border-white/10
                        rounded-lg px-3 py-2.5 text-xs text-white
                        placeholder:text-slate-600 resize-none
                        focus:outline-none focus:border-indigo-500/50 focus:bg-[#12192e]
                        transition-all
                      "
                    />
                  </div>

                  {error && (
                    <div className="mt-4 px-3 py-2 rounded bg-red-500/10 border border-red-500/20 text-red-400 text-[11px] font-medium">
                      {error}
                    </div>
                  )}

                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="
                      mt-5 w-full py-3 rounded-xl text-xs font-bold tracking-wide uppercase
                      flex items-center justify-center gap-2
                      bg-indigo-600 hover:bg-indigo-500 text-white
                      shadow-lg shadow-indigo-900/40
                      disabled:opacity-50 disabled:cursor-not-allowed
                      transition-all duration-200
                    "
                  >
                    {submitting ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />{" "}
                        Processing
                      </>
                    ) : (
                      "Confirm Booking"
                    )}
                  </button>
                </motion.div>
              )}

              {/* ── STEP: SUCCESS ─────────────────────────────────────────── */}
              {step === "success" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="py-8 text-center"
                >
                  <div
                    className="
                    w-20 h-20 mx-auto mb-4 rounded-full
                    bg-green-500/10 border border-green-500/20
                    flex items-center justify-center
                    text-green-400
                  "
                  >
                    <Check size={32} strokeWidth={1.5} />
                  </div>

                  <h2 className="text-xl font-light text-white mb-2">
                    Booking Confirmed
                  </h2>
                  <p className="text-xs text-slate-400 mb-6 max-w-[240px] mx-auto leading-relaxed">
                    Check your inbox at{" "}
                    <span className="text-white font-medium">{form.email}</span>{" "}
                    for details.
                  </p>

                  <button
                    onClick={onClose}
                    className="px-8 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-white text-black hover:bg-indigo-50 transition-all"
                  >
                    Close
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
