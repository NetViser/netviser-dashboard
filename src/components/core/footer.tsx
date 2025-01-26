"use client";

import { FaTwitter, FaYoutube, FaInstagram } from "react-icons/fa";

const links = [
  { link: "#", label: "Contact" },
  { link: "#", label: "Privacy" },
  { link: "#", label: "Blog" },
  { link: "#", label: "Store" },
  { link: "#", label: "Careers" },
];

export default function Footer() {
  const items = links.map((link) => (
    <a
      key={link.label}
      href={link.link}
      onClick={(event) => event.preventDefault()}
      className="text-gray-300 hover:text-orange-400 transition-colors"
    >
      {link.label}
    </a>
  ));

  return (
    <div className="mt-30 border-t border-gray-700 bg-black text-white">
      <div className="container mx-auto flex justify-between items-center px-4 py-6 flex-col sm:flex-row">
        {/* Logo */}
        <div className="flex justify-center sm:justify-start">
          <img src="/netviser.svg" alt="NetViser Logo" className="w-12 h-12" />
        </div>

        {/* Links */}
        <div className="flex flex-wrap justify-center sm:justify-start gap-4 mt-4 sm:mt-0">
          {items}
        </div>

        {/* Social Icons */}
        <div className="flex gap-4 mt-4 sm:mt-0">
          <a
            href="#"
            className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-all"
            aria-label="Twitter"
          >
            <FaTwitter className="w-5 h-5 text-white" />
          </a>
          <a
            href="#"
            className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-all"
            aria-label="YouTube"
          >
            <FaYoutube className="w-5 h-5 text-white" />
          </a>
          <a
            href="#"
            className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-all"
            aria-label="Instagram"
          >
            <FaInstagram className="w-5 h-5 text-white" />
          </a>
        </div>
      </div>
    </div>
  );
}
