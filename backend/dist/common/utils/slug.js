export const slugify = (text) => text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
export async function uniqueSlug(name, exists) {
    const base = slugify(name) || 'item';
    let candidate = base;
    let counter = 2;
    while (await exists(candidate)) {
        candidate = `${base}-${counter++}`;
    }
    return candidate;
}
//# sourceMappingURL=slug.js.map