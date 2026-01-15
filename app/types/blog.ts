export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: any; // Tiptap JSON
  content_html: string;
  featured_image_url: string | null;
  author_name: string;
  published: boolean;
  published_at: Date | null;
  created_at: Date;
  updated_at: Date;
  view_count: number;
  meta_title: string | null;
  meta_description: string | null;
}

export interface Comment {
  id: string;
  post_id: string;
  author_name: string;
  author_email: string;
  content: string;
  approved: boolean;
  created_at: Date;
}

export interface Like {
  id: string;
  post_id: string;
  ip_address: string;
  created_at: Date;
}

// For API responses
export interface BlogPostWithCounts extends BlogPost {
  comment_count?: number;
  like_count?: number;
}

export interface BlogPostListItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  featured_image_url: string | null;
  published_at: Date | null;
  author_name: string;
  view_count: number;
  comment_count: number;
  like_count: number;
}
