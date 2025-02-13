"use client";

import Link from "next/link";
import Image from "next/image";

export default function NotFoundPage() {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="flex flex-col items-center justify-center h-full text-center">
        <Image
          src="/404-not-found.png"
          alt="404"
          width={300}
          height={300}
          className="mb-6"
        />
        <div className="space-y-4 mb-6">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl text-yellow-500">
            Oops! Page Not Found
          </h1>
          <p className="text-gray-500 text-lg">
            Sorry, we couldn't find the page you're looking for.
          </p>
        </div>
        <Link href="/">
          <a className="px-6 py-3 bg-orange-500 text-white font-semibold text-lg rounded-md hover:bg-orange-600 transition-colors">
            Back to Home
          </a>
        </Link>
      </div>
    </div>
  );
}
