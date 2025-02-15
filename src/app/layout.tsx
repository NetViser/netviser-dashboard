import type { Metadata } from "next";
import localFont from "next/font/local";
import Head from "next/head";
import "./globals.css";
import { NavHeader } from "@/components/nav-header/nav-header";
import Footer from "@/components/core/footer";

// Local fonts setup
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "NetViser",
  description: "Visualize your network",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <Head>
        <title>{(metadata as any).title}</title>
        <meta name="description" content={(metadata as any).description} />
      </Head>
      <body className="antialiased bg-stone-100" suppressHydrationWarning>
        {/* Navigation Header */}
        <NavHeader />

        {/* Main Content */}
        <main className="flex flex-col min-h-screen">{children}</main>

      </body>
    </html>
  );
}
