import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateMean(values: number[]) {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export function clearSavedState() {
  // Define the prefixes for keys you want to remove.
  const prefixes = ["explainability-mode-", "attack-visualizations-active-tab-"];
  
  // Loop through all keys in localStorage
  Object.keys(localStorage).forEach((key) => {
    // If the key starts with any of our defined prefixes, remove it.
    if (prefixes.some(prefix => key.startsWith(prefix))) {
      localStorage.removeItem(key);
    }
  });
}
