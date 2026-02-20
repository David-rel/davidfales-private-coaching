import { pool } from "../db";
import {
  BlogPost,
  Comment,
  Like,
  BlogPostListItem,
  BlogPostWithCounts,
} from "@/app/types/blog";
import { Photo, PhotoListItem } from "@/app/types/gallery";
import {
  GroupSessionWithAvailability,
  PlayerSignup,
} from "@/app/types/groupSessions";
import crypto from "crypto";

// ========== BLOG POSTS ==========

export async function getPublishedPosts(
  limit = 10,
  offset = 0
): Promise<BlogPostListItem[]> {
  const result = await pool.query(
    `SELECT
      bp.id, bp.title, bp.slug, bp.excerpt, bp.featured_image_url, bp.view_count,
      bp.published_at, bp.author_name,
      (SELECT COUNT(*)::int FROM blog_comments WHERE post_id = bp.id AND approved = true) as comment_count,
      (SELECT COUNT(*)::int FROM blog_likes WHERE post_id = bp.id) as like_count
     FROM blog_posts bp
     WHERE bp.published = true
     ORDER BY bp.published_at DESC
     LIMIT $1 OFFSET $2`,
    [limit, offset]
  );
  return result.rows;
}

export async function getPostBySlug(
  slug: string,
  options?: { incrementView?: boolean }
): Promise<BlogPostWithCounts | null> {
  const result = await pool.query(
    `SELECT
      bp.*,
      (SELECT COUNT(*)::int FROM blog_comments WHERE post_id = bp.id AND approved = true) as comment_count,
      (SELECT COUNT(*)::int FROM blog_likes WHERE post_id = bp.id) as like_count
     FROM blog_posts bp
     WHERE bp.slug = $1 AND bp.published = true`,
    [slug]
  );

  if (result.rows[0]) {
    const shouldIncrement = options?.incrementView !== false;
    if (shouldIncrement) {
      // Increment view count
      await pool.query(
        "UPDATE blog_posts SET view_count = view_count + 1 WHERE id = $1",
        [result.rows[0].id]
      );
    }
  }

  return result.rows[0] || null;
}

export async function getPostById(id: string): Promise<BlogPost | null> {
  const result = await pool.query("SELECT * FROM blog_posts WHERE id = $1", [
    id,
  ]);
  return result.rows[0] || null;
}

export async function getAllPostsForAdmin(
  limit = 50,
  offset = 0
): Promise<BlogPost[]> {
  const result = await pool.query(
    `SELECT * FROM blog_posts
     ORDER BY created_at DESC
     LIMIT $1 OFFSET $2`,
    [limit, offset]
  );
  return result.rows;
}

export async function createPost(post: Partial<BlogPost>): Promise<BlogPost> {
  const id = crypto.randomUUID();
  const {
    title,
    slug,
    excerpt,
    content,
    content_html,
    featured_image_url,
    author_name = "David Fales",
    published = false,
    published_at,
    meta_title,
    meta_description,
  } = post;

  const result = await pool.query(
    `INSERT INTO blog_posts (
      id, title, slug, excerpt, content, content_html, featured_image_url,
      author_name, published, published_at, meta_title, meta_description
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
    RETURNING *`,
    [
      id,
      title,
      slug,
      excerpt,
      content,
      content_html,
      featured_image_url,
      author_name,
      published,
      published ? published_at || new Date() : null,
      meta_title,
      meta_description,
    ]
  );

  return result.rows[0];
}

