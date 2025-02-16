import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateMean(values: number[]) {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}
