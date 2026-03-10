import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines multiple class names and merges Tailwind classes efficiently.
 * Used to prevent style conflicts when passing className props to components.
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
