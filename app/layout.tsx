import type { Metadata } from "next";
import Script from "next/script";
import { Inter, JetBrains_Mono } from "next/font/google";
import { themeScript } from "@/components/site/theme-toggle";
import { SiteNav } from "@/components/site/site-nav";
import "./globals.css";

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://nessalabs.ai"),
  title: {
    default: "Nessa Labs — the AI stack for modern humans",
    template: "%s — Nessa Labs",
  },
  description:
    "An applied AI lab building research, agents, and nessa-ui: the component layer everything we ship is made of.",
  openGraph: {
    title: "Nessa Labs",
    description: "The AI stack for modern humans.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${jetbrains.variable} ${inter.variable}`}
    >
      <body className="min-h-screen antialiased">
        {/* Applies the stored theme before first paint. */}
        <Script
          id="nessa-theme"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: themeScript }}
        />
        <SiteNav />
        <main>{children}</main>
      </body>
    </html>
  );
}
