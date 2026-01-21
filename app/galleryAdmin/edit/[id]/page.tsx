import AuthWrapper from "../../AuthWrapper";
import PhotoForm from "@/app/components/admin/PhotoForm";
import { getPhotoById } from "@/app/lib/db/queries";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function EditPhotoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const photo = await getPhotoById(id);

  if (!photo) {
    notFound();
  }

  return (
    <AuthWrapper>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Edit Photo</h1>
        <PhotoForm photo={photo} isEdit={true} />
      </div>
    </AuthWrapper>
  );
}
