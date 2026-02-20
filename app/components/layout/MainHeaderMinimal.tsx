"use client";

import { useState } from "react";

const PLAYER_DASHBOARD_URL =
  process.env.NEXT_PUBLIC_PLAYER_DASHBOARD_URL ||
  "https://app.davidssoccertraining.com";

export default function MainHeaderMinimal() {
  const COACH_PHONE_E164 = "+17206122979";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const smsHref = `sms:${COACH_PHONE_E164}?body=${encodeURIComponent(
    "Hi David, I'm interested in private soccer training in Mesa/Gilbert."
  )}`;

  return (
    <header className="bg-linear-to-r from-emerald-600 to-emerald-700 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 md:px-6 py-3">
        <div className="flex justify-between items-center">
          {/* Logo + Title - Hide logo on mobile/tablet, Links to home */}
          <a
            href="/"
            className="flex items-center gap-3 hover:opacity-90 transition-opacity"
          >
            <img
              src="/logo.jpeg"
              alt="David Fales Coaching Logo"
              className="h-10 w-auto hidden lg:block"
            />
            <div>
              <h1 className="text-lg lg:text-2xl font-bold tracking-tight">
                David's Soccer Training
              </h1>
              <p className="text-emerald-100 text-xs mt-0.5 hidden sm:block lg:block">
                Private Soccer Training • Mesa & Gilbert, AZ
              </p>
            </div>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            <nav className="flex space-x-6">
              <a
                href="/"
                className="hover:text-emerald-200 transition-colors duration-200 font-medium text-sm"
              >
                Home
              </a>
              <a
                href="/group-sessions"
                className="hover:text-emerald-200 transition-colors duration-200 font-medium text-sm"
              >
                Group Sessions
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

          {/* Mobile/Tablet: CTA + Hamburger */}
          <div className="flex lg:hidden items-center gap-3">
            <a
              href={smsHref}
              className="inline-flex items-center justify-center bg-white text-emerald-700 px-3 py-1.5 rounded-full font-semibold text-xs border-2 border-white hover:bg-emerald-50 transition-colors"
            >
              Text Coach David
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 hover:bg-emerald-600 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile/Tablet Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-emerald-500 pt-4">
            {/* Logo in mobile menu */}
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-emerald-500">
              <img
                src="/logo.jpeg"
                alt="David Fales Coaching Logo"
                className="h-12 w-auto"
              />
              <div>
                <p className="text-white font-bold">David's Soccer Training</p>
                <p className="text-emerald-100 text-xs">
                  Mesa & Gilbert, AZ
                </p>
              </div>
            </div>

            <nav className="flex flex-col space-y-4">
              <a
                href="/"
                className="hover:text-emerald-200 transition-colors duration-200 font-medium text-base py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </a>
              <a
                href="/group-sessions"
                className="hover:text-emerald-200 transition-colors duration-200 font-medium text-base py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Group Sessions
              </a>
              <a
                href="/blog"
                className="hover:text-emerald-200 transition-colors duration-200 font-medium text-base py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Blog
              </a>
              <a
                href="/gallery"
                className="hover:text-emerald-200 transition-colors duration-200 font-medium text-base py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Gallery
              </a>
              <a
                href={PLAYER_DASHBOARD_URL}
                target="_blank"
                rel="noreferrer"
                className="hover:text-emerald-200 transition-colors duration-200 font-medium text-base py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Player Dashboard
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
