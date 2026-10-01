import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/lib/config";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const grotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-grotesk", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "INP-HB — Recrutement de graphistes",
    template: "%s | Boutique INP-HB",
  },
  description: siteConfig.description,
  applicationName: siteConfig.shortName,
  keywords: ["INP-HB", "graphiste", "recrutement", "design produit", "boutique institutionnelle"],
  openGraph: {
    type: "website",
    locale: "fr_CI",
    siteName: siteConfig.name,
    title: "La prochaine identité visuelle de l’INP-HB commence ici",
    description: siteConfig.description,
    images: [{ url: "/opengraph-image" }],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: ["/opengraph-image"],
  },
};

export const viewport: Viewport = { themeColor: "#FFFFFF", colorScheme: "light" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${inter.variable} ${grotesk.variable}`}>
      <body>{children}</body>
    </html>
  );
}
