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

  const items = links.map((link) => (
    <li key={link.label}>
      <Link
        href={link.link}
        className={`px-4 py-2 rounded ${
          pathname.includes(link.link) ? "bg-orange-500 text-white" : "text-gray-300"
        } hover:bg-orange-400 transition-colors ${
          isActiveSession ? "cursor-pointer" : "cursor-not-allowed"
        }`}
        style={{ pointerEvents: isActiveSession ? "auto" : "none" }}
      >
        {link.label}
      </Link>
    </li>
  ));

  return (
    <header className="bg-stone-900 text-gray-100 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-2">
          <img src="/netviser.svg" alt="NetViser Logo" className="w-10 h-10" />
          <h1 className="text-xl font-semibold">NetViser</h1>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden sm:block">
          <ul className="flex items-center space-x-4">{items}</ul>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="sm:hidden p-2 rounded-md hover:bg-gray-700 focus:outline-none"
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
        <nav className="sm:hidden bg-stone-800">
          <ul className="flex flex-col space-y-2 p-4">{items}</ul>
        </nav>
      )}
    </header>
  );
}
