import nodemailer from "nodemailer";

export interface AppointmentEmailData {
  name: string;
  email: string;
  service: string;
  date: string;
  time: string;
  message?: string;
}

let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter {
  if (transporter) return transporter;
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;
  if (!user || !pass) throw new Error("EMAIL_USER and EMAIL_PASS must be set.");
  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });
  return transporter;
}

function formatDateLong(dateStr: string): string {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function to12Hour(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, "0")} ${ampm}`;
}

// ─── NEW PREMIUM SHELL ────────────────────────────────────────────────────────
function emailShell(content: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>Auraa Notification</title>
</head>
<body style="margin:0;padding:0;background-color:#02040a;font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;color:#ffffff;">
  
  <!-- Outer Container with Deep Gradient -->
  <div style="
    background: linear-gradient(180deg, #02040a 0%, #0f172a 100%);
    min-height: 100vh;
    padding: 60px 20px;
  ">
    
    <div style="max-width:500px;margin:0 auto;">
      
      <!-- Brand Logo (Minimal Text) -->
      <div style="text-align:center;margin-bottom:40px;">
        <span style="
          color:#ffffff;
          font-size:24px;
          font-weight:300;
          letter-spacing:0.3em;
          text-transform:uppercase;
          font-family: 'Courier New', Courier, monospace; 
        ">Auraa</span>
      </div>

      <!-- Main Content Card -->
      <div style="
        background: #0b1121;
        border: 1px solid rgba(255,255,255,0.08);
        border-radius: 4px;
        padding: 40px;
        box-shadow: 0 20px 40px rgba(0,0,0,0.4);
      ">
        ${content}
      </div>

      <!-- Footer -->
      <div style="text-align:center;margin-top:40px;">
        <p style="
          margin:0;
          font-size:10px;
          color:rgba(255,255,255,0.3);
          letter-spacing:0.05em;
          line-height:1.6;
        ">
          © 2026 AURAA DIGITAL.<br/>
          ALL RIGHTS RESERVED.
        </p>
      </div>

    </div>
  </div>
</body>
</html>`;
}

// ─── NEW MINIMAL ROW ──────────────────────────────────────────────────────────
function detailRow(label: string, value: string): string {
  return `
  <tr>
    <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.05); vertical-align: top; width: 35%;">
      <span style="
        font-size: 11px;
        text-transform: uppercase;
        color: rgba(255,255,255,0.4);
        letter-spacing: 0.15em;
        font-weight: 600;
      ">${label}</span>
    </td>
    <td style="padding: 12px 0 12px 16px; border-bottom: 1px solid rgba(255,255,255,0.05); vertical-align: top;">
      <span style="
        font-size: 14px;
        color: #f1f5f9;
        font-weight: 400;
        line-height: 1.5;
        letter-spacing: 0.02em;
      ">${value}</span>
    </td>
  </tr>`;
}

