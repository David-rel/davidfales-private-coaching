"use client";

const PLAYER_DASHBOARD_URL =
  process.env.NEXT_PUBLIC_PLAYER_DASHBOARD_URL ||
  "https://app.davidssoccertraining.com";

export default function MainHeaderMinimal() {
  const COACH_PHONE_E164 = "+17206122979";

  const smsHref = `sms:${COACH_PHONE_E164}?body=${encodeURIComponent(
    "Hi David, I'm interested in private soccer training in Mesa/Gilbert."
  )}`;

  return (
    <header className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-6 py-3">
        <div className="flex justify-between items-center">
          {/* Logo + Title - Links to home */}
          <a
            href="/"
            className="flex items-center gap-3 hover:opacity-90 transition-opacity"
          >
            <img
              src="/logo.jpeg"
              alt="David Fales Coaching Logo"
              className="h-10 w-auto"
            />
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                David's Soccer Training
              </h1>
              <p className="text-emerald-100 text-xs mt-0.5">
                Private Soccer Training • Mesa & Gilbert, AZ
              </p>
            </div>
          </a>

          {/* Minimal Navigation */}
          <div className="flex items-center gap-6">
            <nav className="hidden md:flex space-x-6">
              <a
                href="/"
                className="hover:text-emerald-200 transition-colors duration-200 font-medium text-sm"
              >
                Home
              </a>
              <a
                href="/blog"
                className="hover:text-emerald-200 transition-colors duration-200 font-medium text-sm"
              >
                Blog
              </a>
              <a
                href="/gallery"
                className="hover:text-emerald-200 transition-colors duration-200 font-medium text-sm"
              >
                Gallery
              </a>
              <a
                href={PLAYER_DASHBOARD_URL}
                target="_blank"
                rel="noreferrer"
                className="hover:text-emerald-200 transition-colors duration-200 font-medium text-sm"
              >
                Player Dashboard
              </a>
            </nav>

            {/* CTA: Text Coach David */}
            <a
              href={smsHref}
              className="inline-flex items-center justify-center bg-white text-emerald-700 px-4 py-2 rounded-full font-semibold text-sm border-2 border-white hover:bg-emerald-50 transition-colors"
            >
              Text Coach David
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
