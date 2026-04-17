import type { Metadata } from "next";
import { Manrope, Sora } from "next/font/google";

import { Providers } from "./providers";
import "./globals.css";

const bodyFont = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
});

const displayFont = Sora({
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "CourtHub",
  description: "Book premium sports courts, manage venue schedules, and run multi-vendor operations across web and mobile.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${bodyFont.variable} ${displayFont.variable} app-surface`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
