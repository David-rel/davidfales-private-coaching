import type { Metadata } from "next";
import BlogCard from "@/app/components/blog/BlogCard";
import { getPublishedPosts } from "@/app/lib/db/queries";
import MainHeader from "@/app/components/layout/MainHeader";
import MainFooter from "@/app/components/layout/MainFooter";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Soccer training tips, techniques, and insights from David Fales",
};

export default async function BlogPage() {
  const posts = await getPublishedPosts(50, 0);

  return (
    <div className="min-h-screen bg-white">
      <MainHeader />

      {/* Blog Header */}
      <div className="bg-gradient-to-b from-emerald-50 to-white py-12">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Soccer Training Blog
          </h1>
          <p className="text-xl text-gray-600">
            Tips, techniques, and insights to improve your game
          </p>
        </div>
      </div>

      {/* Blog Posts */}
      <div className="container mx-auto px-6 py-12">
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">
              No blog posts yet. Check back soon!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>

      <MainFooter />
    </div>
  );
}
