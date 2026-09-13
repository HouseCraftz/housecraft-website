import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HouseCraft Access",
  description: "Build your HouseCraft access, pixel by pixel.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
