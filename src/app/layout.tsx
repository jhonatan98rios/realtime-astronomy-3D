import type { Metadata } from "next";
import "./globals.css";
import VoiceCommand from "../components/VoiceCommand"; 


export const metadata: Metadata = {
  title: "Orbitron",
  description: "Virtual reality app to interact with the solar system.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
      <VoiceCommand />
        {children}
      </body>
    </html>
  );
}
