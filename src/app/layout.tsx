import type { Metadata } from "next";
import { Cormorant_Garamond, Montserrat } from "next/font/google";
import "@/app/globals.css";
import { PastryNavbar } from "@/components/ui/pastry-navbar";
import { Footer } from "@/components/ui/footer";
import { Providers } from "@/app/providers";
import { getCloudinaryUrl } from "@/lib/cloudinary-url";

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-montserrat",
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#FDF2F8", // Light pink background
};

export const metadata: Metadata = {
  title: "Keilah's Cakes & Pastries",
  description: "Handcrafted cakes and pastries for your special moments",
  icons: {
    icon: [
      {
        url: getCloudinaryUrl("/logo.png"),
        type: "image/png",
      }
    ],
    apple: [
      {
        url: getCloudinaryUrl("/logo.png"),
        type: "image/png",
      }
    ],
  },
  metadataBase: new URL('https://keilahs-cakes-and-pastries.vercel.app'),
  openGraph: {
    title: "Keilah's Cakes & Pastries",
    description: "Handcrafted cakes and pastries for your special moments",
    images: [{ url: getCloudinaryUrl("/logo.png") }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Keilah's Cakes & Pastries",
    description: "Handcrafted cakes and pastries for your special moments",
    images: [getCloudinaryUrl("/logo.png")]
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${cormorantGaramond.variable} ${montserrat.variable} antialiased`}>
        <Providers>
          <div className="min-h-screen flex flex-col bg-background font-sans">
            <PastryNavbar />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
