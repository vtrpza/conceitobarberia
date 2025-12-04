import type { Metadata, Viewport } from "next";
import { Oswald, Bebas_Neue, Permanent_Marker } from "next/font/google";
import "./globals.css";

const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-oswald",
  weight: ["400", "500", "600", "700"],
});

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  variable: "--font-bebas",
  weight: "400",
});

const permanentMarker = Permanent_Marker({
  subsets: ["latin"],
  variable: "--font-marker",
  weight: "400",
});

export const metadata: Metadata = {
  title: "Barbearia Conceito",
  description: "Agendamento online - Barbearia Conceito - Da quebrada pra quebrada",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Barbearia Conceito",
  },
  icons: {
    icon: "/icons/icon-192x192.png",
    apple: "/icons/icon-192x192.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${oswald.variable} ${bebasNeue.variable} ${permanentMarker.variable} font-corpo antialiased bg-background text-foreground`}>
        {children}
      </body>
    </html>
  );
}
