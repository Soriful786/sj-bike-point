export const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

/** Returns "oil-change", or "oil-change-2", "oil-change-3"... if taken. */
export async function uniqueSlug(
  name: string,
  exists: (slug: string) => Promise<boolean>,
): Promise<string> {
  const base = slugify(name) || 'item';
  let candidate = base;
  let counter = 2;
  while (await exists(candidate)) {
    candidate = `${base}-${counter++}`;
  }
  return candidate;
}