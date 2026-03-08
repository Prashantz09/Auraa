"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  X,
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
  Zap,
  Globe,
  ArrowRight,
  Sparkles,
  User,
  Mail,
  ShieldCheck,
} from "lucide-react";

/* ──────────────────────────────────────────────────────────────────────────────
   Types / Constants (Preserved)
────────────────────────────────────────────────────────────────────────────── */

type Step = "service" | "schedule" | "details" | "success";

interface FormState {
  name: string;
  email: string;
  service: string;
  date: string;
  time: string;
  message: string;
}

interface ServiceItem {
  id: string;
  label: string;
  sub: string;
  icon: ReactNode;
}

const SERVICES: ServiceItem[] = [
  {
    id: "horizontal",
    label: "Horizontal Video",
    sub: "YouTube / Docu-style",
    icon: <MonitorPlay size={20} />,
  },
  {
    id: "vertical",
    label: "Vertical / Shorts",
    sub: "Reels / TikTok Ads",
    icon: <Smartphone size={20} />,
  },
  {
    id: "podcast",
    label: "Podcast Production",
    sub: "Full A/V Pipeline",
    icon: <Mic size={20} />,
  },
  {
    id: "thumbnail",
    label: "Visual Strategy",
    sub: "Thumbnails & Branding",
    icon: <ImageIcon size={20} />,
  },
];

