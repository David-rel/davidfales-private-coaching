export interface Photo {
  id: string;
  title: string;
  description: string | null;
  slug: string;
  image_url: string;

  // SEO
  meta_title: string | null;
  meta_description: string | null;
  alt_text: string;
  keywords: string[] | null;

  // Photo metadata
  photo_date: string | null;
  photographer: string | null;
  location: string | null;
  category: string | null;

  // Image properties
  width: number | null;
  height: number | null;
  file_size: number | null;

  // Display
  featured: boolean;
  published: boolean;
  display_order: number;

  // Timestamps
  created_at: string;
  updated_at: string;
}

export interface PhotoListItem {
  id: string;
  title: string;
  slug: string;
  image_url: string;
  alt_text: string;
  featured: boolean;
  published: boolean;
  category: string | null;
  created_at: string;
}
