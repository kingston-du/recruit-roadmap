import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Recruit Roadmap Hockey",
  description: "A simple hockey recruiting roadmap and planning prototype for families.",
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
