import { QRCodeType } from "@/types/QRCodeType";
import QRCode from "qrcode";

// ✅ Configuration for all supported QR types
export const qrTypeConfig: Record<
  QRCodeType,
  { label: string; icon: string; placeholder: string; prefix?: string }
> = {
  url: {
    label: "Website URL",
    icon: "Globe",
    placeholder: "https://example.com",
  },
  email: {
    label: "Email",
    icon: "Mail",
    placeholder: "contact@example.com",
    prefix: "mailto:",
  },
  phone: {
    label: "Phone",
    icon: "Phone",
    placeholder: "+1234567890",
    prefix: "tel:",
  },
  sms: {
    label: "SMS",
    icon: "MessageSquare",
    placeholder: "+1234567890",
    prefix: "sms:",
  },
  whatsapp: {
    label: "WhatsApp",
    icon: "MessageCircle",
    placeholder: "+1234567890",
    prefix: "https://wa.me/",
  },
  instagram: {
    label: "Instagram",
    icon: "Instagram",
    placeholder: "username",
    prefix: "https://instagram.com/",
  },
  facebook: {
    label: "Facebook",
    icon: "Facebook",
    placeholder: "username",
    prefix: "https://facebook.com/",
  },
  twitter: {
    label: "Twitter",
    icon: "Twitter",
    placeholder: "username",
    prefix: "https://x.com/",
  },
  linkedin: {
    label: "LinkedIn",
    icon: "Linkedin",
    placeholder: "in/username",
    prefix: "https://linkedin.com/",
  },
  youtube: {
    label: "YouTube",
    icon: "Youtube",
    placeholder: "@channel",
    prefix: "https://youtube.com/",
  },
  tiktok: {
    label: "TikTok",
    icon: "Video",
    placeholder: "@username",
    prefix: "https://tiktok.com/@",
  },
  location: {
    label: "Location",
    icon: "MapPin",
    placeholder: "40.7128,-74.0060",
  },
};

// ✅ Format content before generating QR code
export function formatQRContent(type: QRCodeType, content: string): string {
  const config = qrTypeConfig[type];
  const value = content.trim();

  if (type === "location") {
    const [lat, lng] = value.split(",").map((s) => s.trim());
    return `https://www.google.com/maps?q=${lat},${lng}`;
  }

  if (
    config.prefix &&
    !value.startsWith("http") &&
    !value.startsWith(config.prefix)
  ) {
    const cleaned = value.replace(/^@|https?:\/\/|www\./gi, "");
    return config.prefix + cleaned;
  }

  return value;
}

// ✅ Generate QR Code (no background under logo)
export async function generateQRCode(
  content: string,
  color: string = "#000000",
  logoUrl?: string,
  size: number = 400
): Promise<string> {
  try {
    // Base QR
    const qrDataUrl = await QRCode.toDataURL(content, {
      width: size,
      margin: 2,
      color: {
        dark: color,
        light: "#FFFFFF",
      },
      errorCorrectionLevel: "H", // high correction for logos
    });

    if (!logoUrl) return qrDataUrl;

    // Overlay logo directly (no white background)
    return await embedLogoInQRCode(qrDataUrl, logoUrl, size);
  } catch (error) {
    console.error("❌ Error generating QR code:", error);
    throw error;
  }
}

// ✅ Overlay logo directly into QR center
async function embedLogoInQRCode(
  qrDataUrl: string,
  logoUrl: string,
  qrSize: number
): Promise<string> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      reject(new Error("Canvas context not available"));
      return;
    }

    canvas.width = qrSize;
    canvas.height = qrSize;

    const qrImage = new Image();
    qrImage.crossOrigin = "anonymous";
    qrImage.src = qrDataUrl;

    qrImage.onload = () => {
      ctx.drawImage(qrImage, 0, 0, qrSize, qrSize);

      const logo = new Image();
      logo.crossOrigin = "anonymous";
      logo.src = logoUrl;

      logo.onload = () => {
        const logoSize = qrSize * 0.18; // 18% of QR
        const logoX = (qrSize - logoSize) / 2;
        const logoY = (qrSize - logoSize) / 2;

        // Draw logo directly (no white box)
        ctx.drawImage(logo, logoX, logoY, logoSize, logoSize);

        resolve(canvas.toDataURL("image/png"));
      };

      logo.onerror = () => {
        console.warn("⚠️ Failed to load logo, returning QR only");
        resolve(qrDataUrl);
      };
    };

    qrImage.onerror = () => reject(new Error("Failed to load QR image"));
  });
}

// ✅ Download QR Image
export function downloadQRCode(dataUrl: string, filename: string) {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = `${filename || "qr-code"}.png`;
  document.body.appendChild(link);
  link.click();
  link.remove();
}
