import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";

import { Prisma } from "@/generated/prisma/client";
import { sendAdminNotification, sendUserConfirmation } from "@/app/lib/emails";

const VALID_SLOTS = [
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

const SERVICE_MAP = {
  "Horizontal Video": "Horizontal Video Editing",
  "Vertical / Shorts": "Short-form Content Editing",
  "Podcast Production": "Podcast Production",
  "Thumbnail Design": "Thumbnail Design",
};

const VALID_SERVICES = Object.values(SERVICE_MAP);

// ── GET — fetch booked time slots for a date ──────────────────────────────────
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");

    if (!date) {
      return NextResponse.json(
        { error: "date param required" },
        { status: 400 },
      );
    }

    const bookings = await prisma.appointment.findMany({
      where: { date },
      select: { time: true },
    });

    const bookedTimes = bookings.map((b) => b.time);

    return NextResponse.json({ bookedTimes });
  } catch (err) {
    console.error("[GET /api/bookings]", err);
    return NextResponse.json(
      { error: "Failed to fetch slots" },
      { status: 500 },
    );
  }
}

// ── POST — create a new booking ───────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("[POST /api/bookings] body:", body);

    const { name, email, service, date, time, message } = body;

    // ── Field validation ──────────────────────────────────────────────────────
    if (!name?.trim() || !email?.trim() || !service?.trim() || !date || !time) {
      return NextResponse.json(
        { error: "All required fields must be filled." },
        { status: 400 },
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address." },
        { status: 400 },
      );
    }

    // ── Prevent past dates ────────────────────────────────────────────────────
    const selectedDate = new Date(date + "T00:00:00");
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      return NextResponse.json(
        { error: "Cannot book a past date." },
        { status: 400 },
      );
    }

    // ── Prevent weekends ──────────────────────────────────────────────────────
    const dayOfWeek = selectedDate.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return NextResponse.json(
        { error: "Weekends are not available for booking." },
        { status: 400 },
      );
    }

    // ── Allowlist checks ──────────────────────────────────────────────────────
    if (!VALID_SLOTS.includes(time)) {
      return NextResponse.json(
        { error: "Invalid time slot selected." },
        { status: 400 },
      );
    }

    if (!VALID_SERVICES.includes(service)) {
      return NextResponse.json(
        { error: "Invalid service selected." },
        { status: 400 },
      );
    }

    // ── Save to DB (@@unique on date+time handles race conditions) ────────────
    const appointment = await prisma.appointment.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        service: service.trim(),
        date,
        time,
        message: message?.trim() ?? "",
      },
    });

    console.log("[POST /api/bookings] Saved — ID:", appointment.id);

    // ── Send emails (non-blocking) ────────────────────────────────────────────
    const emailPayload = {
      name: appointment.name,
      email: appointment.email,
      service: appointment.service,
      date: appointment.date,
      time: appointment.time,
      message: appointment.message,
    };

    const [userEmailResult, adminEmailResult] = await Promise.allSettled([
      sendUserConfirmation(emailPayload),
      sendAdminNotification(emailPayload),
    ]);

    if (userEmailResult.status === "rejected") {
      console.error(
        "[POST /api/bookings] User email failed:",
        userEmailResult.reason,
      );
    }
    if (adminEmailResult.status === "rejected") {
      console.error(
        "[POST /api/bookings] Admin email failed:",
        adminEmailResult.reason,
      );
    }

    return NextResponse.json(
      {
        success: true,
        id: appointment.id,
        emailsSent: {
          user: userEmailResult.status === "fulfilled",
          admin: adminEmailResult.status === "fulfilled",
        },
      },
      { status: 201 },
    );
  } catch (err: unknown) {
    console.error("[POST /api/bookings] Error:", err);

    // ── Prisma unique constraint = double-booking race condition ──────────────
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "This time slot was just booked. Please choose another." },
        { status: 409 },
      );
    }

    return NextResponse.json(
      {
        error:
          process.env.NODE_ENV === "development"
            ? `Server error: ${String(err)}`
            : "Something went wrong. Please try again.",
      },
      { status: 500 },
    );
  }
}
