import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FlowMind Studio",
  description: "AI-Powered Workflow Automation Studio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className="dark">
      <body>{children}</body>
    </html>
  );
}

