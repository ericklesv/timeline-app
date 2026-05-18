import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Timeline — Sua agenda inteligente",
  description:
    "Calendário inteligente com timeline. Organize compromissos, datas importantes e eventos futuros.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="dark">
      <body className="font-sans antialiased text-text bg-bg min-h-screen">
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
