import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Merge Tailwind class names, de-duplicating conflicts. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type TocHeading = {
  id: string;
  text: string;
  level: 2 | 3;
};

export function extractHeadings(html: string): TocHeading[] {
  const headings: TocHeading[] = [];

  const regex = /<(h1|h2|h3)(?:\s[^>]*)?>(.*?)<\/\1>/gi;

  let match;

  while ((match = regex.exec(html)) !== null) {
    const level = Number(match[1].substring(1)) as 2 | 3;

    const text = match[2]
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .trim();

    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

    headings.push({
      id,
      text,
      level,
    });
  }

  return headings;
}
