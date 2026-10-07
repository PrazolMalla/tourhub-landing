import { redirect } from 'next/navigation';

/** Keep old bookmarks and indexed links working after renaming the listing to Explore. */
export default async function ToursRedirect({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = new URLSearchParams();
  Object.entries(await searchParams).forEach(([key, value]) => {
    if (Array.isArray(value)) value.forEach((item) => params.append(key, item));
    else if (value !== undefined) params.set(key, value);
  });
  redirect(`/explore${params.size ? `?${params.toString()}` : ''}`);
}
