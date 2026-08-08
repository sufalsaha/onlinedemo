export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string | null;
  category: string;
  tags: string[];
  authorName: string;
  authorAvatar: string | null;
  readingTime: number;
  viewCount: number;
  publishedAt: Date | null;
  createdAt: Date;
}
