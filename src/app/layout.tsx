import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { getGlobal } from "@/lib/strapi";

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

// export const metadata: Metadata = {
//   title: "Nota pen",
//   description: "Nota pen specifications",
// };


const FALLBACK = {
  title: "Nōta",
  description: "Smart pen for real thinking.",
};


export async function generateMetadata(): Promise<Metadata> {

  const global = await getGlobal(); // null if Strapi refused or couldn't be reached
  const seo = global?.seo;
  if (!seo) return FALLBACK;

  
  try {
    const { siteName, seo } = await getGlobal();
    if (!seo) return FALLBACK;

    const image = seo.shareImage;
    const images = image
      ? [{ url: image.url, width: image.width ?? undefined, height: image.height ?? undefined, alt: image.alternativeText ?? seo.metaTitle }]
      : undefined;


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
