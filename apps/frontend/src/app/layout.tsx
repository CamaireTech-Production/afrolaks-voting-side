import type { Metadata } from "next";
import "./globals.css";
// Global styles from Afrolaks design system
import '../styles/fonts.css';
import '../styles/theme.css';
import '../styles/index.css';

import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Afrolaks Nightlife Awards | Celebrating African Nightlife Excellence",
  description: "The premier nightlife recognition platform celebrating DJs, MCs, Influencers, and Event Organizers who define African nightlife culture.",
  metadataBase: new URL('https://afrolaks.com'), // Replace with your actual domain when ready
  openGraph: {
    title: "Afrolaks Nightlife Awards",
    description: "Celebrating the icons of African Nightlife - DJs, MCs, Influencers, and Organizers.",
    url: 'https://afrolaks.com',
    siteName: 'Afrolaks',
    images: [
      {
        url: '/logo.png', // Main logo for link previews
        width: 800,
        height: 800,
        alt: 'Afrolaks Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Afrolaks Nightlife Awards',
    description: 'Celebrating the icons of African Nightlife.',
    images: ['/logo.png'],
  },
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-black text-white min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