export async function updatePost(
  id: string,
  updates: Partial<BlogPost>
): Promise<BlogPost> {
  const {
    title,
    slug,
    excerpt,
    content,
    content_html,
    featured_image_url,
    author_name,
    published,
    meta_title,
    meta_description,
  } = updates;

  // If publishing for the first time, set published_at
  let published_at = updates.published_at;
  if (published && !published_at) {
    const existing = await getPostById(id);
    if (existing && !existing.published_at) {
      published_at = new Date();
    }
  }

  const result = await pool.query(
    `UPDATE blog_posts SET
      title = COALESCE($2, title),
      slug = COALESCE($3, slug),
      excerpt = COALESCE($4, excerpt),
      content = COALESCE($5, content),
      content_html = COALESCE($6, content_html),
      featured_image_url = COALESCE($7, featured_image_url),
      author_name = COALESCE($8, author_name),
      published = COALESCE($9, published),
      published_at = CASE
        WHEN $9 = false THEN NULL
        ELSE COALESCE($10, published_at)
      END,
      meta_title = COALESCE($11, meta_title),
      meta_description = COALESCE($12, meta_description),
      updated_at = CURRENT_TIMESTAMP
     WHERE id = $1
     RETURNING *`,
    [
      id,
      title,
      slug,
      excerpt,
      content,
      content_html,
      featured_image_url,
      author_name,
      published,
      published_at,
      meta_title,
      meta_description,
    ]
  );

  return result.rows[0];
}

export async function deletePost(id: string): Promise<void> {
  await pool.query("DELETE FROM blog_posts WHERE id = $1", [id]);
}

export async function checkSlugExists(
  slug: string,
  excludeId?: string
): Promise<boolean> {
  const result = await pool.query(
    excludeId
      ? "SELECT id FROM blog_posts WHERE slug = $1 AND id != $2"
      : "SELECT id FROM blog_posts WHERE slug = $1",
    excludeId ? [slug, excludeId] : [slug]
  );
  return result.rows.length > 0;
}

// ========== COMMENTS ==========

export async function getCommentsByPostId(
  postId: string,
  approvedOnly = true
): Promise<Comment[]> {
  const query = approvedOnly
    ? "SELECT * FROM blog_comments WHERE post_id = $1 AND approved = true ORDER BY created_at ASC"
    : "SELECT * FROM blog_comments WHERE post_id = $1 ORDER BY created_at ASC";

  const result = await pool.query(query, [postId]);
  return result.rows;
}

export async function getAllCommentsForAdmin(): Promise<Comment[]> {
  const result = await pool.query(
    "SELECT * FROM blog_comments ORDER BY created_at DESC"
  );
  return result.rows;
}

export async function getAllCommentsForAdminWithPost(postId?: string): Promise<
  Array<
    Comment & {
      post_title: string | null;
      post_slug: string | null;
    }
  >
> {
  if (postId) {
    const result = await pool.query(
      `SELECT c.*, bp.title as post_title, bp.slug as post_slug
       FROM blog_comments c
       LEFT JOIN blog_posts bp ON bp.id = c.post_id
       WHERE c.post_id = $1
       ORDER BY c.created_at DESC`,
      [postId]
    );
    return result.rows;
  }

  const result = await pool.query(
    `SELECT c.*, bp.title as post_title, bp.slug as post_slug
     FROM blog_comments c
     LEFT JOIN blog_posts bp ON bp.id = c.post_id
     ORDER BY c.created_at DESC`
  );
  return result.rows;
}

export async function createComment(
  comment: Partial<Comment>
): Promise<Comment> {
  const { post_id, author_name, author_email, content } = comment;
  const id = crypto.randomUUID();

  const result = await pool.query(
    `INSERT INTO blog_comments (id, post_id, author_name, author_email, content, approved)
     VALUES ($1, $2, $3, $4, $5, false)
     RETURNING *`,
    [id, post_id, author_name, author_email, content]
  );

  return result.rows[0];
}

export async function approveComment(id: string): Promise<void> {
  await pool.query("UPDATE blog_comments SET approved = true WHERE id = $1", [
    id,
  ]);
}

export async function deleteComment(id: string): Promise<void> {
  await pool.query("DELETE FROM blog_comments WHERE id = $1", [id]);
}

// ========== LIKES ==========

export async function getLikeCount(postId: string): Promise<number> {
  const result = await pool.query(
    "SELECT COUNT(*)::int as count FROM blog_likes WHERE post_id = $1",
    [postId]
  );
  return result.rows[0].count;
}

export async function hasUserLiked(
  postId: string,
  ipAddress: string
): Promise<boolean> {
  const result = await pool.query(
    "SELECT id FROM blog_likes WHERE post_id = $1 AND ip_address = $2",
    [postId, ipAddress]
  );
  return result.rows.length > 0;
}

