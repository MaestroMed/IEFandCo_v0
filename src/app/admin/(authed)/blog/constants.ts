export const BLOG_CATEGORIES = ["Guide", "Normes", "Technique", "Case Study"] as const;
export type BlogCategory = typeof BLOG_CATEGORIES[number];
