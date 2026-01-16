import AuthWrapper from "./AuthWrapper";
import GalleryAdminDashboard from "./Dashboard";

export default function GalleryAdminPage() {
  return (
    <AuthWrapper>
      <GalleryAdminDashboard />
    </AuthWrapper>
  );
}
