import AuthWrapper from "./AuthWrapper";
import GalleryAdminDashboard from "./Dashboard";

export const dynamic = "force-dynamic";

export default function GalleryAdminPage() {
  return (
    <AuthWrapper>
      <GalleryAdminDashboard />
    </AuthWrapper>
  );
}
