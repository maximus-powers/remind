import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// from vercel v0
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
