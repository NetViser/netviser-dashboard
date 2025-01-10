import Link from "next/link";
import Image from "next/image";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <Image
        src="/404-not-found.png"
        alt="404"
        width={300}
        height={300}
        className="mb-6"
      />
      <div className="space-y-4 mb-6">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl dark:text-yellow-400">
          Oops! Page Not Found
        </h1>
        <p className="text-gray-500 dark:text-gray-300 text-lg">
          Sorry, we couldn't find the page you're looking for.
        </p>
      </div>
      <Link href="/">
        <button className="bg-black dark:bg-white text-white dark:text-black dark:hover:bg-white/90 hover:bg-black/85 text-lg font-semibold px-8">
          Back to Home
        </button>
      </Link>
    </div>
  );
}
