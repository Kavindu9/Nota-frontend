import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import "@fontsource-variable/noto-serif-display/wdth.css";
import "@fontsource-variable/inter";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = { 
  title: "Nota pen", description: "Nota pen specifications" 
};


export async function generateMetadata(): Promise<Metadata> {
  try {
    const { siteName, seo } = await getGlobal();
    if (!seo) return FALLBACK;
    return {
      metadataBase: new URL(process.env.SITE_URL ?? "http://localhost:3000"),
      title: seo.metaTitle,
      description: seo.metaDescription,
      openGraph: { type: "website", siteName, title: seo.metaTitle, description: seo.metaDescription, images },
      twitter: { card: "summary_large_image", title: seo.metaTitle, description: seo.metaDescription },
      robots: seo.preventIndexing ? { index: false, follow: false } : undefined,
    };
  } catch {
    return FALLBACK; // Strapi unreachable → still a sensible title
  }
}



export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
