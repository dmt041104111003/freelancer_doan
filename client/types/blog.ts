export type BlogTagId = "meo-hay" | "tin-tuc" | "su-kien" | "huong-dan";

export interface BlogArticle {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  tags: BlogTagId[];
  date: string;
  readTime: string;
  views?: number;
}

export interface BlogTocItem {
  id: string;
  label: string;
}

export interface BlogPostContent {
  toc: BlogTocItem[];
  intro: string[];
  sections: Array<{
    id: string;
    title: string;
    paragraphs: string[];
  }>;
}
