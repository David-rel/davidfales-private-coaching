import AuthWrapper from "./AuthWrapper";
import BlogAdminDashboard from "./Dashboard";

export default function BlogAdminPage() {
  return (
    <AuthWrapper>
      <BlogAdminDashboard />
    </AuthWrapper>
  );
}
