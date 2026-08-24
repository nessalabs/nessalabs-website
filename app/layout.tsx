import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { themeScript } from "@/components/nessa-ui";
import { SiteNav } from "@/components/site/site-nav";
import { SiteFooter } from "@/components/site/site-footer";
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
      <head>
        {/* Applies the stored theme before first paint. */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen antialiased">
        <SiteNav />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
