import type { Metadata } from "next";
import { Figtree, Noto_Sans, Noto_Sans_Arabic } from "next/font/google";
import "./globals.css";

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["400", "500", "600", "700"],
});

const notoSans = Noto_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "700"],
});

const notoArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  variable: "--font-arabic",
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Labass AI Dashboard",
  description: "Doctor dashboard for managing patients, bookings, and campaigns",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${figtree.variable} ${notoSans.variable} ${notoArabic.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}