// ─────────────────────────────────────────────────────────────────────────────
// USER CONFIRMATION (Clean & Minimal)
// ─────────────────────────────────────────────────────────────────────────────
export async function sendUserConfirmation(
  data: AppointmentEmailData,
): Promise<void> {
  const firstName = data.name.split(" ")[0];
  const formattedDate = formatDateLong(data.date);
  const formattedTime = to12Hour(data.time);

  const content = `
    <!-- Header Text -->
    <div style="margin-bottom: 32px; text-align: center;">
      <h1 style="
        margin: 0 0 12px;
        font-size: 20px;
        font-weight: 400;
        color: #fff;
        letter-spacing: 0.05em;
      ">Appointment Confirmed</h1>
      <p style="
        margin: 0;
        font-size: 13px;
        color: rgba(255,255,255,0.5);
        line-height: 1.6;
      ">
        Hello ${firstName}. Your session has been scheduled.
      </p>
    </div>

    <!-- Divider Gradient -->
    <div style="height:1px; background:linear-gradient(90deg, transparent, rgba(99,102,241,0.5), transparent); margin-bottom: 32px;"></div>

    <!-- Details Table -->
    <table style="width:100%; border-collapse:collapse; margin-bottom: 32px;">
      ${detailRow("Service", data.service)}
      ${detailRow("Date", formattedDate)}
      ${detailRow("Time", formattedTime)}
      ${detailRow("Platform", "Online Consultation")}
      ${data.message?.trim() ? detailRow("Note", data.message) : ""}
    </table>

    <!-- Action / Info -->
    <div style="
      background: rgba(255,255,255,0.02);
      border: 1px solid rgba(255,255,255,0.05);
      padding: 20px;
      text-align: center;
    ">
      <p style="
        margin: 0;
        font-size: 12px;
        color: rgba(255,255,255,0.6);
        line-height: 1.6;
      ">
        A calendar invitation and meeting link will be sent to 
        <span style="color:#fff;">${data.email}</span> shortly.
      </p>
    </div>

    <!-- Contact Link -->
    <div style="margin-top: 32px; text-align: center;">
      <a href="mailto:hub4digital.ads@gmail.com" style="
        font-size: 11px;
        color: #6366f1;
        text-decoration: none;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        border-bottom: 1px solid rgba(99,102,241,0.3);
        padding-bottom: 2px;
      ">Modify Appointment</a>
    </div>
  `;

  await getTransporter().sendMail({
    from: `"Auraa Digital" <${process.env.EMAIL_USER}>`,
    to: data.email,
    subject: `Confirmed: ${data.service}`,
    html: emailShell(content),
  });

  console.log("[emails] ✓ User confirmation sent →", data.email);
}

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN NOTIFICATION (Dossier Style)
// ─────────────────────────────────────────────────────────────────────────────
export async function sendAdminNotification(
  data: AppointmentEmailData,
): Promise<void> {
  const formattedDate = formatDateLong(data.date);
  const formattedTime = to12Hour(data.time);
  const replySubject = encodeURIComponent(
    `Re: Your ${data.service} on ${formattedDate}`,
  );

  const content = `
    <!-- Subtle Badge -->
    <div style="margin-bottom: 24px;">
      <span style="
        background: rgba(99,102,241,0.15);
        color: #818cf8;
        font-size: 10px;
        font-weight: 700;
        padding: 4px 8px;
        border-radius: 2px;
        letter-spacing: 0.1em;
        text-transform: uppercase;
      ">New Request</span>
    </div>

    <!-- Header -->
    <h2 style="
      margin: 0 0 32px;
      font-size: 22px;
      font-weight: 300;
      color: #fff;
      letter-spacing: 0.02em;
    ">
      Incoming Booking
    </h2>

    <!-- Section Label -->
    <p style="
      font-size: 10px; 
      color: rgba(255,255,255,0.3); 
      text-transform: uppercase; 
      letter-spacing: 0.2em;
      margin-bottom: 12px;
    ">Client Profile</p>

    <!-- Client Details -->
    <table style="width:100%; border-collapse:collapse; margin-bottom: 32px;">
      ${detailRow("Name", data.name)}
      ${detailRow("Email", `<a href="mailto:${data.email}" style="color:#fff;text-decoration:none;">${data.email}</a>`)}
    </table>

    <!-- Section Label -->
    <p style="
      font-size: 10px; 
      color: rgba(255,255,255,0.3); 
      text-transform: uppercase; 
      letter-spacing: 0.2em;
      margin-bottom: 12px;
    ">Session Details</p>

    <!-- Appt Details -->
    <table style="width:100%; border-collapse:collapse; margin-bottom: 40px;">
      ${detailRow("Service", data.service)}
      ${detailRow("Date", formattedDate)}
      ${detailRow("Time", formattedTime)}
      ${data.message?.trim() ? detailRow("Client Note", data.message) : ""}
    </table>

    <!-- Button -->
    <div style="text-align: left;">
      <a href="mailto:${data.email}?subject=${replySubject}" style="
        background: #ffffff;
        color: #02040a;
        text-decoration: none;
        padding: 14px 28px;
        font-size: 12px;
        font-weight: 600;
        letter-spacing: 0.05em;
        display: inline-block;
        border-radius: 2px;
      ">
        Reply to Client &rarr;
      </a>
    </div>
  `;

  await getTransporter().sendMail({
    from: `"Auraa Bot" <${process.env.EMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL ?? "hub4digital.ads@gmail.com",
    replyTo: data.email,
    subject: `New Booking: ${data.name}`,
    html: emailShell(content),
  });

  console.log("[emails] ✓ Admin notification sent →", process.env.ADMIN_EMAIL);
}
