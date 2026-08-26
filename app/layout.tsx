import type { Metadata } from "next";
import Script from "next/script";
import {
  Geist,
  Geist_Mono,
  IBM_Plex_Mono,
  Inter,
  JetBrains_Mono,
  Source_Serif_4,
} from "next/font/google";
import { ThemeProvider, themeScript } from "@/components/site/theme";
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

// Offered by the harness's appearance settings. nessa-ui resolves every
// surface through --nessa-font-sans / --nessa-font-mono, so switching a font
// is a variable swap.
const geist = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-mono",
  display: "swap",
});
const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-source-serif",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://nessalabs.ai"),
  title: {
    default: "Nessa Labs",
    template: "%s · Nessa Labs",
  },
  description:
    "An applied AI lab building agents and the interfaces they run in. Home of nessa-ui.",
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
      className={`${jetbrains.variable} ${inter.variable} ${geist.variable} ${geistMono.variable} ${plexMono.variable} ${sourceSerif.variable}`}
    >
      <body className="min-h-screen antialiased">
        {/* Applies the stored theme before first paint. */}
        <Script
          id="nessa-theme"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: themeScript }}
        />
        <ThemeProvider>
          <SiteNav />
          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
