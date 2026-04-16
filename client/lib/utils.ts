import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function extractPageFromNext(
  nextUrl?: string | null,
): number | undefined {
  if (!nextUrl) return undefined;
  try {
    const u = new URL(nextUrl);
    const p = u.searchParams.get("page");
    return p ? Number(p) : undefined;
  } catch {
    // fallback: if nextUrl is relative
    const m = /[?&]page=(\d+)/.exec(nextUrl);
    return m ? Number(m[1]) : undefined;
  }
}
