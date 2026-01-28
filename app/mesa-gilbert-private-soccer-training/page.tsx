"use client";

import React, { useState, useEffect } from "react";
import Script from "next/script";
import Link from "next/link";
import MainHeaderMinimal from "@/app/components/layout/MainHeaderMinimal";
import MainFooter from "@/app/components/layout/MainFooter";
import FeaturedPhotos from "@/app/components/home/FeaturedPhotos";
import BlogCard from "@/app/components/blog/BlogCard";
import { BlogPostListItem } from "@/app/types/blog";

const PLAYER_DASHBOARD_URL =
  process.env.NEXT_PUBLIC_PLAYER_DASHBOARD_URL ||
  "https://app.davidssoccertraining.com";

const MesaGilbertLandingPage = () => {
  const COACH_PHONE_E164 = "+17206122979";
  const COACH_PHONE_WA = "17206122979";
  const CALENDLY_URL = "https://calendly.com/davidssoccertraining-info/intro";

  const defaultTextTemplate =
    "Hi David, my player is __ years old. Main goal is __. Best days are __. We're in Mesa/Gilbert.";

  const [formData, setFormData] = useState({
    parentName: "",
    email: "",
    phone: "",
    playerAge: "",
    mainGoal: "",
    bestDaysTimes: "",
    area: "Mesa or Gilbert",
    sessionType: "Private (1-on-1)",
    notes: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState<
    "idle" | "success" | "error" | "loading"
  >("idle");

  const [blogPosts, setBlogPosts] = useState<BlogPostListItem[]>([]);
  const [blogLoading, setBlogLoading] = useState(true);

  const buildPrefilledMessage = () => {
    const age = formData.playerAge?.trim() || "__";
    const goal = formData.mainGoal?.trim() || "__";
    const days = formData.bestDaysTimes?.trim() || "__";
    const area = formData.area?.trim() || "Mesa/Gilbert";
    return `Hi David, my player is ${age} years old. Main goal is ${goal}. Best days are ${days}. We're in ${area}.`;
  };

  const smsHref = `sms:${COACH_PHONE_E164}?body=${encodeURIComponent(
    buildPrefilledMessage()
  )}`;
  const waHref = `https://wa.me/${COACH_PHONE_WA}?text=${encodeURIComponent(
    buildPrefilledMessage()
  )}`;
  const telHref = `tel:${COACH_PHONE_E164}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormStatus("loading");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          message: buildPrefilledMessage(),
          source: "mesa-gilbert-landing",
        }),
      });

      if (response.ok) {
        setFormStatus("success");
        setFormData({
          parentName: "",
          email: "",
          phone: "",
          playerAge: "",
          mainGoal: "",
          bestDaysTimes: "",
          area: "Mesa or Gilbert",
          sessionType: "Private (1-on-1)",
          notes: "",
        });
      } else {
        setFormStatus("error");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setFormStatus("error");
    } finally {
      setIsSubmitting(false);
      if (formStatus === "loading") setFormStatus("idle");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Fetch blog posts
  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const response = await fetch("/api/blog/posts?limit=3&offset=0");
        const data = await response.json();
        if (data.posts) {
          setBlogPosts(data.posts);
        }
      } catch (error) {
        console.error("Error fetching blog posts:", error);
      } finally {
        setBlogLoading(false);
      }
    };
    fetchBlogPosts();
  }, []);

  // Structured Data for SEO
  const localBusinessJsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id":
      "https://www.davidssoccertraining.com/mesa-gilbert-private-soccer-training",
    name: "David's Soccer Training - Mesa & Gilbert",
    url: "https://www.davidssoccertraining.com/mesa-gilbert-private-soccer-training",
    telephone: "+17206122979",
    email: "davidfalesct@gmail.com",
    description:
      "Private soccer training for youth players ages 8-16 in Mesa and Gilbert, Arizona. 1-on-1 and small group sessions with progress tracking.",
    priceRange: "$60-$100",
    areaServed: [
      {
        "@type": "City",
        name: "Gilbert",
        "@id": "https://en.wikipedia.org/wiki/Gilbert,_Arizona",
      },
      {
        "@type": "City",
        name: "Mesa",
        "@id": "https://en.wikipedia.org/wiki/Mesa,_Arizona",
      },
      {
        "@type": "Place",
        name: "East Valley, Arizona",
      },
    ],
    geo: {
      "@type": "GeoCircle",
      geoMidpoint: {
        "@type": "GeoCoordinates",
        latitude: "33.3528",
        longitude: "-111.7890",
      },
      geoRadius: "15000",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Soccer Training Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "1-on-1 Private Soccer Training",
            description: "Individual soccer training session",
          },
          price: "60",
          priceCurrency: "USD",
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "2-Player Small Group Training",
            description: "Soccer training for 2 players",
          },
          price: "80",
          priceCurrency: "USD",
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "3-Player Small Group Training",
            description: "Soccer training for 3 players",
          },
          price: "90",
          priceCurrency: "USD",
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Small Group Training",
            description: "Soccer training for 2-7 players",
          },
          price: "70",
          priceCurrency: "USD",
        },
      ],
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5.0",
      bestRating: "5",
      ratingCount: "1",
    },
    sameAs: ["https://calendly.com/davidssoccertraining-info/intro"],
  };

  // FAQPage Schema for Mesa/Gilbert-specific questions
  const faqPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Where exactly do sessions happen in Mesa and Gilbert?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "We meet at quality public parks like Freestone Park, Discovery Park, Hetchler Park (Gilbert Soccer Complex), Red Mountain Park, and other Mesa/Gilbert locations. I'll confirm the exact spot when we schedule based on what's most convenient for you.",
        },
      },
      {
        "@type": "Question",
        name: "What age is this for?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Ages 8–16. Beginner to club level. Most of my players are in Mesa and Gilbert club soccer programs or looking to join one.",
        },
      },
      {
        "@type": "Question",
        name: "Do you work with players from specific Gilbert/Mesa soccer clubs?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes! I work with players from various East Valley clubs including Gilbert Youth Soccer Association (GYSA), Mesa United, and others. Training complements what they're learning at club practice.",
        },
      },
      {
        "@type": "Question",
        name: "What should my player bring?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Ball, water, cleats, shin guards. Parks have shade but bring sunscreen for Arizona weather.",
        },
      },
      {
        "@type": "Question",
        name: "Do you do small groups with my player's teammates?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Absolutely! Small groups (2-7 players) are great for teammates who want to train together. Just text me to coordinate.",
        },
      },
      {
        "@type": "Question",
        name: "How do I know which park we'll use?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "When you text me your location in Mesa or Gilbert, I'll suggest 2-3 nearby parks and you can pick what works best for your schedule.",
        },
      },
      {
        "@type": "Question",
        name: "What if weather is bad?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Arizona weather is usually great, but if it's raining or too hot (110+), we'll reschedule. I'll text you in advance.",
        },
      },
      {
        "@type": "Question",
        name: "How fast will we see improvement?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Most players improve fastest with consistency. I'll give a simple plan after the first session.",
        },
      },
    ],
  };

  // BreadcrumbList Schema for better navigation
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.davidssoccertraining.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Mesa & Gilbert Private Soccer Training",
        item: "https://www.davidssoccertraining.com/mesa-gilbert-private-soccer-training",
      },
    ],
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-white to-emerald-50 pb-24 md:pb-0">
      {/* Structured Data - LocalBusiness */}
      <Script
        id="local-business-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessJsonLd),
        }}
      />

      {/* Structured Data - FAQPage */}
      <Script
        id="faq-page-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqPageJsonLd),
        }}
      />

      {/* Structured Data - BreadcrumbList */}
      <Script
        id="breadcrumb-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd),
        }}
      />

      <MainHeaderMinimal />

      {/* Hero Section */}
      <section className="py-14 md:py-20 px-6 bg-linear-to-b from-emerald-50 to-white">
        <div className="container mx-auto max-w-5xl">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-emerald-700 font-semibold mb-3">
                Serving Mesa & Gilbert
              </p>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-5 leading-tight">
                Private Soccer Training in{" "}
                <span className="text-emerald-600">Mesa and Gilbert, Arizona</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-700 mb-6 leading-relaxed">
                1-on-1 and small group sessions for ages 8–16 at convenient East Valley parks.
                Clear goals, real improvement, and a coach parents can trust.
              </p>

              <ul className="space-y-3 mb-8">
                {[
                  "Customized sessions based on your player's needs",
                  "Progress tracking with simple skill benchmarks",
                  "Flexible scheduling by text at Mesa/Gilbert parks",
                ].map((item) => (
                  <li key={item} className="flex items-start text-gray-700">
                    <span className="text-emerald-600 mr-3 text-xl leading-none">
                      ✓
                    </span>
                    <span className="text-base md:text-lg">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-3">
                <a
                  href={smsHref}
                  className="inline-flex items-center justify-center bg-emerald-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-emerald-700 transition-colors shadow-lg"
                >
                  Text Coach David
                </a>
                <a
                  href={waHref}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center bg-white text-emerald-700 px-6 py-3 rounded-full font-semibold border-2 border-emerald-200 hover:border-emerald-300 hover:bg-emerald-50 transition-colors"
                >
                  WhatsApp
                </a>
                <a
                  href={telHref}
                  className="inline-flex items-center justify-center bg-white text-gray-800 px-6 py-3 rounded-full font-semibold border-2 border-gray-200 hover:border-gray-300 transition-colors"
                >
                  Call
                </a>
              </div>

              <p className="text-sm text-gray-500 mt-4">
                Text me and we'll confirm time & location at your preferred Mesa or Gilbert park.
              </p>
            </div>

            <div className="bg-white rounded-3xl shadow-xl border border-emerald-100 overflow-hidden">
              <div className="p-6 md:p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  Quick Start
                </h2>
                <p className="text-gray-600 mb-5">
                  Copy/paste this text and you're done.
                </p>

                <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4">
                  <p className="text-gray-800 leading-relaxed">
                    {defaultTextTemplate}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3 mt-5">
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(
                          defaultTextTemplate
                        );
                      } catch {
                        // Clipboard may fail in some browsers
                      }
                    }}
                    className="inline-flex items-center justify-center bg-gray-900 text-white px-5 py-3 rounded-full font-semibold hover:bg-gray-800 transition-colors"
                  >
                    Copy template
                  </button>
                  <a
                    href={smsHref}
                    className="inline-flex items-center justify-center bg-emerald-600 text-white px-5 py-3 rounded-full font-semibold hover:bg-emerald-700 transition-colors"
                  >
                    Open Text
                  </a>
                  <a
                    href={waHref}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center bg-white text-emerald-700 px-5 py-3 rounded-full font-semibold border-2 border-emerald-200 hover:bg-emerald-50 transition-colors"
                  >
                    Open WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Featured Photos */}
          <FeaturedPhotos />
        </div>
      </section>

      {/* Who This Is For Section */}
      <section className="py-20 px-6 bg-linear-to-r from-emerald-600 to-emerald-700 text-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Who This Is For: Youth Soccer Players in Mesa & Gilbert
            </h2>
            <p className="text-xl text-emerald-100 leading-relaxed max-w-3xl mx-auto">
              Designed for Mesa and Gilbert families who want structured training,
              clear goals, and consistent progress.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border-2 border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
              <div className="text-6xl mb-4 text-center">👦👧</div>
              <h3 className="text-2xl font-bold mb-3 text-center">Ages 8-16</h3>
              <p className="text-emerald-50 text-center leading-relaxed">
                Training programs tailored to youth players at the perfect age
                for skill development and growth
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border-2 border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
              <div className="text-6xl mb-4 text-center">📈</div>
              <h3 className="text-2xl font-bold mb-3 text-center">
                All Skill Levels
              </h3>
              <p className="text-emerald-50 text-center leading-relaxed">
                From beginners taking their first steps to high-level players
                looking to reach the next stage
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border-2 border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
              <div className="text-6xl mb-4 text-center">🎯</div>
              <h3 className="text-2xl font-bold mb-3 text-center">
                Convenient East Valley Locations
              </h3>
              <p className="text-emerald-50 text-center leading-relaxed">
                One-on-one sessions with a customized plan for your player at parks near you,
                plus clear goals and measurable progress.
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/30 inline-block">
              <p className="text-lg text-white font-semibold">
                🌟 Every player receives a customized training plan designed
                just for them
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-14">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              How Private Soccer Training Works in the East Valley
            </h2>
            <p className="text-xl text-gray-600">
              Simple scheduling. Clear plan. Real progress.
            </p>
            <p className="text-base text-gray-600 mt-3 max-w-3xl mx-auto">
              Sessions are organized, age-appropriate, and parent-friendly. I
              communicate clearly before and after training.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "Step 1",
                title: "Text me your player's age + main goal",
                desc: "We'll pick one priority (confidence on the ball, passing, finishing, etc.).",
                icon: "💬",
              },
              {
                step: "Step 2",
                title: "We pick a park in Mesa or Gilbert that works for you",
                desc: "Popular options: Freestone Park, Hetchler Park, Discovery Park, Red Mountain Park, or your favorite local field.",
                icon: "📍",
              },
              {
                step: "Step 3",
                title: "We train — you get a simple progress plan",
                desc: "Short benchmarks so you can see improvement session to session.",
                icon: "✅",
              },
            ].map((s) => (
              <div
                key={s.step}
                className="bg-linear-to-br from-emerald-50 to-white p-8 rounded-2xl shadow-lg border-2 border-emerald-100"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-emerald-700 font-semibold">
                    {s.step}
                  </span>
                  <span className="text-4xl">{s.icon}</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {s.title}
                </h3>
                <p className="text-gray-700 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <a
              href={smsHref}
              className="inline-flex items-center justify-center bg-emerald-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-emerald-700 transition-colors shadow-lg"
            >
              Text to get started
            </a>
          </div>
        </div>
      </section>

      {/* Training Locations (Parks) Section - NEW */}
      <section
        id="training-locations"
        className="py-20 px-6 bg-linear-to-b from-white to-emerald-50"
      >
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Where We Train: Mesa & Gilbert Parks
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Sessions happen at safe, convenient public parks in Mesa and Gilbert.
              We'll confirm the exact location when we schedule based on your preference and availability.
            </p>
          </div>

          {/* Gilbert Parks */}
          <div className="mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              Gilbert Area Parks
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              {/* Freestone Park */}
              <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-emerald-100">
                <div className="text-4xl mb-3">⚽</div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">
                  Freestone Park
                </h4>
                <p className="text-gray-600 text-sm mb-3">
                  Gilbert's first major district park with 88 acres of open space
                </p>
                <p className="text-gray-500 text-xs">
                  📍 1045 E. Juniper Rd, Gilbert
                </p>
                <ul className="mt-3 space-y-1 text-sm text-gray-700">
                  <li className="flex items-start">
                    <span className="text-emerald-600 mr-2">✓</span>
                    Large open fields
                  </li>
                  <li className="flex items-start">
                    <span className="text-emerald-600 mr-2">✓</span>
                    Well-maintained grass
                  </li>
                  <li className="flex items-start">
                    <span className="text-emerald-600 mr-2">✓</span>
                    Family-friendly amenities
                  </li>
                </ul>
              </div>

              {/* Discovery Park */}
              <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-emerald-100">
                <div className="text-4xl mb-3">🌳</div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">
                  Discovery Park
                </h4>
                <p className="text-gray-600 text-sm mb-3">
                  Modern district park in the Santan Village area
                </p>
                <p className="text-gray-500 text-xs">
                  📍 2214 E. Pecos Rd, Gilbert
                </p>
                <ul className="mt-3 space-y-1 text-sm text-gray-700">
                  <li className="flex items-start">
                    <span className="text-emerald-600 mr-2">✓</span>
                    Open turf areas
                  </li>
                  <li className="flex items-start">
                    <span className="text-emerald-600 mr-2">✓</span>
                    Convenient parking
                  </li>
                  <li className="flex items-start">
                    <span className="text-emerald-600 mr-2">✓</span>
                    Great for training
                  </li>
                </ul>
              </div>

              {/* Hetchler Park */}
              <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-emerald-100">
                <div className="text-4xl mb-3">🏟️</div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">
                  Hetchler Park (Gilbert Soccer Complex)
                </h4>
                <p className="text-gray-600 text-sm mb-3">
                  Premier soccer facility with 22 fields (10 lighted)
                </p>
                <p className="text-gray-500 text-xs">
                  📍 4260 S. Greenfield Rd, Gilbert
                </p>
                <ul className="mt-3 space-y-1 text-sm text-gray-700">
                  <li className="flex items-start">
                    <span className="text-emerald-600 mr-2">✓</span>
                    Professional fields
                  </li>
                  <li className="flex items-start">
                    <span className="text-emerald-600 mr-2">✓</span>
                    Multiple field options
                  </li>
                  <li className="flex items-start">
                    <span className="text-emerald-600 mr-2">✓</span>
                    Soccer-specific complex
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Mesa Parks */}
          <div className="mb-8">
            <h3 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              Mesa Area Parks
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              {/* Red Mountain Park */}
              <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-emerald-100">
                <div className="text-4xl mb-3">🏔️</div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">
                  Red Mountain Park
                </h4>
                <p className="text-gray-600 text-sm mb-3">
                  Popular Mesa park with excellent training space
                </p>
                <p className="text-gray-500 text-xs">📍 Mesa, AZ</p>
                <ul className="mt-3 space-y-1 text-sm text-gray-700">
                  <li className="flex items-start">
                    <span className="text-emerald-600 mr-2">✓</span>
                    Quality fields
                  </li>
                  <li className="flex items-start">
                    <span className="text-emerald-600 mr-2">✓</span>
                    Good location
                  </li>
                  <li className="flex items-start">
                    <span className="text-emerald-600 mr-2">✓</span>
                    Open space
                  </li>
                </ul>
              </div>

              {/* Other Mesa parks */}
              <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-emerald-100">
                <div className="text-4xl mb-3">⚽</div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">
                  Additional Mesa Parks
                </h4>
                <p className="text-gray-600 text-sm mb-3">
                  We also train at other quality Mesa parks based on your location
                </p>
                <ul className="mt-3 space-y-1 text-sm text-gray-700">
                  <li className="flex items-start">
                    <span className="text-emerald-600 mr-2">✓</span>
                    Riverview area
                  </li>
                  <li className="flex items-start">
                    <span className="text-emerald-600 mr-2">✓</span>
                    Multiple locations
                  </li>
                  <li className="flex items-start">
                    <span className="text-emerald-600 mr-2">✓</span>
                    Flexible options
                  </li>
                </ul>
              </div>

              {/* Custom location */}
              <div className="bg-linear-to-br from-emerald-50 to-white p-6 rounded-2xl shadow-lg border-2 border-emerald-200">
                <div className="text-4xl mb-3">📍</div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">
                  Your Preferred Location
                </h4>
                <p className="text-gray-600 text-sm mb-3">
                  Have a park closer to you? Let's discuss options.
                </p>
                <ul className="mt-3 space-y-1 text-sm text-gray-700">
                  <li className="flex items-start">
                    <span className="text-emerald-600 mr-2">✓</span>
                    Flexible scheduling
                  </li>
                  <li className="flex items-start">
                    <span className="text-emerald-600 mr-2">✓</span>
                    Convenient for you
                  </li>
                  <li className="flex items-start">
                    <span className="text-emerald-600 mr-2">✓</span>
                    Just ask when booking
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Flexibility Note */}
          <div className="mt-10 text-center">
            <div className="bg-linear-to-r from-emerald-50 to-white p-8 rounded-2xl shadow-md border border-emerald-200 max-w-3xl mx-auto">
              <p className="text-gray-800 text-lg mb-2">
                <span className="font-bold text-emerald-600">
                  Not near these parks?
                </span>
              </p>
              <p className="text-gray-700">
                We're flexible! If you have a preferred park in the Mesa/Gilbert area,
                just mention it when you text. We'll make it work for your schedule and location.
              </p>
            </div>
          </div>

          <div className="mt-10 text-center">
            <a
              href={smsHref}
              className="inline-flex items-center justify-center bg-emerald-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-emerald-700 transition-colors shadow-lg"
            >
              Text me your location
            </a>
          </div>
        </div>
      </section>

      {/* Training Focus Section */}
      <section id="what-we-work-on" className="py-20 px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              What We Work On: Core Soccer Skills for Mesa & Gilbert Players
            </h2>
            <p className="text-xl text-gray-600">
              Parent-friendly focus areas (skills that show up in games)
            </p>
          </div>

          {/* Part 1: Technical Skills */}
          <div className="mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Core skills
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: "⚽",
                  title: "First touch & control",
                  description:
                    "Cleaner control so your player feels calm and confident receiving the ball.",
                },
                {
                  icon: "🏃",
                  title: "Dribbling confidence",
                  description:
                    "Close control under pressure and the confidence to beat defenders.",
                },
                {
                  icon: "🎯",
                  title: "Passing accuracy",
                  description:
                    "Better technique and consistency (short and long passes).",
                },
                {
                  icon: "🥅",
                  title: "Finishing",
                  description:
                    "Stronger shots, better placement, and more composure in front of goal.",
                },
              ].map((skill, index) => (
                <div
                  key={index}
                  className="bg-linear-to-br from-emerald-50 to-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-emerald-100 text-center"
                >
                  <div className="text-5xl mb-3">{skill.icon}</div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">
                    {skill.title}
                  </h4>
                  <p className="text-gray-600 leading-relaxed text-sm">
                    {skill.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Part 2: Training Approach */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-linear-to-br from-emerald-50 to-white p-8 rounded-2xl shadow-lg border-2 border-emerald-200">
              <div className="text-5xl mb-4 text-center">🎯</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                Clear goals (not random drills)
              </h3>
              <p className="text-gray-700 leading-relaxed text-lg">
                Every session is customized to your player's age, level, and one
                main priority — so improvement is easier to see and track.
              </p>
            </div>

            <div className="bg-linear-to-br from-emerald-50 to-white p-8 rounded-2xl shadow-lg border-2 border-emerald-200">
              <div className="text-5xl mb-4 text-center">👥</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                Private + small group options
              </h3>
              <p className="text-gray-700 leading-relaxed text-lg">
                Choose 1-on-1 for maximum attention, or small groups for more
                game-like pressure while still getting focused coaching.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testing Section */}
      <section
        id="testing"
        className="py-20 px-6 bg-linear-to-b from-emerald-50 to-emerald-100"
      >
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              More Than Just Coaching
            </h2>
            <p className="text-xl text-gray-600">
              Data-driven skill assessments to track your progress, identify
              areas for improvement, and celebrate your achievements.
            </p>
            <p className="text-base text-gray-600 mt-3 max-w-3xl mx-auto">
              Testing is simple and optional. It helps us measure progress — not
              overcomplicate training.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                icon: "⚽",
                title: "Power Shot Test",
                description:
                  "Measure your shooting power and accuracy with both feet to identify strengths and areas for improvement.",
                features: [
                  "Distance measurement",
                  "Both foot testing",
                  "Power & accuracy tracking",
                ],
              },
              {
                icon: "🎯",
                title: "Distance Serve",
                description:
                  "Test your long-range passing ability and technique to evaluate ball control and distribution skills.",
                features: [
                  "Long-range accuracy",
                  "Technical form analysis",
                  "Distance benchmarking",
                ],
              },
              {
                icon: "🚪",
                title: "Passing Gates",
                description:
                  "Navigate precision passing through multiple gates to assess your passing accuracy and decision-making.",
                features: [
                  "Precision testing",
                  "Speed & accuracy combo",
                  "Game-situation simulation",
                ],
              },
              {
                icon: "🔄",
                title: "Figure 8 Dribbling",
                description:
                  "Test your close control and dribbling ability through figure 8 patterns to measure ball mastery.",
                features: [
                  "Ball control assessment",
                  "Agility & coordination",
                  "Speed with control",
                ],
              },
            ].map((test, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-emerald-200"
              >
                <div className="flex items-start mb-4">
                  <div className="text-5xl mr-4">{test.icon}</div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      {test.title}
                    </h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {test.description}
                    </p>
                  </div>
                </div>
                <ul className="space-y-2">
                  {test.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-gray-700">
                      <span className="text-emerald-600 mr-2 text-xl">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Additional Tests Note */}
          <div className="mt-12 text-center">
            <div className="bg-linear-to-r from-emerald-50 to-white p-8 rounded-2xl shadow-md border border-emerald-200 max-w-3xl mx-auto">
              <p className="text-gray-700 text-lg mb-2">
                <span className="font-bold text-emerald-600">
                  Additional tests available
                </span>{" "}
                based on your specific goals and skill level
              </p>
              <p className="text-gray-600">
                Custom assessments can be designed to target any aspect of your
                game
              </p>
            </div>
          </div>

          {/* Player Dashboard */}
          <div className="mt-14">
            <div className="bg-white rounded-3xl shadow-xl border-2 border-emerald-200 p-8 md:p-10">
              <div className="grid lg:grid-cols-2 gap-10 items-start">
                <div>
                  <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    Player Dashboard
                  </h3>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    The Player Dashboard is where we keep everything organized
                    so progress is clear — not guesswork. It helps players stay
                    motivated and helps parents actually see improvement over
                    time.
                  </p>

                  <div className="mt-6 space-y-3">
                    {[
                      {
                        title: "Player info",
                        desc: "Basic details so training stays personalized (age, notes, and what we're focusing on).",
                      },
                      {
                        title: "Tests & results",
                        desc: "Skill tests like shooting, passing, and dribbling — with history so we can track improvement.",
                      },
                      {
                        title: "Goals",
                        desc: "Clear targets and next steps (what to work on between sessions).",
                      },
                    ].map((item) => (
                      <div key={item.title} className="flex items-start gap-3">
                        <span className="text-emerald-600 text-xl leading-none mt-0.5">
                          ✓
                        </span>
                        <div>
                          <p className="font-bold text-gray-900">
                            {item.title}
                          </p>
                          <p className="text-gray-700">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-7">
                    <a
                      href={PLAYER_DASHBOARD_URL}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center bg-emerald-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-emerald-700 transition-colors shadow-lg"
                    >
                      Open Player Dashboard
                    </a>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  {[
                    {
                      title: "Tests & Results",
                      subtitle: "Scores + history so progress is measurable",
                      imgSrc: "/dashboard-tests-results.png",
                      imgAlt: "Player Dashboard - Tests and Results screen",
                      aspectClass: "aspect-[4/5]",
                    },
                    {
                      title: "Goals",
                      subtitle: "Targets + what to work on next",
                      imgSrc: "/dashboard-goals.png",
                      imgAlt: "Player Dashboard - Goals screen",
                      aspectClass: "aspect-[4/5]",
                    },
                    {
                      title: "Player Info",
                      subtitle:
                        "Profile + notes we use to personalize training",
                      imgSrc: "/dashboard-player-info.png",
                      imgAlt: "Player Dashboard - Player Info screen",
                      aspectClass: "aspect-video",
                    },
                  ].map((card, idx) => (
                    <div
                      key={card.title}
                      className={`bg-white rounded-2xl shadow-md border border-emerald-100 overflow-hidden ${
                        idx === 2 ? "sm:col-span-2" : ""
                      }`}
                    >
                      <div className="p-4 border-b border-emerald-100">
                        <p className="font-bold text-gray-900">{card.title}</p>
                        <p className="text-gray-600 text-sm mt-1">
                          {card.subtitle}
                        </p>
                      </div>

                      <div className="p-4">
                        <div
                          className={`${card.aspectClass} rounded-xl bg-linear-to-br from-gray-50 to-gray-100 border border-gray-200 overflow-hidden`}
                        >
                          <img
                            src={card.imgSrc}
                            alt={card.imgAlt}
                            className="w-full h-full object-contain"
                            loading="lazy"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Me Section */}
      <section className="py-20 px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Meet Your Mesa & Gilbert Soccer Coach
            </h2>
            <p className="text-xl text-gray-600">
              Passionate about developing the next generation of soccer players
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Image */}
            <div className="order-2 md:order-1">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-emerald-200">
                <div className="aspect-square">
                  <img
                    src="/me.JPG"
                    alt="David Fales - Soccer Coach serving Mesa and Gilbert, Arizona"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Bio Text */}
            <div className="order-1 md:order-2 space-y-6">
              <div className="bg-linear-to-br from-emerald-50 to-white p-8 rounded-2xl shadow-lg border-2 border-emerald-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="text-3xl mr-3">⚽</span>
                  Hi, I'm Coach David
                </h3>
                <p className="text-gray-700 leading-relaxed text-lg">
                  I'm a dedicated soccer coach with a passion for helping young
                  players reach their full potential. What sets my coaching
                  apart is a clear plan + measurable benchmarks, paired with
                  supportive coaching that builds confidence and consistency.
                  I'm proud to serve Mesa and Gilbert families.
                </p>
              </div>

              <div className="bg-linear-to-br from-emerald-50 to-white p-8 rounded-2xl shadow-lg border-2 border-emerald-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="text-3xl mr-3">🎯</span>
                  My Coaching Philosophy
                </h3>
                <p className="text-gray-700 leading-relaxed text-lg">
                  Sessions stay organized and age-appropriate. We focus on one
                  priority at a time, track progress simply, and communicate
                  clearly with parents.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Credentials Section */}
      <section id="credentials" className="py-20 px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Licenses & Experience
            </h2>
            <p className="text-xl text-gray-600">
              Proven expertise you can trust
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Certifications */}
            <div className="bg-linear-to-br from-emerald-50 to-white p-8 rounded-2xl shadow-lg border-2 border-emerald-200">
              <div className="flex items-center mb-6">
                <span className="text-5xl mr-4">🏆</span>
                <h3 className="text-3xl font-bold text-gray-900">
                  Certifications
                </h3>
              </div>
              <ul className="space-y-4">
                {[
                  "USSF D License",
                  "Coerver Diploma",
                  "Background checked through Coerver Arizona",
                  "CPR & First Aid trained",
                  "11v11 Grassroots Certification",
                  "9v9 Grassroots Certification",
                  "7v7 Grassroots Certification",
                ].map((cert, index) => (
                  <li key={index} className="flex items-start text-gray-700">
                    <span className="text-emerald-600 mr-3 text-2xl shrink-0">
                      ●
                    </span>
                    <span className="text-lg">{cert}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Experience */}
            <div className="bg-linear-to-br from-emerald-50 to-white p-8 rounded-2xl shadow-lg border-2 border-emerald-200">
              <div className="flex items-center mb-6">
                <span className="text-5xl mr-4">💼</span>
                <h3 className="text-3xl font-bold text-gray-900">Experience</h3>
              </div>
              <div className="space-y-6">
                <div className="border-l-4 border-emerald-600 pl-6">
                  <h4 className="text-xl font-bold text-gray-900 mb-2">
                    5 Years of Coaching Experience
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    Dedicated to developing players' skills, confidence, and
                    love for the game through personalized coaching approaches.
                  </p>
                </div>
                <div className="border-l-4 border-emerald-600 pl-6">
                  <h4 className="text-xl font-bold text-gray-900 mb-2">
                    4 Years of Technical Coaching
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    Specialized technical training across all skill levels,
                    focusing on fundamental development and advanced techniques.
                  </p>
                </div>
                <div className="border-l-4 border-emerald-600 pl-6">
                  <h4 className="text-xl font-bold text-gray-900 mb-2">
                    1 Year of Club-Based Coaching
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    Experience in competitive club environments, preparing
                    players for high-level performance and team dynamics.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Getting Started Section */}
      <section className="py-20 px-6 bg-linear-to-b from-emerald-50 to-white">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Getting Started
            </h2>
            <p className="text-xl text-gray-600">
              Your journey to improved skills and confidence starts here
            </p>
          </div>

          <div className="bg-white p-10 rounded-3xl shadow-2xl border-2 border-emerald-200">
            <div className="space-y-6">
              <div className="flex items-start">
                <span className="text-4xl mr-4">🎯</span>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    Individual Player Focus
                  </h3>
                  <p className="text-gray-700 leading-relaxed text-lg">
                    Each session is designed around the individual player.
                    Training is adjusted based on age, experience, and goals,
                    with an emphasis on long-term development, confidence on the
                    ball, and measurable improvement over time.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <span className="text-4xl mr-4">📈</span>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    Measurable Progress
                  </h3>
                  <p className="text-gray-700 leading-relaxed text-lg">
                    Track your improvement through regular assessments and see
                    real results as you develop your technical skills, build
                    confidence, and reach your soccer goals.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <span className="text-4xl mr-4">⚽</span>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    Ball-Based Training
                  </h3>
                  <p className="text-gray-700 leading-relaxed text-lg">
                    Every minute of every session involves the ball. Maximum
                    touches, maximum learning, maximum improvement. This is how
                    real soccer skills are developed.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews - Mesa/Gilbert specific */}
      <section id="reviews" className="py-20 px-6 bg-white">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              What Mesa & Gilbert Parents Say
            </h2>
            <p className="text-xl text-gray-600">
              Building reviews now — ask for references any time.
            </p>
          </div>

          <div className="bg-linear-to-br from-emerald-50 to-white p-8 rounded-2xl shadow-lg border-2 border-emerald-200">
            <p className="text-gray-800 text-lg leading-relaxed mb-4">
              <span className="font-bold text-emerald-700">
                First 10 Mesa/Gilbert families:
              </span>{" "}
              $10 off if you leave an honest Google review after session 2.
            </p>
            <p className="text-gray-600 mb-4">
              No pressure — I'm focused on earning trust the right way with East Valley families.
            </p>
            <p className="text-gray-700 text-sm">
              Parents in Gilbert and Mesa appreciate clear communication, organized sessions,
              and a coach who shows up on time with a plan. That's what you'll get.
            </p>
            <div className="mt-6 text-center">
              <a
                href="https://g.page/r/CbrmGhQt_77aEBI/review"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
              >
                Write a Review
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing & Scheduling Section */}
      <section id="pricing" className="py-20 px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Training Packages & Options for Mesa/Gilbert Families
            </h2>
            <p className="text-xl text-gray-600">
              Choose the commitment level that works best for your player
            </p>
          </div>

          {/* Package Options */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {/* 12-Week Package - Most Popular */}
            <div className="bg-linear-to-br from-emerald-600 to-emerald-700 p-8 rounded-2xl shadow-xl border-4 border-emerald-400 relative transform hover:scale-105 transition-all duration-300">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-yellow-400 text-gray-900 px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                  BEST VALUE
                </span>
              </div>
              <div className="text-center text-white">
                <div className="text-5xl mb-3">🏆</div>
                <h3 className="text-3xl font-bold mb-3">12-Week Package</h3>
                <p className="text-emerald-100 mb-6 leading-relaxed">
                  Maximum progress and consistency. Lowest per-session rate.
                </p>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 mb-6">
                  <p className="text-2xl font-bold mb-2">Best Per-Session Rate</p>
                  <p className="text-emerald-100 text-sm">
                    Commitment = Better results + better pricing
                  </p>
                </div>
                <ul className="space-y-3 text-left">
                  <li className="flex items-start">
                    <span className="text-yellow-300 mr-2 text-xl">✓</span>
                    <span className="text-emerald-50">Real skill development takes time</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-300 mr-2 text-xl">✓</span>
                    <span className="text-emerald-50">Build lasting habits and technique</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-300 mr-2 text-xl">✓</span>
                    <span className="text-emerald-50">Track meaningful progress over time</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-300 mr-2 text-xl">✓</span>
                    <span className="text-emerald-50">Priority scheduling</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* 6-Week Package */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-emerald-200 hover:border-emerald-400 transition-all duration-300">
              <div className="text-center">
                <div className="text-5xl mb-3">📈</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">6-Week Package</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Great for focused improvement on specific skills.
                </p>
                <div className="bg-emerald-50 rounded-xl p-4 mb-6">
                  <p className="text-xl font-bold text-gray-900 mb-1">Better Rate</p>
                  <p className="text-gray-600 text-sm">
                    Solid commitment for noticeable results
                  </p>
                </div>
                <ul className="space-y-3 text-left">
                  <li className="flex items-start">
                    <span className="text-emerald-600 mr-2 text-xl">✓</span>
                    <span className="text-gray-700">Focus on 1-2 key areas</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-emerald-600 mr-2 text-xl">✓</span>
                    <span className="text-gray-700">See clear improvement</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-emerald-600 mr-2 text-xl">✓</span>
                    <span className="text-gray-700">Progress tracking included</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* 4-Week or Session-to-Session */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-gray-200">
              <div className="text-center">
                <div className="text-5xl mb-3">📅</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">4-Week Package or Week-to-Week</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Flexible option to try training or work around busy schedules.
                </p>
                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                  <p className="text-xl font-bold text-gray-900 mb-1">Standard Rate</p>
                  <p className="text-gray-600 text-sm">
                    Maximum flexibility, less commitment
                  </p>
                </div>
                <ul className="space-y-3 text-left">
                  <li className="flex items-start">
                    <span className="text-emerald-600 mr-2 text-xl">✓</span>
                    <span className="text-gray-700">Test out training first</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-emerald-600 mr-2 text-xl">✓</span>
                    <span className="text-gray-700">Schedule week by week</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-emerald-600 mr-2 text-xl">✓</span>
                    <span className="text-gray-700">No long-term commitment</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Training Format & Pricing Range */}
          <div className="bg-linear-to-br from-emerald-50 to-white p-8 rounded-2xl shadow-lg border-2 border-emerald-200 mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Training Format & Pricing
            </h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-md border border-emerald-100">
                <div className="flex items-center mb-4">
                  <div className="text-4xl mr-3">👤</div>
                  <h4 className="text-xl font-bold text-gray-900">1-on-1 Private Sessions</h4>
                </div>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  Maximum individual attention. Fully customized to your player's needs and goals.
                </p>
                <div className="bg-emerald-50 rounded-lg p-4">
                  <p className="text-gray-900 font-semibold">Sessions range from $60-$80 based on package choice</p>
                  <p className="text-gray-600 text-sm mt-2">12-week package = lowest rate per session</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md border border-emerald-100">
                <div className="flex items-center mb-4">
                  <div className="text-4xl mr-3">👥</div>
                  <h4 className="text-xl font-bold text-gray-900">Small Group Sessions</h4>
                </div>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  2-7 players. Great for teammates or friends. Game-like pressure with focused coaching.
                </p>
                <div className="bg-emerald-50 rounded-lg p-4">
                  <p className="text-gray-900 font-semibold">Sessions range from $50-$70 based on package and group size</p>
                  <p className="text-gray-600 text-sm mt-2">Cost split among families</p>
                </div>
              </div>
            </div>
          </div>

          {/* Why 12-Week Packages Work Best */}
          <div className="bg-linear-to-br from-gray-900 to-gray-800 p-8 md:p-10 rounded-2xl shadow-2xl border-2 border-gray-700 mb-12">
            <h3 className="text-3xl font-bold text-white mb-6 text-center">
              Why 12 Weeks Is the Best Investment
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-5xl mb-3">🧠</div>
                <h4 className="text-xl font-bold text-white mb-3">Skill Development Takes Time</h4>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Real technique changes don't happen in 2-3 sessions. Your player needs consistent repetition to build muscle memory and confidence.
                </p>
              </div>
              <div className="text-center">
                <div className="text-5xl mb-3">📊</div>
                <h4 className="text-xl font-bold text-white mb-3">Measurable Progress</h4>
                <p className="text-gray-300 text-sm leading-relaxed">
                  12 weeks gives us time to test, train, and retest. You'll see actual improvement in skill benchmarks, not just "feeling better."
                </p>
              </div>
              <div className="text-center">
                <div className="text-5xl mb-3">💪</div>
                <h4 className="text-xl font-bold text-white mb-3">Build Lasting Habits</h4>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Consistency builds confidence. Players who commit to 12 weeks develop routines and mindsets that carry over to games and practice.
                </p>
              </div>
            </div>
            <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <p className="text-white text-center text-lg font-semibold mb-2">
                🎯 Mesa & Gilbert parents who commit to 12 weeks see the most dramatic improvement
              </p>
              <p className="text-gray-300 text-center text-sm">
                Short-term training can help, but real development requires time and repetition.
              </p>
            </div>
          </div>

          {/* What's Included */}
          <div className="bg-white p-8 rounded-2xl shadow-xl border-2 border-emerald-200 mb-10">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Every Package Includes
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl mb-3">⚽</div>
                <h4 className="font-bold text-gray-900 mb-2">
                  1-Hour Sessions
                </h4>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Ball-based technical training. Every minute on the ball, maximum touches, real improvement.
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-3">📱</div>
                <h4 className="font-bold text-gray-900 mb-2">
                  Player Dashboard Access
                </h4>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Track test results, goals, and progress over time. Parents see clear improvement.
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-3">📈</div>
                <h4 className="font-bold text-gray-900 mb-2">
                  Progress Plans
                </h4>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Simple benchmarks after each session so you know exactly what to work on next.
                </p>
              </div>
            </div>
          </div>

          {/* Scheduling Section */}
          <div className="bg-linear-to-br from-emerald-50 to-white p-8 rounded-2xl shadow-lg border-2 border-emerald-200">
            <div className="text-center mb-6">
              <div className="text-5xl mb-4">📅</div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                Flexible Scheduling in Mesa & Gilbert
              </h3>
              <p className="text-gray-700 leading-relaxed text-lg mb-6 max-w-2xl mx-auto">
                Sessions are scheduled directly by text. Times are flexible and based on availability at your preferred East Valley park.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              <div className="space-y-3">
                <div className="flex items-center text-gray-700">
                  <span className="text-2xl mr-3 text-emerald-600">✓</span>
                  <span>After school hours available</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <span className="text-2xl mr-3 text-emerald-600">✓</span>
                  <span>Weekend sessions available</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center text-gray-700">
                  <span className="text-2xl mr-3 text-emerald-600">✓</span>
                  <span>One-on-one or small groups</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <span className="text-2xl mr-3 text-emerald-600">✓</span>
                  <span>Schedule via text, call, or WhatsApp</span>
                </div>
              </div>
            </div>
            <div className="mt-8 flex flex-wrap gap-3 justify-center">
              <a
                href={smsHref}
                className="inline-flex items-center justify-center bg-emerald-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-emerald-700 transition-colors shadow-lg"
              >
                Text to discuss packages
              </a>
              <a
                href={waHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center bg-white text-emerald-700 px-8 py-4 rounded-full font-semibold text-lg border-2 border-emerald-200 hover:bg-emerald-50 transition-colors shadow"
              >
                WhatsApp
              </a>
              <a
                href={telHref}
                className="inline-flex items-center justify-center bg-white text-gray-800 px-8 py-4 rounded-full font-semibold text-lg border-2 border-gray-200 hover:border-gray-300 transition-colors shadow"
              >
                Call
              </a>
            </div>
            <p className="text-gray-500 text-sm text-center mt-6">
              We'll discuss the best package for your player's goals and your schedule. Pricing confirmed when we book.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ - Mesa/Gilbert specific */}
      <section id="faq" className="py-20 px-6 bg-white">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              FAQ: Common Questions from Mesa & Gilbert Parents
            </h2>
            <p className="text-xl text-gray-600">
              Quick answers parents usually want.
            </p>
          </div>

          <div className="space-y-5">
            {[
              {
                q: "Where exactly do sessions happen in Mesa and Gilbert?",
                a: "We meet at quality public parks like Freestone Park, Discovery Park, Hetchler Park (Gilbert Soccer Complex), Red Mountain Park, and other Mesa/Gilbert locations. I'll confirm the exact spot when we schedule based on what's most convenient for you.",
              },
              {
                q: "What age is this for?",
                a: "Ages 8–16. Beginner to club level. Most of my players are in Mesa and Gilbert club soccer programs or looking to join one.",
              },
              {
                q: "Do you work with players from specific Gilbert/Mesa soccer clubs?",
                a: "Yes! I work with players from various East Valley clubs including Gilbert Youth Soccer Association (GYSA), Mesa United, and others. Training complements what they're learning at club practice.",
              },
              {
                q: "What should my player bring?",
                a: "Ball, water, cleats, shin guards. Parks have shade but bring sunscreen for Arizona weather.",
              },
              {
                q: "Do you do small groups with my player's teammates?",
                a: "Absolutely! Small groups (2-7 players) are great for teammates who want to train together. Just text me to coordinate.",
              },
              {
                q: "How do I know which park we'll use?",
                a: "When you text me your location in Mesa or Gilbert, I'll suggest 2-3 nearby parks and you can pick what works best for your schedule.",
              },
              {
                q: "What if weather is bad?",
                a: "Arizona weather is usually great, but if it's raining or too hot (110+), we'll reschedule. I'll text you in advance.",
              },
              {
                q: "How fast will we see improvement?",
                a: "Most players improve fastest with consistency. I'll give a simple plan after the first session.",
              },
            ].map((item) => (
              <div
                key={item.q}
                className="bg-linear-to-br from-emerald-50 to-white p-6 rounded-2xl shadow-md border border-emerald-100"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {item.q}
                </h3>
                <p className="text-gray-700 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <a
              href={smsHref}
              className="inline-flex items-center justify-center bg-emerald-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-emerald-700 transition-colors shadow-lg"
            >
              Still have questions? Text me
            </a>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        className="py-20 px-6 bg-linear-to-b from-emerald-50 to-emerald-100"
      >
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Start Your Mesa/Gilbert Soccer Training Today
            </h2>
            <p className="text-xl text-gray-600">
              Fastest is text or WhatsApp. If you prefer, fill this quick form.
            </p>
          </div>

          <div className="bg-white p-10 rounded-3xl shadow-2xl border-2 border-emerald-200">
            <div className="grid md:grid-cols-2 gap-10">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Quick message (copy/paste)
                </h3>
                <p className="text-gray-600 mb-4">
                  This is the easiest way to schedule.
                </p>
                <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4">
                  <p className="text-gray-800 leading-relaxed">
                    {buildPrefilledMessage()}
                  </p>
                </div>
                <div className="flex flex-wrap gap-3 mt-5">
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(
                          buildPrefilledMessage()
                        );
                      } catch {
                        // noop
                      }
                    }}
                    className="inline-flex items-center justify-center bg-gray-900 text-white px-5 py-3 rounded-full font-semibold hover:bg-gray-800 transition-colors"
                  >
                    Copy
                  </button>
                  <a
                    href={smsHref}
                    className="inline-flex items-center justify-center bg-emerald-600 text-white px-5 py-3 rounded-full font-semibold hover:bg-emerald-700 transition-colors"
                  >
                    Text
                  </a>
                  <a
                    href={waHref}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center bg-white text-emerald-700 px-5 py-3 rounded-full font-semibold border-2 border-emerald-200 hover:bg-emerald-50 transition-colors"
                  >
                    WhatsApp
                  </a>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Or send a quick form
                </h3>

                {formStatus === "success" ? (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-gray-800">
                    <p className="font-semibold mb-1">Thanks — message sent.</p>
                    <p className="text-gray-700">
                      I'll reply as soon as I can to confirm a time and
                      location.
                    </p>
                  </div>
                ) : formStatus === "error" ? (
                  <div className="bg-red-50 border border-red-200 rounded-2xl p-5 text-gray-800 mb-5">
                    <p className="font-semibold mb-1">
                      Something went wrong sending your message.
                    </p>
                    <p className="text-gray-700">
                      Please try again, or just text me directly.
                    </p>
                  </div>
                ) : null}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label
                      htmlFor="parentName"
                      className="block text-gray-700 font-semibold mb-2 text-lg"
                    >
                      Parent name *
                    </label>
                    <input
                      type="text"
                      id="parentName"
                      name="parentName"
                      value={formData.parentName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none transition-colors text-gray-900"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-gray-700 font-semibold mb-2 text-lg"
                    >
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none transition-colors text-gray-900"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-gray-700 font-semibold mb-2 text-lg"
                      >
                        Phone (optional)
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none transition-colors text-gray-900"
                        placeholder="(555) 123-4567"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="playerAge"
                        className="block text-gray-700 font-semibold mb-2 text-lg"
                      >
                        Player age *
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        id="playerAge"
                        name="playerAge"
                        value={formData.playerAge}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none transition-colors text-gray-900"
                        placeholder="8–16"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="mainGoal"
                      className="block text-gray-700 font-semibold mb-2 text-lg"
                    >
                      Main goal *
                    </label>
                    <input
                      type="text"
                      id="mainGoal"
                      name="mainGoal"
                      value={formData.mainGoal}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none transition-colors text-gray-900"
                      placeholder="First touch, dribbling confidence, finishing, etc."
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="bestDaysTimes"
                        className="block text-gray-700 font-semibold mb-2 text-lg"
                      >
                        Best days/times *
                      </label>
                      <input
                        type="text"
                        id="bestDaysTimes"
                        name="bestDaysTimes"
                        value={formData.bestDaysTimes}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none transition-colors text-gray-900"
                        placeholder="Mon/Wed after 4pm, Sat mornings..."
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="area"
                        className="block text-gray-700 font-semibold mb-2 text-lg"
                      >
                        Area *
                      </label>
                      <input
                        type="text"
                        id="area"
                        name="area"
                        value={formData.area}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none transition-colors text-gray-900"
                        placeholder="Mesa or Gilbert"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="sessionType"
                      className="block text-gray-700 font-semibold mb-2 text-lg"
                    >
                      Session type
                    </label>
                    <input
                      type="text"
                      id="sessionType"
                      name="sessionType"
                      value={formData.sessionType}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none transition-colors text-gray-900"
                      placeholder="Private (1-on-1) or Small group"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="notes"
                      className="block text-gray-700 font-semibold mb-2 text-lg"
                    >
                      Notes (optional)
                    </label>
                    <textarea
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none transition-colors resize-none text-gray-900"
                      placeholder="Anything helpful (club level, position, injuries, etc.)"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-emerald-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-emerald-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Calendly */}
          <div
            id="book"
            className="mt-10 bg-white p-8 md:p-10 rounded-3xl shadow-2xl border-2 border-emerald-200"
          >
            <div className="text-center mb-6">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                Schedule a quick intro
              </h3>
              <p className="text-gray-600">
                If you want to meet me first, grab a quick 15 minute slot and
                we'll discuss training in Mesa or Gilbert and what you want for your player.
              </p>
            </div>

            <link
              rel="stylesheet"
              href="https://assets.calendly.com/assets/external/widget.css"
            />
            <div
              className="calendly-inline-widget"
              data-url={CALENDLY_URL}
              style={{ minWidth: "320px", height: "700px" }}
            />
            <Script
              src="https://assets.calendly.com/assets/external/widget.js"
              strategy="lazyOnload"
            />
          </div>

          {/* Contact Info */}
          <div className="mt-12 text-center">
            <div className="flex flex-wrap justify-center gap-8 text-gray-700">
              <div className="flex items-center">
                <span className="text-2xl mr-2">📧</span>
                <a
                  href="mailto:davidfalesct@gmail.com"
                  className="text-lg hover:text-emerald-600 transition-colors"
                >
                  davidfalesct@gmail.com
                </a>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex items-center mb-1">
                  <span className="text-2xl mr-2">📞</span>
                  <a
                    href={telHref}
                    className="text-lg hover:text-emerald-600 transition-colors"
                  >
                    (720) 612-2979
                  </a>
                </div>
                <span className="text-sm text-gray-500">
                  Text • Call • WhatsApp
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-2xl mr-2">📍</span>
                <span className="text-lg">Mesa & Gilbert (local parks)</span>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-6">
              I usually reply within 24 hours. If I'm coaching, I'll respond
              later that day.
            </p>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section
        id="blog"
        className="py-20 px-6 bg-linear-to-b from-emerald-50 to-white"
      >
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Latest from the Blog
            </h2>
            <p className="text-xl text-gray-600 mb-6">
              Tips, techniques, and insights to help improve your game
            </p>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Discover training strategies, skill development tips, and coaching
              insights that can help take your game to the next level.
            </p>
          </div>

          {blogLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading blog posts...</p>
            </div>
          ) : blogPosts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">
                No blog posts yet. Check back soon!
              </p>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-3 gap-8 mb-10">
                {blogPosts.map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>
              <div className="text-center">
                <Link
                  href="/blog"
                  className="inline-flex items-center justify-center bg-emerald-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-emerald-700 transition-colors shadow-lg"
                >
                  View All Blogs
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Sticky mobile CTA bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-emerald-100 bg-white/95 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 py-3 grid grid-cols-3 gap-3">
          <a
            href={smsHref}
            className="text-center bg-emerald-600 text-white py-3 rounded-xl font-semibold shadow"
          >
            Text
          </a>
          <a
            href={telHref}
            className="text-center bg-white text-gray-900 py-3 rounded-xl font-semibold border-2 border-gray-200"
          >
            Call
          </a>
          <a
            href={waHref}
            target="_blank"
            rel="noreferrer"
            className="text-center bg-white text-emerald-700 py-3 rounded-xl font-semibold border-2 border-emerald-200"
          >
            WhatsApp
          </a>
        </div>
      </div>

      <MainFooter />
    </div>
  );
};

export default MesaGilbertLandingPage;
