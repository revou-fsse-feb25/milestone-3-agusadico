import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// import MobileMenu from '../components/MobileMenu'; // Incorrect
// import MobileMenu from '../components/MobileMenu'; // Correct if file exists

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RevoShop No.1 online shop in Indonesia",
  description: "RevoShop providing the best online shopping experience in Indonesia with offers a wide range of products, competitive prices, and excellent customer service",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* ...Navbar... */}
        {/* <MobileMenu /> */}
        {children}
      </body>
    </html>
  );
}
