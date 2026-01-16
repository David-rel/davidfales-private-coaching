"use client";

const PLAYER_DASHBOARD_URL =
  process.env.NEXT_PUBLIC_PLAYER_DASHBOARD_URL ||
  "https://app.davidssoccertraining.com";

export default function MainHeader() {
  return (
    <header className="bg-linear-to-r from-emerald-600 to-emerald-700 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-6 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img
              src="/logo.jpeg"
              alt="David Fales Coaching Logo"
              className="h-10 w-auto"
            />
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                David’s Soccer Training
              </h1>
              <p className="text-emerald-100 text-xs mt-0.5">
                Coach David • Gilbert, Mesa & nearby East Valley
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex space-x-6">
              <a
                href="/#how-it-works"
                className="hover:text-emerald-200 transition-colors duration-200 font-medium text-sm"
              >
                How it works
              </a>
              <a
                href="/#what-we-work-on"
                className="hover:text-emerald-200 transition-colors duration-200 font-medium text-sm"
              >
                What we work on
              </a>
              <a
                href="/#pricing"
                className="hover:text-emerald-200 transition-colors duration-200 font-medium text-sm"
              >
                Pricing
              </a>
              <a
                href="/#faq"
                className="hover:text-emerald-200 transition-colors duration-200 font-medium text-sm"
              >
                FAQ
              </a>
              <a
                href="/#contact"
                className="hover:text-emerald-200 transition-colors duration-200 font-medium text-sm"
              >
                Contact
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
            </nav>

            <a
              href={PLAYER_DASHBOARD_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center bg-white text-emerald-700 px-4 py-2 rounded-full font-semibold text-sm border-2 border-emerald-200 hover:border-emerald-300 hover:bg-emerald-50 transition-colors"
            >
              Player Dashboard
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
