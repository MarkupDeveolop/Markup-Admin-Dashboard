import { CorsHandler } from "@/lib/CorsHandler/CorsHndler";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import * as nodemailer from "nodemailer";
import { z } from "zod";

// Validation schema
const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  subject: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
  phone: z.string().optional(),
});

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: CorsHandler(req),
  });
}

export async function POST(req: NextRequest) {
  const headers = CorsHandler(req);

  try {
    // Ensure email service is configured
    const { GMAIL_USER, GMAIL_PASSWORD } = process.env;
    if (!GMAIL_USER || !GMAIL_PASSWORD) {
      throw new Error("Email service not configured.");
    }

    const requestData = await req.json();

    // Validate request body
    const validation = contactFormSchema.safeParse(requestData);
    if (!validation.success) {
      return NextResponse.json(
        {
          message: "Validation failed",
          errors: validation.error.flatten(),
        },
        { status: 400, headers }
      );
    }

    const { name, email, subject, message, phone } = validation.data;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      pool: true,
      auth: {
        user: GMAIL_USER,
        pass: GMAIL_PASSWORD,
      },
    });

    const emailSubject = subject || "New Contact Form Submission";
    const emailText = `
Name: ${name}
Email: ${email}
${phone ? `Phone: ${phone}\n` : ""}
${subject ? `Subject: ${subject}\n` : ""}
Message:
${message}
    `.trim();

    const emailHtml = `
<div style="font-family: sans-serif; max-width: 640px; margin: auto; border-radius: 16px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1); border: 1px solid #e2e8f0; overflow: hidden;">
  <div style="background: linear-gradient(135deg, #2563eb, #1d4ed8); color: white; padding: 28px 32px;">
    <h1 style="margin: 0; font-size: 22px;">${name}: New Message</h1>
    <p style="margin: 6px 0 0; font-size: 14px;">From your website contact form</p>
  </div>
  <div style="padding: 32px;">
    <h2 style="margin-bottom: 4px;">${name}</h2>
    <a href="mailto:${email}" style="color: #2563eb;">${email}</a>
    <div style="margin-top: 16px; display: grid; gap: 16px;">
      ${phone ? `<div><strong>Phone:</strong> ${phone}</div>` : ""}
      ${subject ? `<div><strong>Subject:</strong> ${subject}</div>` : ""}
    </div>
    <div style="margin-top: 24px;">
      <h3>Message</h3>
      <p style="white-space: pre-line; color: #334155;">${message}</p>
    </div>
    <div style="margin-top: 28px; text-align: center;">
      <a href="mailto:${email}" style="background: #2563eb; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none;">Reply to ${
      name.split(" ")[0]
    }</a>
    </div>
  </div>
  <div style="background: #f8fafc; padding: 20px 32px; text-align: center;">
    <p style="font-size: 13px; color: #64748b;">Delivered by your website • ${new Date().toLocaleDateString(
      "en-US",
      {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }
    )}</p>
  </div>
</div>
    `;

    await transporter.sendMail({
      from: `"Website Contact" <${GMAIL_USER}>`,
      to: GMAIL_USER,
      replyTo: email,
      subject: emailSubject,
      text: emailText,
      html: emailHtml,
    });

    return NextResponse.json(
      { message: "Your message has been sent successfully." },
      { status: 200, headers }
    );
  } catch (error) {
    console.error("Contact form error:", error);

    const statusCode = error instanceof z.ZodError ? 400 : 500;
    const errorMessage =
      error instanceof Error ? error.message : "Failed to process request";

    return NextResponse.json(
      {
        message: errorMessage,
        ...(error instanceof z.ZodError ? { errors: error.flatten() } : {}),
      },
      { status: statusCode, headers }
    );
  }
}
