import { notFound } from "next/navigation";
import PostForm from "@/app/components/admin/PostForm";
import { getPostById } from "@/app/lib/db/queries";
import AuthWrapper from "../../AuthWrapper";
import CommentsDashboard from "../../CommentsDashboard";

export default async function EditBlogPost({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getPostById(id);

  if (!post) {
    notFound();
  }

  return (
    <AuthWrapper>
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Edit Blog Post
        </h1>
        <div className="bg-white rounded-2xl shadow-lg border-2 border-emerald-200 p-8">
          <PostForm initialData={post} isEdit={true} />
        </div>

        <div className="mt-12 pt-10 border-t border-emerald-200">
          <CommentsDashboard
            postId={post.id}
            title="Comments for this post"
            showPostColumn={false}
          />
        </div>
      </div>
    </AuthWrapper>
  );
}