export async function toggleLike(
  postId: string,
  ipAddress: string
): Promise<{ liked: boolean; count: number }> {
  // Check if like exists
  const existing = await pool.query(
    "SELECT id FROM blog_likes WHERE post_id = $1 AND ip_address = $2",
    [postId, ipAddress]
  );

  if (existing.rows.length > 0) {
    // Unlike
    await pool.query("DELETE FROM blog_likes WHERE id = $1", [
      existing.rows[0].id,
    ]);
  } else {
    // Like
    const id = crypto.randomUUID();
    await pool.query(
      "INSERT INTO blog_likes (id, post_id, ip_address) VALUES ($1, $2, $3)",
      [id, postId, ipAddress]
    );
  }

  // Get updated count
  const count = await getLikeCount(postId);

  return {
    liked: existing.rows.length === 0,
    count,
  };
}

// ========== PHOTOS ==========

export async function getPublishedPhotos(
  limit = 100,
  offset = 0
): Promise<PhotoListItem[]> {
  const result = await pool.query(
    `SELECT id, title, slug, image_url, alt_text, featured, published, category, created_at
     FROM photos
     WHERE published = true
     ORDER BY featured DESC, display_order ASC, created_at DESC
     LIMIT $1 OFFSET $2`,
    [limit, offset]
  );
  return result.rows;
}

export async function getPhotoBySlug(slug: string): Promise<Photo | null> {
  const result = await pool.query(
    `SELECT * FROM photos WHERE slug = $1 AND published = true`,
    [slug]
  );
  return result.rows[0] || null;
}

export async function getPhotoById(id: string): Promise<Photo | null> {
  const result = await pool.query(`SELECT * FROM photos WHERE id = $1`, [id]);
  return result.rows[0] || null;
}

export async function getAllPhotosForAdmin(): Promise<Photo[]> {
  const result = await pool.query(
    `SELECT * FROM photos ORDER BY created_at DESC`
  );
  return result.rows;
}

export async function createPhoto(data: {
  title: string;
  description?: string;
  slug: string;
  image_url: string;
  alt_text: string;
  meta_title?: string;
  meta_description?: string;
  keywords?: string[];
  photo_date?: string;
  photographer?: string;
  location?: string;
  category?: string;
  width?: number;
  height?: number;
  file_size?: number;
  featured?: boolean;
  published?: boolean;
  display_order?: number;
}): Promise<Photo> {
  const id = crypto.randomUUID();
  const result = await pool.query(
    `INSERT INTO photos (
      id, title, description, slug, image_url, alt_text,
      meta_title, meta_description, keywords,
      photo_date, photographer, location, category,
      width, height, file_size,
      featured, published, display_order
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19
    ) RETURNING *`,
    [
      id,
      data.title,
      data.description || null,
      data.slug,
      data.image_url,
      data.alt_text,
      data.meta_title || null,
      data.meta_description || null,
      data.keywords || null,
      data.photo_date || null,
      data.photographer || null,
      data.location || null,
      data.category || null,
      data.width || null,
      data.height || null,
      data.file_size || null,
      data.featured || false,
      data.published || false,
      data.display_order || 0,
    ]
  );
  return result.rows[0];
}

export async function updatePhoto(
  id: string,
  data: Partial<Photo>
): Promise<Photo | null> {
  const fields: string[] = [];
  const values: unknown[] = [];
  let paramCount = 1;

  // Build dynamic update query
  Object.entries(data).forEach(([key, value]) => {
    if (key !== "id" && key !== "created_at" && key !== "updated_at") {
      fields.push(`${key} = $${paramCount}`);
      values.push(value);
      paramCount++;
    }
  });

  if (fields.length === 0) return null;

  values.push(id);
  const result = await pool.query(
    `UPDATE photos SET ${fields.join(", ")} WHERE id = $${paramCount} RETURNING *`,
    values
  );
  return result.rows[0] || null;
}

export async function deletePhoto(id: string): Promise<boolean> {
  const result = await pool.query(
    `DELETE FROM photos WHERE id = $1 RETURNING id`,
    [id]
  );
  return result.rowCount !== null && result.rowCount > 0;
}

