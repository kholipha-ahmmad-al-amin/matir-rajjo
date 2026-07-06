import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { ScrollToTop } from "@/components/shared/ScrollToTop";
import { WhatsAppFloat } from "@/components/shared/WhatsAppFloat";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://matir-rajjo.equisaas-bd.com"),
  title: {
    default: "মাটির রাজ্য | Matir Rajjo - খাঁটি দেশীয় মাটির পণ্য",
    template: "%s | মাটির রাজ্য",
  },
  description:
    "স্বাগতম মাটির রাজ্যে — যেখানে ঐতিহ্য মিশে যায় আভিজাত্যের সঙ্গে। বাংলাদেশের দক্ষ কারিগরদের হাতে তৈরি প্রিমিয়াম কোয়ালিটির মাটির পণ্য। সারা বাংলাদেশে ডেলিভারি।",
  keywords: [
    "matir rajjo",
    "মাটির রাজ্য",
    "clay products Bangladesh",
    "premium clay craft",
    "bangladesh pottery",
    "traditional craft",
    "home decor Bangladesh",
    "মাটির পণ্য",
    "মৃৎশিল্প",
    "terracotta",
    "handmade pottery",
    "বাংলাদেশি মাটির শিল্প",
    "কারুশিল্প",
    "e-commerce Bangladesh",
    "online pottery shop",
  ],
  authors: [
    {
      name: "Kholipha Ahmmad Al-Amin (EquiSaaS BD)",
      url: "https://kholipha-ahmmad-al-amin.equisaas-bd.com/",
    },
  ],
  creator: "Kholipha Ahmmad Al-Amin",
  publisher: "EquiSaaS BD",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "মাটির রাজ্য | Matir Rajjo - খাঁটি দেশীয় মাটির পণ্য",
    description:
      "স্বাগতম মাটির রাজ্যে — যেখানে ঐতিহ্য মিশে যায় আভিজাত্যের সঙ্গে। প্রিমিয়াম মাটির পণ্য।",
    url: "https://matir-rajjo.equisaas-bd.com",
    siteName: "Matir Rajjo",
    images: [
      {
        url: "/opengraph-image.jpg",
        width: 1200,
        height: 630,
        alt: "Matir Rajjo - Premium Bangladeshi Clay Products",
      },
    ],
    locale: "bn_BD",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "মাটির রাজ্য | Matir Rajjo",
    description: "খাঁটি দেশীয় মাটির পণ্য — ঐতিহ্য ও আভিজাত্য",
    images: ["/opengraph-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/icon.png",
  },
  verification: {
    google: "google-site-verification=matirrajjo",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="bn"
      className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col scroll-smooth`}
    >
      <head>
        {/* JSON-LD Structured Data: Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "মাটির রাজ্য",
              alternateName: "Matir Rajjo",
              url: "https://matir-rajjo.equisaas-bd.com",
              logo: "https://matir-rajjo.equisaas-bd.com/logo.png",
              description:
                "বাংলাদেশের দক্ষ কারিগরদের হাতে তৈরি প্রিমিয়াম মাটির পণ্য।",
              address: {
                "@type": "PostalAddress",
                addressLocality: "মিরপুর ১০",
                addressRegion: "ঢাকা",
                addressCountry: "BD",
              },
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+8801352492238",
                contactType: "customer service",
                availableLanguage: ["bn", "en"],
              },
              sameAs: [
                "https://www.instagram.com/matir_rajjo/",
                "https://equisaas-bd.com/",
              ],
              founder: {
                "@type": "Person",
                name: "Kholipha Ahmmad Al-Amin",
                url: "https://kholipha-ahmmad-al-amin.equisaas-bd.com/",
              },
            }),
          }}
        />
        {/* JSON-LD Structured Data: WebSite with SearchAction */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "মাটির রাজ্য",
              alternateName: "Matir Rajjo",
              url: "https://matir-rajjo.equisaas-bd.com",
              potentialAction: {
                "@type": "SearchAction",
                target: "https://matir-rajjo.equisaas-bd.com/shop?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </head    >
      <body className="min-h-full flex flex-col">
        <Navbar />
        <main className="flex-1">
          <ErrorBoundary>{children}</ErrorBoundary>
        </main>
        <Footer />
        <ScrollToTop />
        <WhatsAppFloat />
      </body>
    </html>
  );
}
