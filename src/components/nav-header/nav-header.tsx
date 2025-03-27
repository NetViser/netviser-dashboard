"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSessionStore } from "@/store/session";
import { useState } from "react";

const links = [
  { link: "/dashboard", label: "Dashboard" },
  { link: "/attack-detection", label: "Attack Detection" },
];

export function NavHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const { isActiveSession } = useSessionStore();

  // Conditional "Upload" link
  const extraLink =
    isActiveSession && pathname !== "/" && (
      <li key="Upload">
        <Link
          href="/"
          className="px-4 py-2 text-gray-300 hover:text-white hover:bg-orange-500/80 rounded-md transition-all duration-300"
        >
          Upload
        </Link>
      </li>
    );

  const items = links.map((link) => (
    <li key={link.label}>
      <Link
        href={link.link}
        className={`px-4 py-2 rounded-md ${
          pathname.includes(link.link)
            ? "text-white bg-orange-500/80"
            : "text-gray-300"
        } hover:text-white hover:bg-orange-500/80 transition-all duration-300 ${
          isActiveSession ? "cursor-pointer" : "cursor-not-allowed opacity-50"
        }`}
        style={{ pointerEvents: isActiveSession ? "auto" : "none" }}
      >
        {link.label}
      </Link>
    </li>
  ));

  const allItems = (
    <>
      {items}
      {extraLink}
    </>
  );

  return (
    <header className="bg-black/90 backdrop-blur-md text-gray-100 shadow-lg fixed top-0 w-full z-50">
      <div className="container mx-auto px-6 flex items-center justify-between h-16">
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-3">
          <img
            src="/netviser.svg"
            alt="NetViser Logo"
            className="w-8 h-8 transition-transform duration-300 hover:scale-110"
          />
          <h1 className="text-xl font-light tracking-wide">NetViser</h1>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden sm:block">
          <ul className="flex items-center space-x-6">{allItems}</ul>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="sm:hidden p-2 rounded-full hover:bg-gray-700/50 focus:outline-none transition-colors duration-300"
        >
          <span className="sr-only">Open menu</span>
          {menuOpen ? (
            <svg
              className="h-6 w-6 text-gray-300"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="h-6 w-6 text-gray-300"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <nav className="sm:hidden bg-gray-900/95 backdrop-blur-md border-t border-gray-800">
          <ul className="flex flex-col space-y-4 p-6">{allItems}</ul>
        </nav>
      )}
    </header>
  );
}