import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { AnalyticsTracker } from "@/components/analytics-tracker";
import { Header } from "@/components/header";
import { profile } from "@/content/portfolio";
import "./globals.css";

const poppins = localFont({
  variable: "--font-sans",
  display: "swap",
  preload: false,
  src: [
    { path: "../fonts/poppins-regular.woff2", weight: "400", style: "normal" },
    { path: "../fonts/poppins-medium.woff2", weight: "500", style: "normal" },
    { path: "../fonts/poppins-semibold.woff2", weight: "600", style: "normal" },
  ],
});

const lora = localFont({
  variable: "--font-serif",
  display: "swap",
  src: [
    { path: "../fonts/lora-regular.woff", weight: "400", style: "normal" },
    { path: "../fonts/lora-italic.woff", weight: "400", style: "italic" },
  ],
});

export const metadata: Metadata = {
  metadataBase: new URL(profile.siteUrl),
  title: {
    default: profile.seo.title,
    template: `%s — ${profile.name}`,
  },
  description: profile.seo.description,
  alternates: {
    canonical: "/",
  },
  authors: [{ name: profile.name, url: profile.siteUrl }],
  creator: profile.name,
  keywords: [
    "Avishek Choudhury",
    "software engineer",
    "backend engineer",
    "full-stack developer",
    "distributed systems",
    "applied AI",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: profile.siteUrl,
    siteName: profile.name,
    title: profile.seo.title,
    description: profile.seo.description,
  },
  twitter: {
    card: "summary_large_image",
    title: profile.seo.title,
    description: profile.seo.description,
    images: ["/opengraph-image"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f4ef" },
    { media: "(prefers-color-scheme: dark)", color: "#111210" },
  ],
};

const themeScript = `
  (() => {
    try {
      const saved = localStorage.getItem("theme");
      const dark = saved === "dark" || (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches);
      document.documentElement.classList.toggle("dark", dark);
      document.documentElement.style.colorScheme = dark ? "dark" : "light";
    } catch (_) {}
  })();
`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${poppins.variable} ${lora.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <a href="#main-content" className="skip-link">Skip to content</a>
        <Header />
        <main id="main-content" className="pb-20 sm:pb-28 lg:pb-32">{children}</main>
        <AnalyticsTracker />
      </body>
    </html>
  );
}
