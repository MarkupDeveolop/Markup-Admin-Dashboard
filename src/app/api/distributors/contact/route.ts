import { CorsHandler } from "@/lib/CorsHandler/CorsHndler";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import * as nodemailer from "nodemailer";
import { z } from "zod";

// Schema matching DistributorContactForm
const distributorFormSchema = z.object({
  company: z.string().min(2, "company_required"),
  name: z.string().min(2, "name_required"),
  email: z.string().email("email_invalid"),
  phone: z.string().min(6, "phone_required").regex(/^[0-9+\-() ]+$/, "phone_invalid"),
  country: z.string().min(2, "country_required"),
  business_type: z.string().min(2, "business_type_required"),
  interested_products: z.string().optional(),
  message: z.string().min(10, "message_required"),
  hidden_name: z.string().optional(), // Honeypot
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
    const { GMAIL_USER, GMAIL_PASSWORD, CONTACT_RECEIVER } = process.env;

    if (!GMAIL_USER || !GMAIL_PASSWORD) {
      throw new Error("Email service not configured.");
    }

    const body = await req.json();

    // Anti-spam honeypot check
    if (body.hidden_name?.trim()) {
      return NextResponse.json(
        { message: "Bot submission blocked." },
        { status: 400, headers }
      );
    }

    const parsed = distributorFormSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          message: "Validation failed",
          errors: parsed.error.flatten(),
        },
        { status: 400, headers }
      );
    }

    const {
      company,
      name,
      email,
      phone,
      country,
      business_type,
      interested_products,
      message,
    } = parsed.data;

    const isRTL = /[\u0600-\u06FF]/.test(name + message);
    const formattedDate = new Intl.DateTimeFormat("en-US", {
      timeZone: "Africa/Cairo",
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date());

    const htmlBody = `
<div dir="${isRTL ? "rtl" : "ltr"}" style="font-family: sans-serif; max-width: 640px; margin: auto; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1);">
  <div style="background: linear-gradient(135deg, #2563eb, #1d4ed8); color: white; padding: 28px 32px;">
    <h1 style="margin: 0; font-size: 20px;">Distributor Application</h1>
  </div>
  <div style="padding: 28px;">
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Company:</strong> ${company}</p>
    <p><strong>Email:</strong> <a href="mailto:${email}" style="color: #2563eb">${email}</a></p>
    <p><strong>Phone:</strong> ${phone}</p>
    <p><strong>Country:</strong> ${country}</p>
    <p><strong>Business Type:</strong> ${business_type}</p>
    ${interested_products ? `<p><strong>Interested Products:</strong> ${interested_products}</p>` : ""}
    <div style="margin-top: 20px;">
      <strong>Message:</strong>
      <p style="white-space: pre-line; color: #334155;">${message}</p>
    </div>
  </div>
  <div style="background: #f8fafc; padding: 20px 32px; text-align: center;">
    <p style="font-size: 13px; color: #64748b;">Delivered by your website • ${formattedDate}</p>
  </div>
</div>
`.trim();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      pool: true,
      auth: {
        user: GMAIL_USER,
        pass: GMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"Website Contact" <${GMAIL_USER}>`,
      to: CONTACT_RECEIVER || GMAIL_USER,
      replyTo: email,
      subject: "New Distributor Application",
      text: `
Name: ${name}
Company: ${company}
Email: ${email}
Phone: ${phone}
Country: ${country}
Business Type: ${business_type}
Interested Products: ${interested_products || "N/A"}

Message:
${message}
      `.trim(),
      html: htmlBody,
    });

    return NextResponse.json(
      { message: "Application submitted successfully." },
      { status: 200, headers }
    );
  } catch (error) {
    console.error("Distributor form error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to process request";
    return NextResponse.json(
      { message: errorMessage },
      { status: 500, headers }
    );
  }
}
