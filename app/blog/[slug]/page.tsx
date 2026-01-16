import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import MainHeader from "@/app/components/layout/MainHeader";
import MainFooter from "@/app/components/layout/MainFooter";
import { getPostBySlug, getCommentsByPostId } from "@/app/lib/db/queries";
import BlogPostContent from "@/app/components/blog/BlogPostContent";
import LikeButton from "@/app/components/blog/LikeButton";
import CommentSection from "@/app/components/blog/CommentSection";

const SITE_URL = "https://www.davidssoccertraining.com";

// Force dynamic rendering to prevent static caching
// Posts need fresh data for view counts and new comments
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug, { incrementView: false });

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: post.meta_title || post.title,
    description:
      post.meta_description ||
      post.excerpt ||
      `Read ${post.title} on David's Soccer Training`,
    openGraph: {
      title: post.meta_title || post.title,
      description:
        post.meta_description ||
        post.excerpt ||
        `Read ${post.title} on David's Soccer Training`,
      images: post.featured_image_url ? [post.featured_image_url] : [],
      type: "article",
      publishedTime: post.published_at?.toString(),
      authors: [post.author_name],
    },
    twitter: {
      card: "summary_large_image",
      title: post.meta_title || post.title,
      description:
        post.meta_description ||
        post.excerpt ||
        `Read ${post.title} on David's Soccer Training`,
      images: post.featured_image_url ? [post.featured_image_url] : [],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const comments = await getCommentsByPostId(post.id, true);

  const blogPostingJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.featured_image_url,
    datePublished: post.published_at,
    dateModified: post.updated_at,
    author: {
      "@type": "Person",
      name: post.author_name,
    },
    publisher: {
      "@type": "Organization",
      name: "David's Soccer Training",
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/icon.png`,
      },
    },
  };

  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingJsonLd) }}
      />

      <MainHeader />

      {/* Post Content */}
      <article className="container mx-auto max-w-4xl px-6 py-12">
        <div className="mb-6">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-emerald-700 hover:text-emerald-800 font-medium"
          >
            ← Back to Blog
          </Link>
        </div>
        {post.featured_image_url && (
          <img
            src={post.featured_image_url}
            alt={post.title}
            className="w-full aspect-video object-cover rounded-2xl shadow-lg mb-8"
          />
        )}

        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          {post.title}
        </h1>

        <div className="flex items-center gap-4 text-gray-600 mb-8 pb-8 border-b border-gray-300">
          <span>By {post.author_name}</span>
          <span>•</span>
          <time>
            {new Date(post.published_at!).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
          <span>•</span>
          <span>{post.view_count} views</span>
        </div>

        <BlogPostContent htmlContent={post.content_html} />

        <div className="mt-12 pt-8 border-t border-gray-300">
          <LikeButton postId={post.id} initialCount={post.like_count || 0} />
        </div>

        <hr className="my-12 border-gray-300" />

        <CommentSection postId={post.id} initialComments={comments} />
      </article>

      <MainFooter />
    </div>
  );
}
