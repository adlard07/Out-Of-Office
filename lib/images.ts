/**
 * Image resolution lives here so real photo APIs (Unsplash, our own CDN,
 * user uploads) can replace the mock source without touching components.
 *
 * Mock strategy: curated Unsplash CDN photo ids, with a deterministic
 * Picsum fallback wired up in <SmartImage /> via onError.
 */

export function photo(id: string, w = 1400, q = 75): string {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=${q}`;
}

export function fallbackPhoto(seed: string, w = 1400, h = 900): string {
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/${w}/${h}`;
}
