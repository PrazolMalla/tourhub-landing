/**
 * Turn a pasted YouTube/Vimeo link (watch, share, shorts or embed URL) into an
 * iframe-embeddable URL. Returns undefined for empty or unrecognised input so
 * callers can simply skip rendering the player.
 */
export function toVideoEmbedUrl(raw: string | undefined): string | undefined {
  if (!raw) return undefined;
  let url: URL;
  try {
    url = new URL(raw.trim());
  } catch {
    return undefined;
  }
  const host = url.hostname.replace(/^www\.|^m\./, '');

  if (host === 'youtu.be') {
    const id = url.pathname.slice(1).split('/')[0];
    return id ? `https://www.youtube.com/embed/${id}` : undefined;
  }
  if (host === 'youtube.com' || host === 'youtube-nocookie.com') {
    const [, first, second] = url.pathname.split('/');
    if (first === 'embed' && second) return `https://www.youtube.com/embed/${second}`;
    if ((first === 'shorts' || first === 'live') && second) {
      return `https://www.youtube.com/embed/${second}`;
    }
    const id = url.searchParams.get('v');
    return id ? `https://www.youtube.com/embed/${id}` : undefined;
  }
  if (host === 'player.vimeo.com') return url.toString();
  if (host === 'vimeo.com') {
    const id = url.pathname.split('/').find((seg) => /^\d+$/.test(seg));
    return id ? `https://player.vimeo.com/video/${id}` : undefined;
  }
  return undefined;
}
