import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import Head from "next/head";
import "./globals.css";
import { NavHeader } from "@/components/nav-header/nav-header";

// Configure the Poppins font with desired weights and subsets.
const poppins = Poppins({
  weight: ["400", "800"],
  subsets: ["latin"],
  variable: "--font-poppins",
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
    <html lang="en" className={poppins.variable} suppressHydrationWarning>
      <Head>
        <title>{(metadata as any).title}</title>
        <meta name="description" content={metadata.description!} />
      </Head>
      <body className="antialiased bg-stone-100" suppressHydrationWarning>
        {/* Navigation Header */}
        <NavHeader />

        {/* Main Content with margin-top to avoid overlap */}
        <main className="flex flex-col min-h-screen mt-16">{children}</main>
      </body>
    </html>
  );
}