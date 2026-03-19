// src/utils/sendVerification.js
import nodemailer from "nodemailer";

export const sendVerificationEmail = async (email, code) => {
  try {
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Verify Your Account",
      text: `Your verification code is: ${code}. It expires in 15 minutes.`,
      html: `
        <p>Your verification code is: <strong>${code}</strong></p>
        <p>It expires in 15 minutes.</p>
      `,
    });

    console.log(`✅ Verification email sent to ${email}`);
  } catch (error) {
    console.error("❌ Email sending error:", error.message);
    // Fail silently — don’t block registration
  }
};
