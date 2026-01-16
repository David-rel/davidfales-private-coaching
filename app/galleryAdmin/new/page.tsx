import AuthWrapper from "../AuthWrapper";
import PhotoForm from "@/app/components/admin/PhotoForm";

export default function NewPhotoPage() {
  return (
    <AuthWrapper>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Add New Photo</h1>
        <PhotoForm />
      </div>
    </AuthWrapper>
  );
}