export async function checkPhotoSlugExists(
  slug: string,
  excludeId?: string
): Promise<boolean> {
  const query = excludeId
    ? `SELECT id FROM photos WHERE slug = $1 AND id != $2`
    : `SELECT id FROM photos WHERE slug = $1`;
  const params = excludeId ? [slug, excludeId] : [slug];
  const result = await pool.query(query, params);
  return result.rows.length > 0;
}

// ========== GROUP SESSIONS ==========

export async function getUpcomingGroupSessions(
  limit = 50
): Promise<GroupSessionWithAvailability[]> {
  const result = await pool.query(
    `SELECT
      gs.*,
      COALESCE(ps.paid_signups, 0)::int AS paid_signups,
      GREATEST(gs.max_players - COALESCE(ps.paid_signups, 0), 0)::int AS spots_left
     FROM group_sessions gs
     LEFT JOIN (
      SELECT group_session_id, COUNT(*)::int AS paid_signups
      FROM player_signups
      WHERE has_paid = true
      GROUP BY group_session_id
     ) ps ON ps.group_session_id = gs.id
     WHERE gs.session_date >= NOW()
     ORDER BY gs.session_date ASC
     LIMIT $1`,
    [limit]
  );
  return result.rows;
}

export async function getGroupSessionById(
  id: number
): Promise<GroupSessionWithAvailability | null> {
  const result = await pool.query(
    `SELECT
      gs.*,
      COALESCE(ps.paid_signups, 0)::int AS paid_signups,
      GREATEST(gs.max_players - COALESCE(ps.paid_signups, 0), 0)::int AS spots_left
     FROM group_sessions gs
     LEFT JOIN (
      SELECT group_session_id, COUNT(*)::int AS paid_signups
      FROM player_signups
      WHERE has_paid = true
      GROUP BY group_session_id
     ) ps ON ps.group_session_id = gs.id
     WHERE gs.id = $1`,
    [id]
  );

  return result.rows[0] || null;
}

export async function createPlayerSignup(
  data: Pick<
    PlayerSignup,
    | "group_session_id"
    | "first_name"
    | "last_name"
    | "emergency_contact"
    | "contact_email"
  > &
    Partial<Pick<PlayerSignup, "contact_phone" | "foot" | "team" | "notes">>
): Promise<PlayerSignup> {
  const result = await pool.query(
    `INSERT INTO player_signups (
      group_session_id, first_name, last_name, emergency_contact, contact_phone, contact_email, foot, team, notes, has_paid
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, false)
    RETURNING *`,
    [
      data.group_session_id,
      data.first_name,
      data.last_name,
      data.emergency_contact,
      data.contact_phone || null,
      data.contact_email,
      data.foot || null,
      data.team || null,
      data.notes || null,
    ]
  );

  return result.rows[0];
}

export async function updatePlayerSignupCheckout(
  signupId: number,
  checkoutSessionId: string,
  paymentIntentId?: string | null
): Promise<void> {
  await pool.query(
    `UPDATE player_signups
     SET stripe_checkout_session_id = $2,
         stripe_payment_intent_id = COALESCE($3, stripe_payment_intent_id),
         updated_at = CURRENT_TIMESTAMP
     WHERE id = $1`,
    [signupId, checkoutSessionId, paymentIntentId || null]
  );
}

export async function markPlayerSignupPaidByCheckoutSession(
  checkoutSessionId: string,
  updates: {
    paymentIntentId?: string | null;
    chargeId?: string | null;
    receiptUrl?: string | null;
  }
): Promise<PlayerSignup | null> {
  const result = await pool.query(
    `UPDATE player_signups
     SET has_paid = true,
         stripe_payment_intent_id = COALESCE($2, stripe_payment_intent_id),
         stripe_charge_id = COALESCE($3, stripe_charge_id),
         stripe_receipt_url = COALESCE($4, stripe_receipt_url),
         updated_at = CURRENT_TIMESTAMP
     WHERE stripe_checkout_session_id = $1
       AND has_paid = false
     RETURNING *`,
    [
      checkoutSessionId,
      updates.paymentIntentId || null,
      updates.chargeId || null,
      updates.receiptUrl || null,
    ]
  );

  return result.rows[0] || null;
}
