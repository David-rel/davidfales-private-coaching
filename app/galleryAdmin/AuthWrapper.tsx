import { cookies } from "next/headers";
import { verifySessionToken } from "@/app/lib/auth/adminAuth";
import SecurityCodePrompt from "./SecurityCodePrompt";

export default async function AuthWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("galleryAdminSession")?.value;

  // Verify session
  const isValid = verifySessionToken(sessionToken);

  // If not authenticated, show security code prompt
  if (!isValid) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white flex items-center justify-center px-6">
        <SecurityCodePrompt />
      </div>
    );
  }

  // If authenticated, show the admin content with header
  return (
    <div className="min-h-screen bg-emerald-50">
      {/* Admin Header */}
      <header className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <a href="/galleryAdmin" className="text-2xl font-bold">
                Gallery Admin
              </a>
              <nav className="flex gap-4">
                <a
                  href="/galleryAdmin"
                  className="hover:text-emerald-200 transition-colors"
                >
                  Photos
                </a>
                <a
                  href="/galleryAdmin/new"
                  className="hover:text-emerald-200 transition-colors"
                >
                  New Photo
                </a>
              </nav>
            </div>
            <a
              href="/"
              className="text-sm hover:text-emerald-200 transition-colors"
            >
              ← Back to Site
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">{children}</main>
    </div>
  );
}
