import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Recruit Roadmap Hockey",
  description:
    "A freemium hockey recruiting roadmap and planning app for families.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
