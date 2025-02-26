import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
// from vercel v0
export function cn(...inputs) {
    return twMerge(clsx(inputs));
}
