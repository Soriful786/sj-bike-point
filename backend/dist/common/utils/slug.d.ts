export declare const slugify: (text: string) => string;
export declare function uniqueSlug(name: string, exists: (slug: string) => Promise<boolean>): Promise<string>;
