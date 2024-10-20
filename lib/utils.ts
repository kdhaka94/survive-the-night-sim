import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function errorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : typeof error === "string"
      ? error
      : "An unexpected error occurred";
}
