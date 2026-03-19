

// src/services/email.service.js
import nodemailer from "nodemailer";

export const sendTicketEmail = async ({
  to,
  username,
  event,
  ticket,
  qrCode,
}) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.verify();

  const base64Data = qrCode.replace(/^data:image\/png;base64,/, "");
  const qrBuffer = Buffer.from(base64Data, "base64");

  // ── Price breakdown ────────────────────────────────────────────────────────
  const logisticsPrice = Number(ticket.logistics?.price || 0);
  const hasLogistics   = logisticsPrice > 0 && ticket.logistics?.name;
  // ✅ For old tickets ticketPrice may be 0 — fall back to totalPrice
  const ticketPrice    = Number(ticket.ticketPrice) || Number(ticket.totalPrice) || 0;
  const totalPrice     = ticketPrice + logisticsPrice;

  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to,
    subject: `🎟️ Your ticket for ${event} is confirmed!`,
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,sans-serif;">
  <div style="max-width:580px;margin:32px auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

    <!-- Header -->
    <div style="background:linear-gradient(135deg,#7c3aed,#ec4899);padding:32px 24px;text-align:center;">
      <h1 style="color:#fff;margin:0 0 6px;font-size:26px;letter-spacing:-0.5px;">🎉 Ticket Confirmed!</h1>
      <p style="color:rgba(255,255,255,0.85);margin:0;font-size:14px;">
        You're going to <strong>${event}</strong>
      </p>
    </div>

    <!-- Body -->
    <div style="padding:28px 24px;">
      <p style="color:#374151;font-size:16px;margin:0 0 20px;">
        Hi <strong>${username || "there"}</strong>, your payment was successful and your ticket is ready. 🎊
      </p>

      <!-- Ticket details card -->
      <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:12px;padding:20px;margin-bottom:24px;">
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="padding:9px 0;color:#6b7280;font-size:14px;width:40%;">Event</td>
            <td style="padding:9px 0;color:#111827;font-weight:700;font-size:14px;">${event}</td>
          </tr>
          <tr style="border-top:1px solid #e5e7eb;">
            <td style="padding:9px 0;color:#6b7280;font-size:14px;">Ticket Type</td>
            <td style="padding:9px 0;color:#111827;font-size:14px;">${ticket.ticketTypeName || "—"}</td>
          </tr>
          <tr style="border-top:1px solid #e5e7eb;">
            <td style="padding:9px 0;color:#6b7280;font-size:14px;">Quantity</td>
            <td style="padding:9px 0;color:#111827;font-size:14px;">${ticket.quantity || 1}</td>
          </tr>

          <!-- Ticket price row -->
          <tr style="border-top:1px solid #e5e7eb;">
            <td style="padding:9px 0;color:#6b7280;font-size:14px;">Ticket Price</td>
            <td style="padding:9px 0;color:#111827;font-size:14px;">₦${ticketPrice.toLocaleString()}</td>
          </tr>

          <!-- Logistics row — only shown if user added logistics -->
          ${
            hasLogistics
              ? `
          <tr style="border-top:1px solid #e5e7eb;">
            <td style="padding:9px 0;color:#6b7280;font-size:14px;">
              Transport (${ticket.logistics.name})
            </td>
            <td style="padding:9px 0;color:#111827;font-size:14px;">₦${logisticsPrice.toLocaleString()}</td>
          </tr>
          `
              : ""
          }

          <!-- Total row -->
          <tr style="border-top:2px solid #e5e7eb;">
            <td style="padding:12px 0 6px;color:#374151;font-size:15px;font-weight:700;">
              Total Paid
            </td>
            <td style="padding:12px 0 6px;color:#7c3aed;font-size:16px;font-weight:700;">
              ₦${totalPrice.toLocaleString()}
            </td>
          </tr>

          <!-- Ticket code row -->
          ${
            ticket.ticketCode
              ? `
          <tr style="border-top:1px solid #e5e7eb;">
            <td style="padding:12px 0;color:#6b7280;font-size:14px;">Ticket Code</td>
            <td style="padding:12px 0;">
              <span style="font-family:monospace;font-size:20px;font-weight:700;letter-spacing:5px;color:#111827;background:#f3f4f6;padding:4px 10px;border-radius:6px;">
                ${ticket.ticketCode}
              </span>
            </td>
          </tr>
          `
              : ""
          }
        </table>
      </div>

      <!-- QR Code -->
      <div style="text-align:center;margin:24px 0 8px;">
        <p style="color:#6b7280;font-size:14px;margin:0 0 14px;">
          Show this QR code at the entrance:
        </p>
        <img src="cid:qrcode" alt="QR Code"
          style="width:200px;height:200px;border:4px solid #7c3aed;border-radius:14px;" />
        ${
          ticket.ticketCode
            ? `
        <p style="margin:10px 0 0;font-family:monospace;font-size:18px;font-weight:700;letter-spacing:5px;color:#111827;">
          ${ticket.ticketCode}
        </p>
        `
            : ""
        }
      </div>
    </div>

    <!-- Passly Footer -->
    <div style="background:linear-gradient(135deg,#7c3aed,#ec4899);padding:18px 24px;text-align:center;">
      <p style="margin:0;color:rgba(255,255,255,0.75);font-size:12px;">
        Secured &amp; delivered by
      </p>
      <p style="margin:4px 0 0;color:#fff;font-size:18px;font-weight:900;letter-spacing:1px;">
        PASSLY
      </p>
    </div>

  </div>
</body>
</html>
    `,
    attachments: [
      {
        filename: "ticket-qr.png",
        content: qrBuffer,
        cid: "qrcode",
      },
    ],
  };

  await transporter.sendMail(mailOptions);
};