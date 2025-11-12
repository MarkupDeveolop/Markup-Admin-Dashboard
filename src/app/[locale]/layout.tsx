import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { Locale, routing } from "@/i18n/routing";
import "./globals.css";

import { Metadata } from "next";
import { ToasterProvider } from "@/providers/ToastProvider/ToasterProvider";
import { ProvidersTheme } from "@/providers/ThemeProvider";

import localfont from "next/font/local";
import { NextAuthProvider } from "@/providers/SessionProvider/SessionProvider";

const myFont = localfont({ src: "../../fonts/Cairo-Medium.ttf" });

export const metadata: Metadata = {
  title: {
    default: "MarkUP Admin Dashboard",
    template: "%s | MarkUP Dashboard",
  },
  icons: {
    icon: [
      { url: "/icons/triple-logo.png", sizes: "32x32" },
      { url: "/icons/triple-logo.png", sizes: "16x16" },
    ],
  },
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: Locale }>;
}) {
  // Ensure that the incoming `locale` is valid

  const { locale } = await params;
  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  const messages = await getMessages();

  const currentLocale = locale ?? "en"; // default to Arabic

  return (
    <html
      lang={currentLocale}
      dir={currentLocale === "en" ? "ltr" : "rtl"}
      suppressHydrationWarning
    >
      <body className={`bg-[#FBFBFB] dark:bg-slate-900 ${myFont.className}`}>
        <NextAuthProvider>
          <NextIntlClientProvider messages={messages}>
            <ToasterProvider />
            <ProvidersTheme>{children}</ProvidersTheme>
          </NextIntlClientProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
