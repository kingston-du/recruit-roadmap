import type { Metadata } from "next";
import { Suspense } from "react";

import { AnalyticsPageViews } from "@/components/recruit/analytics-page-views";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hockey Pathway",
  description:
    "A freemium hockey recruiting pathway and planning app for families.",
  icons: {
    icon: [{ url: "/favicon-rounded.png", type: "image/png", sizes: "512x512" }],
    apple: [{ url: "/favicon-rounded.png", type: "image/png", sizes: "512x512" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <Suspense fallback={null}>
          <AnalyticsPageViews />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
