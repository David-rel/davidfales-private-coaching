import PostForm from "@/app/components/admin/PostForm";
import AuthWrapper from "../AuthWrapper";

export default function NewBlogPost() {
  return (
    <AuthWrapper>
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Create New Blog Post
        </h1>
        <div className="bg-white rounded-2xl shadow-lg border-2 border-emerald-200 p-8">
          <PostForm />
        </div>
      </div>
    </AuthWrapper>
  );
}
