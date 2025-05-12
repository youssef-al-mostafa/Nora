import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatDate(dateString: string | null | undefined, fallbackText: string = 'Invalid date'): string {
    if (!dateString) {
      return fallbackText;
    }

    try {
      const date = new Date(dateString);

      if (isNaN(date.getTime())) {
        return fallbackText;
      }

      return new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }).format(date);
    } catch (error) {
      console.error('Error formatting date:', error);
      return fallbackText;
    }
  }
