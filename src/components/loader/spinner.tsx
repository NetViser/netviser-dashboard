"use client";

import { useState, useEffect } from "react";
import { GridLoader } from "react-spinners";

export default function Spinner() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex items-center justify-center w-full h-full">
      <GridLoader
        color="#ff7300"
        loading
        size={20}
        speedMultiplier={2}
      />
    </div>
  );
}
