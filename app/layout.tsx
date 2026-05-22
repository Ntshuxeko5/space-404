import type { Metadata } from "next";
import { Playfair_Display, Montserrat } from "next/font/google";
import "./globals.css";
import Header from './components/Header';
import Footer from './components/Footer';

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: '--font-playfair',
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: '--font-montserrat',
});

export const metadata: Metadata = {
  title: "SPACE 404 - Exclusive High-End Streetwear",
  description: "Discover unique, high-value streetwear that sets you apart. SPACE 404 creates exclusive pieces for those who dare to be extraordinary.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${montserrat.variable} font-sans min-h-screen flex flex-col antialiased bg-white selection:bg-luxury-red selection:text-luxury-cream`}>
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
