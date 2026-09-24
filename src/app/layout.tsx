import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";

import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Dawson Xiong",
  description:
    "Dawson Xiong, computer science at Waterloo. Software, selected projects, and notes from a work in progress.",
};

// Matches the frosted header over the pool.
export const viewport: Viewport = {
  themeColor: "#c6dbf8",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body>
        {children}
        {/* On phones the toast spans the width; lift it clear of the pool's add button. */}
        <Toaster position="bottom-center" mobileOffset={{ bottom: 76 }} />
        <Analytics />
      </body>
    </html>
  );
}