const SERVICE_MAP: Record<string, string> = {
  "Horizontal Video": "Horizontal Video Editing",
  "Vertical / Shorts": "Short-form Content Editing",
  "Podcast Production": "Podcast Production",
  "Visual Strategy": "Thumbnail Design",
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

const STEP_ORDER: Step[] = ["service", "schedule", "details", "success"];

const BENEFITS = [
  { icon: <Zap size={14} />, text: "30-min strategy deep dive" },
  { icon: <Globe size={14} />, text: "Scope & budget alignment" },
  { icon: <ShieldCheck size={14} />, text: "No-obligation proposal" },
];

/* ──────────────────────────────────────────────────────────────────────────────
   Helpers (Preserved)
────────────────────────────────────────────────────────────────────────────── */

function toDateStr(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;
}

function to12Hour(t: string) {
  const [h, m] = t.split(":").map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, "0")}${h >= 12 ? "pm" : "am"}`;
}

function formatDatePretty(dateStr: string) {
  const d = new Date(`${dateStr}T00:00:00`);
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function stepIndex(step: Step) {
  return STEP_ORDER.indexOf(step);
}

function isWeekend(d: Date) {
  const day = d.getDay();
  return day === 0 || day === 6;
}

function getCalendarCells(viewDate: Date) {
  const y = viewDate.getFullYear();
  const m = viewDate.getMonth();
  const first = new Date(y, m, 1).getDay();
  const daysInMonth = new Date(y, m + 1, 0).getDate();

  return Array.from({ length: 42 }, (_, i) => {
    const day = i - first + 1;
    if (day < 1 || day > daysInMonth) return null;
    return new Date(y, m, day);
  });
}

function getFocusableElements(root: HTMLElement | null) {
  if (!root) return [];
  return Array.from(
    root.querySelectorAll<HTMLElement>(
      'button:not([disabled]), [href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  );
}

function trapFocusOnTab(
  e: KeyboardEvent,
  containerRef: RefObject<HTMLDivElement | null>,
) {
  if (e.key !== "Tab") return;
  const focusables = getFocusableElements(containerRef.current);
  if (!focusables.length) return;

  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  const active = document.activeElement as HTMLElement | null;

  if (e.shiftKey && active === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && active === last) {
    e.preventDefault();
    first.focus();
  }
}

function nextBusinessDays(count: number, from: Date) {
  const out: Date[] = [];
  const d = new Date(from);
  d.setHours(0, 0, 0, 0);

  while (out.length < count) {
    if (!isWeekend(d)) out.push(new Date(d));
    d.setDate(d.getDate() + 1);
  }
  return out;
}

/* ──────────────────────────────────────────────────────────────────────────────
   UI Primitives (Refined)
────────────────────────────────────────────────────────────────────────────── */

function Stepper({ step }: { step: Step }) {
  if (step === "success") return null;
  const idx = stepIndex(step);
  const labels = ["Service", "Schedule", "Details"];

  return (
    <div className="flex w-full items-center justify-between gap-4 rounded-2xl border border-white/5 bg-black/20 p-4 backdrop-blur-md">
      {labels.map((label, i) => {
        const isActive = i === idx;
        const isCompleted = i < idx;

        return (
          <div key={label} className="relative flex flex-1 items-center gap-3">
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-bold transition-all duration-300 ${
                isCompleted
                  ? "bg-blue-500 text-white shadow-[0_0_15px_-3px_rgba(59,130,246,0.6)]"
                  : isActive
                    ? "border border-blue-400 text-blue-300 shadow-[0_0_15px_-3px_rgba(59,130,246,0.3)]"
                    : "border border-white/10 bg-white/5 text-slate-500"
              }`}
            >
              {isCompleted ? <Check size={14} strokeWidth={3} /> : i + 1}
            </div>

            <div className="flex flex-col">
              <span
                className={`text-[10px] font-bold uppercase tracking-widest ${
                  isActive || isCompleted ? "text-blue-100" : "text-slate-600"
                }`}
              >
                Step 0{i + 1}
              </span>
              <span
                className={`text-xs font-medium ${
                  isActive ? "text-white" : "text-slate-500"
                }`}
              >
                {label}
              </span>
            </div>

            {/* Connecting Line */}
            {i < labels.length - 1 && (
              <div className="absolute left-8 right-0 top-4 -z-10 mx-4 h-px bg-white/5">
                <motion.div
                  className="h-full bg-blue-500/50"
                  initial={{ width: "0%" }}
                  animate={{ width: isCompleted ? "100%" : "0%" }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  icon,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  icon?: ReactNode;
}) {
  const [focused, setFocused] = useState(false);
  const hasValue = value.length > 0;

  return (
    <div className="group relative">
      <div
        className={`pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${focused ? "text-blue-400" : "text-slate-500"}`}
      >
        {icon}
      </div>

      <input
        type={type}
        value={value}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={(e) => onChange(e.target.value)}
        className="peer h-14 w-full rounded-xl border border-white/10 bg-white/5 pl-12 pr-4 pt-4 text-sm font-medium text-white outline-none transition-all duration-200 placeholder:text-transparent hover:border-white/20 hover:bg-white/[0.07] focus:border-blue-500/50 focus:bg-blue-900/10 focus:ring-1 focus:ring-blue-500/50"
        placeholder={label}
      />

      <label
        className={`pointer-events-none absolute left-12 transition-all duration-200 ${
          focused || hasValue
            ? "top-2.5 text-[10px] font-bold uppercase tracking-widest text-blue-300"
            : "top-1/2 -translate-y-1/2 text-sm text-slate-400 group-hover:text-slate-300"
        }`}
      >
        {label}
      </label>
    </div>
  );
}

function Sidebar({ form, timezone }: { form: FormState; timezone: string }) {
  return (
    <div className="relative h-full overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.03] to-transparent p-6 shadow-2xl backdrop-blur-xl">
      {/* Decorative Glow */}
      <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-blue-500/20 blur-[60px]" />

      <div className="relative mb-8 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 text-lg font-bold text-white shadow-lg shadow-blue-500/30">
          A
        </div>
        <div>
          <p className="font-bold text-white">AURAA</p>
          <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
            Production Studio
          </p>
        </div>
      </div>

      <div className="mb-6 space-y-4">
        <h3 className="text-sm font-medium text-slate-400">Your Session</h3>
        <div className="space-y-3 rounded-xl border border-white/5 bg-black/20 p-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 text-blue-400">
              <Film size={14} />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-slate-500">
                Service
              </p>
              <p className="text-sm font-medium text-white">
                {form.service || "Not selected"}
              </p>
            </div>
          </div>

          <div className="h-px w-full bg-white/5" />

          <div className="flex items-start gap-3">
            <div className="mt-0.5 text-blue-400">
              <CalendarIcon size={14} />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-slate-500">
                Date
              </p>
              <p className="text-sm font-medium text-white">
                {form.date ? formatDatePretty(form.date) : "Not selected"}
              </p>
            </div>
          </div>

          <div className="h-px w-full bg-white/5" />

          <div className="flex items-start gap-3">
            <div className="mt-0.5 text-blue-400">
              <Clock size={14} />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-slate-500">
                Time
              </p>
              <p className="text-sm font-medium text-white">
                {form.time ? to12Hour(form.time) : "Not selected"}
                <span className="ml-1 text-[10px] text-slate-500">
                  ({timezone.split("/").pop()})
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {BENEFITS.map((b, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/10 text-blue-400">
              {b.icon}
            </div>
            <p className="text-xs font-medium text-slate-300">{b.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────────
   Main Component
────────────────────────────────────────────────────────────────────────────── */

export default function BookingModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<Step>("service");
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    service: "",
    date: "",
    time: "",
    message: "",
  });

  // State
  const [calendarViewDate, setCalendarViewDate] = useState(new Date());
  const [bookedTimes, setBookedTimes] = useState<string[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [autoPicked, setAutoPicked] = useState(false);

  // Refs
  const overlayRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const firstFocusRef = useRef<HTMLButtonElement>(null);

  // Memos
  const timezone = useMemo(
    () => Intl.DateTimeFormat().resolvedOptions().timeZone || "Local timezone",
    [],
  );

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const maxDate = useMemo(() => {
    const d = new Date(today);
    d.setDate(d.getDate() + 120);
    return d;
  }, [today]);

  const quickDates = useMemo(() => nextBusinessDays(3, today), [today]);
  const cells = useMemo(
    () => getCalendarCells(calendarViewDate),
    [calendarViewDate],
  );

  const calYear = calendarViewDate.getFullYear();
  const calMonth = calendarViewDate.getMonth();
  const canGoPrev =
    new Date(calYear, calMonth, 1) >
    new Date(today.getFullYear(), today.getMonth(), 1);

  const availableTimes = useMemo(
    () => TIME_SLOTS.filter((slot) => !bookedTimes.includes(slot)),
    [bookedTimes],
  );

  const groupedSlots = useMemo(() => {
    const morning = TIME_SLOTS.filter(
      (slot) => Number(slot.split(":")[0]) < 12,
    );
    const afternoon = TIME_SLOTS.filter(
      (slot) => Number(slot.split(":")[0]) >= 12,
    );
    return [
      { label: "Morning", slots: morning },
      { label: "Afternoon", slots: afternoon },
    ];
  }, []);

  // Logic
  function isDateDisabled(d: Date) {
    const candidate = new Date(d);
    candidate.setHours(0, 0, 0, 0);
    return candidate < today || candidate > maxDate || isWeekend(candidate);
  }

  function selectDate(date: Date) {
    if (isDateDisabled(date)) return;
    setForm((prev) => ({ ...prev, date: toDateStr(date), time: "" }));
    setAutoPicked(false);
    setError("");
  }

  function onPickTime(slot: string) {
    setForm((prev) => ({ ...prev, time: slot }));
    setAutoPicked(false);
  }

  // Effects
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    setStep("service");
    setForm({
      name: "",
      email: "",
      service: "",
      date: "",
      time: "",
      message: "",
    });
    setCalendarViewDate(new Date());
    setBookedTimes([]);
    setSlotsLoading(false);
    setSubmitting(false);
    setError("");
    setAutoPicked(false);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    const prevFocused = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      trapFocusOnTab(e, modalRef);
    };

    window.addEventListener("keydown", onKeyDown);
    requestAnimationFrame(() => firstFocusRef.current?.focus());

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
      prevFocused?.focus?.();
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!form.date) {
      setBookedTimes([]);
      return;
    }
    const controller = new AbortController();
    (async () => {
      setSlotsLoading(true);
      try {
        const res = await fetch(`/api/bookings?date=${form.date}`, {
          signal: controller.signal,
        });
        const data = await res.json();
        setBookedTimes(
          Array.isArray(data?.bookedTimes) ? data.bookedTimes : [],
        );
      } catch {
        setBookedTimes([]);
      } finally {
        setSlotsLoading(false);
      }
    })();
    return () => controller.abort();
  }, [form.date]);

  useEffect(() => {
    if (!form.date || slotsLoading) return;
    const firstAvailable = availableTimes[0] ?? "";
    setForm((prev) => {
      if (prev.date !== form.date) return prev;
      if (prev.time && availableTimes.includes(prev.time)) return prev;
      if (!firstAvailable && prev.time === "") return prev;
      if (prev.time === firstAvailable) return prev;
      return { ...prev, time: firstAvailable };
    });
    if (!form.time && firstAvailable) setAutoPicked(true);
    if (!firstAvailable) setAutoPicked(false);
  }, [availableTimes, form.date, form.time, slotsLoading]);

  async function handleSubmit() {
    setError("");
    if (!form.service || !form.date || !form.time) {
      setError("Please complete service, date, and time.");
      return;
    }
    if (!form.name.trim() || !form.email.trim()) {
      setError("Please fill in your full name and email.");
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
        setError(data?.error || "Unable to create booking. Please try again.");
        return;
      }
      setStep("success");
    } catch {
      setError("Network issue. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          ref={overlayRef}
          className="fixed inset-0 z-[1000] flex items-end justify-center bg-slate-950/80 p-0 sm:items-center sm:p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => {
            if (e.target === overlayRef.current) onClose();
          }}
        >
          {/* Ambient Background Effects */}
          <div className="pointer-events-none absolute -left-[20%] top-0 h-[500px] w-[500px] rounded-full bg-blue-900/20 blur-[120px]" />
          <div className="pointer-events-none absolute -right-[20%] bottom-0 h-[500px] w-[500px] rounded-full bg-cyan-900/20 blur-[120px]" />

          <motion.div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="flex h-[100dvh] w-full flex-col overflow-hidden bg-[#030712] text-slate-200 shadow-2xl sm:h-auto sm:max-h-[85vh] sm:max-w-5xl sm:rounded-3xl border border-white/10"
          >
            {/* ── Header ── */}
            <header className="flex shrink-0 items-center justify-between border-b border-white/10 bg-[#030712]/50 px-6 py-5 backdrop-blur-xl">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-400">
                  New Project
                </p>
                <h2 className="text-lg font-bold text-white">
                  Strategy Session
                </h2>
              </div>
              <button
                ref={firstFocusRef}
                onClick={onClose}
                className="group flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-400 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
              >
                <X
                  size={18}
                  className="transition-transform group-hover:rotate-90"
                />
              </button>
            </header>

            {/* ── Content Body ── */}
            <div className="flex flex-1 overflow-hidden">
              {/* Main Interaction Area */}
              <main className="flex-1 overflow-y-auto scrollbar-hide">
                {step === "success" ? (
                  // Success State
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex h-full flex-col items-center justify-center p-8 text-center"
                  >
                    <div className="relative mb-8">
                      <div className="absolute inset-0 animate-ping rounded-full bg-blue-500/20 duration-1000" />
                      <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 shadow-2xl shadow-blue-500/40">
                        <Check
                          size={40}
                          strokeWidth={3}
                          className="text-white"
                        />
                      </div>
                    </div>

                    <h3 className="mb-2 text-3xl font-bold text-white">
                      Confirmed
                    </h3>
                    <p className="mb-8 text-slate-400">
                      We've sent a calendar invite to{" "}
                      <span className="text-blue-300">{form.email}</span>
                    </p>

                    <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Date</span>
                        <span className="font-medium text-white">
                          {formatDatePretty(form.date)}
                        </span>
                      </div>
                      <div className="my-3 h-px w-full bg-white/5" />
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Time</span>
                        <span className="font-medium text-white">
                          {to12Hour(form.time)}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={onClose}
                      className="mt-8 rounded-xl bg-white px-8 py-3 text-sm font-bold text-black hover:bg-slate-200"
                    >
                      Back to Site
                    </button>
                  </motion.div>
                ) : (
                  // Steps
                  <div className="flex min-h-full flex-col p-6 sm:p-8">
                    <div className="mb-8">
                      <Stepper step={step} />
                    </div>

                    <AnimatePresence mode="wait">
                      {/* ── Step 1: Service ── */}
                      {step === "service" && (
                        <motion.div
                          key="service"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="flex flex-1 flex-col"
                        >
                          <h3 className="mb-6 text-2xl font-bold text-white">
                            Select Goal
                          </h3>
                          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            {SERVICES.map((s) => {
                              const selected = form.service === s.label;
                              return (
                                <button
                                  key={s.id}
                                  onClick={() =>
                                    setForm((f) => ({ ...f, service: s.label }))
                                  }
                                  className={`group relative flex items-start gap-4 rounded-2xl border p-5 text-left transition-all duration-300 ${
                                    selected
                                      ? "border-blue-500/50 bg-blue-500/10 shadow-[0_0_30px_-10px_rgba(59,130,246,0.3)]"
                                      : "border-white/5 bg-white/[0.02] hover:border-white/10 hover:bg-white/5"
                                  }`}
                                >
                                  <div
                                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-colors ${
                                      selected
                                        ? "bg-blue-500 text-white"
                                        : "bg-white/5 text-slate-400 group-hover:text-white"
                                    }`}
                                  >
                                    {s.icon}
                                  </div>
                                  <div>
                                    <p
                                      className={`font-semibold transition-colors ${selected ? "text-white" : "text-slate-200 group-hover:text-white"}`}
                                    >
                                      {s.label}
                                    </p>
                                    <p className="mt-1 text-xs text-slate-500 group-hover:text-slate-400">
                                      {s.sub}
                                    </p>
                                  </div>
                                  {selected && (
                                    <div className="absolute right-4 top-4 text-blue-400">
                                      <Check size={16} strokeWidth={3} />
                                    </div>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}

                      {/* ── Step 2: Schedule ── */}
                      {step === "schedule" && (
                        <motion.div
                          key="schedule"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="flex flex-1 flex-col"
                        >
                          <div className="mb-6 flex items-end justify-between">
                            <div>
                              <h3 className="text-2xl font-bold text-white">
                                Availability
                              </h3>
                              <p className="mt-1 text-xs font-medium uppercase tracking-wider text-slate-500">
                                {timezone}
                              </p>
                            </div>

                            {/* Quick Dates */}
                            <div className="hidden gap-2 sm:flex">
                              {quickDates.map((d) => {
                                const val = toDateStr(d);
                                const selected = form.date === val;
                                return (
                                  <button
                                    key={val}
                                    onClick={() => {
                                      setCalendarViewDate(
                                        new Date(
                                          d.getFullYear(),
                                          d.getMonth(),
                                          1,
                                        ),
                                      );
                                      selectDate(d);
                                    }}
                                    className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-all ${
                                      selected
                                        ? "border-blue-500/50 bg-blue-500/20 text-blue-200"
                                        : "border-white/10 bg-white/5 text-slate-400 hover:bg-white/10"
                                    }`}
                                  >
                                    {d.toLocaleDateString("en-US", {
                                      weekday: "short",
                                      day: "numeric",
                                    })}
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          <div className="flex flex-col gap-6 lg:flex-row">
                            {/* Calendar Grid */}
                            <div className="flex-1 rounded-2xl border border-white/10 bg-white/[0.02] p-6">
                              <div className="mb-6 flex items-center justify-between">
                                <button
                                  onClick={() =>
                                    setCalendarViewDate(
                                      new Date(calYear, calMonth - 1, 1),
                                    )
                                  }
                                  disabled={!canGoPrev}
                                  className="p-2 text-slate-400 hover:text-white disabled:opacity-20"
                                >
                                  <ChevronLeft size={20} />
                                </button>
                                <span className="font-semibold text-white">
                                  {MONTHS[calMonth]} {calYear}
                                </span>
                                <button
                                  onClick={() =>
                                    setCalendarViewDate(
                                      new Date(calYear, calMonth + 1, 1),
                                    )
                                  }
                                  className="p-2 text-slate-400 hover:text-white"
                                >
                                  <ChevronRight size={20} />
                                </button>
                              </div>

                              <div className="grid grid-cols-7 gap-y-4 text-center">
                                {DAYS.map((d) => (
                                  <div
                                    key={d}
                                    className="text-[10px] font-bold uppercase text-slate-600"
                                  >
                                    {d}
                                  </div>
                                ))}
                                {cells.map((cell, i) => {
                                  if (!cell) return <div key={i} />;
                                  const dstr = toDateStr(cell);
                                  const disabled = isDateDisabled(cell);
                                  const selected = form.date === dstr;
                                  const todayMatch = dstr === toDateStr(today);

                                  return (
                                    <div
                                      key={i}
                                      className="flex justify-center"
                                    >
                                      <button
                                        disabled={disabled}
                                        onClick={() => selectDate(cell)}
                                        className={`relative flex h-10 w-10 items-center justify-center rounded-full text-sm transition-all ${
                                          selected
                                            ? "bg-gradient-to-br from-blue-600 to-cyan-500 font-bold text-white shadow-lg shadow-blue-500/40"
                                            : disabled
                                              ? "text-slate-800"
                                              : "text-slate-300 hover:bg-white/10 hover:text-white"
                                        } ${todayMatch && !selected ? "ring-1 ring-blue-500/50" : ""}`}
                                      >
                                        {cell.getDate()}
                                      </button>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Time Slots */}
                            <div className="flex h-80 flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-6 lg:h-auto lg:w-72">
                              <h4 className="mb-4 text-sm font-semibold text-white">
                                Select Time
                              </h4>
                              <div className="flex-1 overflow-y-auto pr-2 scrollbar-hide">
                                {!form.date ? (
                                  <div className="flex h-full items-center justify-center text-xs text-slate-500">
                                    Select a date first
                                  </div>
                                ) : slotsLoading ? (
                                  <div className="flex h-full items-center justify-center">
                                    <Loader2 className="animate-spin text-blue-500" />
                                  </div>
                                ) : availableTimes.length === 0 ? (
                                  <div className="p-4 text-center text-xs text-slate-500">
                                    No slots available
                                  </div>
                                ) : (
                                  <div className="space-y-6">
                                    {groupedSlots.map((group) => (
                                      <div key={group.label}>
                                        <p className="sticky top-0 mb-2 bg-[#050b16] py-1 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                                          {group.label}
                                        </p>
                                        <div className="grid grid-cols-2 gap-2">
                                          {group.slots.map((slot) => {
                                            const selected = form.time === slot;
                                            return (
                                              <button
                                                key={slot}
                                                onClick={() => onPickTime(slot)}
                                                className={`rounded-lg border py-2 text-xs font-medium transition-all ${
                                                  selected
                                                    ? "border-blue-500/50 bg-blue-500/20 text-blue-100 shadow-[0_0_15px_-5px_rgba(59,130,246,0.4)]"
                                                    : "border-white/10 bg-white/5 text-slate-400 hover:border-white/20 hover:text-white"
                                                }`}
                                              >
                                                {to12Hour(slot)}
                                              </button>
                                            );
                                          })}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* ── Step 3: Details ── */}
                      {step === "details" && (
                        <motion.div
                          key="details"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="flex flex-1 flex-col"
                        >
                          <h3 className="mb-6 text-2xl font-bold text-white">
                            Final Details
                          </h3>

                          <div className="space-y-4">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                              <Field
                                label="Full Name"
                                value={form.name}
                                onChange={(v) =>
                                  setForm((f) => ({ ...f, name: v }))
                                }
                                icon={<User size={18} />}
                              />
                              <Field
                                label="Email Address"
                                value={form.email}
                                type="email"
                                onChange={(v) =>
                                  setForm((f) => ({ ...f, email: v }))
                                }
                                icon={<Mail size={18} />}
                              />
                            </div>

                            <div className="group relative">
                              <div className="pointer-events-none absolute left-4 top-4 text-slate-500 group-focus-within:text-blue-400">
                                <Sparkles size={18} />
                              </div>
                              <textarea
                                value={form.message}
                                onChange={(e) =>
                                  setForm((f) => ({
                                    ...f,
                                    message: e.target.value,
                                  }))
                                }
                                rows={4}
                                className="w-full resize-none rounded-xl border border-white/10 bg-white/5 pl-12 pr-4 pt-4 text-sm text-white outline-none transition-all placeholder:text-slate-600 focus:border-blue-500/50 focus:bg-blue-900/10 focus:ring-1 focus:ring-blue-500/50"
                                placeholder="Tell us about your project goals..."
                              />
                            </div>
                          </div>

                          <div className="mt-4 flex items-start gap-3 rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
                            <div className="mt-0.5 text-blue-400">
                              <Zap size={16} />
                            </div>
                            <p className="text-xs leading-relaxed text-blue-100/80">
                              This is a discovery call. No preparation
                              needed—just bring your ideas and we'll handle the
                              strategy.
                            </p>
                          </div>

                          {error && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="mt-4 text-center text-xs text-red-400"
                            >
                              {error}
                            </motion.div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </main>

              {/* Sidebar (Desktop Only) */}
              <aside className="hidden w-80 shrink-0 border-l border-white/10 p-6 lg:block">
                <Sidebar form={form} timezone={timezone} />
              </aside>
            </div>

            {/* ── Footer Actions ── */}
            {step !== "success" && (
              <footer className="flex shrink-0 items-center justify-between border-t border-white/10 bg-[#030712]/80 px-6 py-5 backdrop-blur-xl">
                <button
                  onClick={() => {
                    const prev = STEP_ORDER[STEP_ORDER.indexOf(step) - 1];
                    if (prev) setStep(prev);
                  }}
                  disabled={step === "service"}
                  className="flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-white disabled:opacity-0"
                >
                  <ChevronLeft size={16} /> Back
                </button>

                <button
                  onClick={() => {
                    if (step === "details") handleSubmit();
                    else {
                      const next = STEP_ORDER[STEP_ORDER.indexOf(step) + 1];
                      setStep(next);
                    }
                  }}
                  disabled={
                    (step === "service" && !form.service) ||
                    (step === "schedule" && (!form.date || !form.time)) ||
                    (step === "details" && submitting)
                  }
                  className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-white px-8 py-3 text-sm font-bold text-black transition-all hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submitting ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <>
                      {step === "details" ? "Confirm Booking" : "Continue"}
                      <ArrowRight
                        size={16}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </>
                  )}
                  {/* Button Glow */}
                  <div className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-400 to-cyan-300 opacity-0 blur-lg transition-opacity duration-500 group-hover:opacity-50" />
                </button>
              </footer>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
