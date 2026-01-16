"use client";

import React, { useState } from "react";
import Script from "next/script";
import MainHeader from "@/app/components/layout/MainHeader";
import MainFooter from "@/app/components/layout/MainFooter";

const PLAYER_DASHBOARD_URL =
  process.env.NEXT_PUBLIC_PLAYER_DASHBOARD_URL ||
  "https://app.davidssoccertraining.com";

const Home = () => {
  const COACH_PHONE_E164 = "+17206122979";
  const COACH_PHONE_WA = "17206122979"; // WhatsApp requires digits only in wa.me links
  const CALENDLY_URL = "https://calendly.com/davidssoccertraining-info/intro";

  const defaultTextTemplate =
    "Hi David, my player is __ years old. Main goal is __. Best days are __. We’re in __ (Gilbert/Mesa).";

  const [formData, setFormData] = useState({
    parentName: "",
    email: "",
    phone: "",
    playerAge: "",
    mainGoal: "",
    bestDaysTimes: "",
    area: "",
    sessionType: "Private (1-on-1)",
    notes: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState<
    "idle" | "success" | "error" | "loading"
  >("idle");

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const buildPrefilledMessage = () => {
    const age = formData.playerAge?.trim() || "__";
    const goal = formData.mainGoal?.trim() || "__";
    const days = formData.bestDaysTimes?.trim() || "__";
    const area = formData.area?.trim() || "__";
    return `Hi David, my player is ${age} years old. Main goal is ${goal}. Best days are ${days}. We’re in ${area} (Gilbert/Mesa).`;
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
          area: "",
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

  return (
    <div className="min-h-screen bg-linear-to-b from-white to-emerald-50 pb-24 md:pb-0">
      <MainHeader />

      {/* Hero Section */}
      <section className="py-14 md:py-20 px-6 bg-linear-to-b from-emerald-50 to-white">
        <div className="container mx-auto max-w-5xl">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-emerald-700 font-semibold mb-3">
                Private soccer training (Gilbert & Mesa)
              </p>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-5 leading-tight">
                Private Soccer Training in{" "}
                <span className="text-emerald-600">Gilbert and Mesa</span>
              </h2>
              <p className="text-lg md:text-xl text-gray-700 mb-6 leading-relaxed">
                1-on-1 and small group sessions for ages 8–16. Clear goals, real
                improvement, and a coach parents can trust.
              </p>

              <ul className="space-y-3 mb-8">
                {[
                  "Customized sessions based on your player’s needs",
                  "Progress tracking with simple skill benchmarks",
                  "Flexible scheduling by text",
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
                Text me and we’ll confirm time & location and get started.
              </p>
            </div>

            <div className="bg-white rounded-3xl shadow-xl border border-emerald-100 overflow-hidden">
              <div className="p-6 md:p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Quick Start
                </h3>
                <p className="text-gray-600 mb-5">
                  Copy/paste this text and you’re done.
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
                        // Clipboard may fail in some browsers; still ok.
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
        </div>
      </section>

      {/* Who This Is For Section */}
      <section className="py-20 px-6 bg-linear-to-r from-emerald-600 to-emerald-700 text-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Who This Is For
            </h2>
            <p className="text-xl text-emerald-100 leading-relaxed max-w-3xl mx-auto">
              Designed for families who want structured training, clear goals,
              and consistent progress.
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
                Individual attention
              </h3>
              <p className="text-emerald-50 text-center leading-relaxed">
                One-on-one sessions with a customized plan for your player, plus
                clear goals and measurable progress.
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
              How it works
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
                title: "Text me your player’s age + main goal",
                desc: "We’ll pick one priority (confidence on the ball, passing, finishing, etc.).",
                icon: "💬",
              },
              {
                step: "Step 2",
                title: "I confirm a time + location",
                desc: "Usually local parks in Gilbert/Mesa. Exact spot shared when we schedule.",
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

      {/* Training Focus Section */}
      <section id="what-we-work-on" className="py-20 px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              What we work on
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
                Every session is customized to your player’s age, level, and one
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
                        desc: "Basic details so training stays personalized (age, notes, and what we’re focusing on).",
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
              Meet Your Coach
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
                    alt="David Fales - Soccer Coach"
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
                  Hi, I’m Coach David
                </h3>
                <p className="text-gray-700 leading-relaxed text-lg">
                  I'm a dedicated soccer coach with a passion for helping young
                  players reach their full potential. What sets my coaching
                  apart is a clear plan + measurable benchmarks, paired with
                  supportive coaching that builds confidence and consistency.
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

      {/* Reviews */}
      <section id="reviews" className="py-20 px-6 bg-white">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Reviews
            </h2>
            <p className="text-xl text-gray-600">
              Building reviews now — ask for references any time.
            </p>
          </div>

          <div className="bg-linear-to-br from-emerald-50 to-white p-8 rounded-2xl shadow-lg border-2 border-emerald-200">
            <p className="text-gray-800 text-lg leading-relaxed">
              <span className="font-bold text-emerald-700">
                First 10 families:
              </span>{" "}
              $10 off if you leave an honest Google review after session 2.
            </p>
            <p className="text-gray-600 mt-3">
              No pressure — I’m focused on earning trust the right way.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing & Scheduling Section */}
      <section id="pricing" className="py-20 px-6 bg-white">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Pricing & Scheduling
            </h2>
            <p className="text-xl text-gray-600">
              Flexible scheduling to fit your busy life
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-linear-to-br from-emerald-600 to-emerald-700 text-white p-8 rounded-2xl shadow-2xl border-2 border-emerald-500">
              <div className="text-5xl mb-4 text-center">💰</div>
              <h3 className="text-3xl font-bold mb-4 text-center">
                Private Session: $60 / hour
              </h3>
              <p className="text-emerald-50 text-center text-lg mb-6">
                Small groups available — ask for rates
              </p>
              <div className="space-y-3">
                <div className="flex items-center text-emerald-50">
                  <span className="text-2xl mr-3">✓</span>
                  <span>1-on-1 and small group options</span>
                </div>
                <div className="flex items-center text-emerald-50">
                  <span className="text-2xl mr-3">✓</span>
                  <span>1-hour training sessions</span>
                </div>
                <div className="flex items-center text-emerald-50">
                  <span className="text-2xl mr-3">✓</span>
                  <span>Ball-based technical training</span>
                </div>
                <div className="flex items-center text-emerald-50">
                  <span className="text-2xl mr-3">✓</span>
                  <span>Simple progress plan after sessions</span>
                </div>
              </div>
              <p className="text-emerald-100 text-sm mt-6 text-center">
                Payment and details confirmed after we pick a time.
              </p>
            </div>

            <div className="bg-linear-to-br from-emerald-50 to-white p-8 rounded-2xl shadow-lg border-2 border-emerald-200">
              <div className="text-5xl mb-4 text-center">📅</div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4 text-center">
                Flexible Scheduling
              </h3>
              <p className="text-gray-700 leading-relaxed text-lg mb-6">
                Sessions are scheduled directly by text. Times are flexible and
                based on availability.
              </p>
              <div className="space-y-3">
                <div className="flex items-center text-gray-700">
                  <span className="text-2xl mr-3 text-emerald-600">✓</span>
                  <span>After school hours available</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <span className="text-2xl mr-3 text-emerald-600">✓</span>
                  <span>Weekend sessions available</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <span className="text-2xl mr-3 text-emerald-600">✓</span>
                  <span>One-on-one or small groups</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <span className="text-2xl mr-3 text-emerald-600">✓</span>
                  <span>Schedule via text, call, WhatsApp, or email</span>
                </div>
              </div>
              <div className="mt-8 flex flex-wrap gap-3 justify-center">
                <a
                  href={smsHref}
                  className="inline-flex items-center justify-center bg-emerald-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-emerald-700 transition-colors shadow"
                >
                  Text
                </a>
                <a
                  href={waHref}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center bg-white text-emerald-700 px-6 py-3 rounded-full font-semibold border-2 border-emerald-200 hover:bg-emerald-50 transition-colors"
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
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 px-6 bg-white">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              FAQ
            </h2>
            <p className="text-xl text-gray-600">
              Quick answers parents usually want.
            </p>
          </div>

          <div className="space-y-5">
            {[
              {
                q: "Where do sessions happen?",
                a: "We meet at well-known public parks in Gilbert/Mesa. I’ll confirm the exact park when we schedule.",
              },
              {
                q: "What age is this for?",
                a: "Ages 8–16. Beginner to club level.",
              },
              {
                q: "What should my player bring?",
                a: "Ball, water, cleats, shin guards.",
              },
              { q: "Do you do small groups?", a: "Yes — text me for options." },
              {
                q: "What if we need to reschedule?",
                a: "Just text me as early as possible and we’ll find a new time.",
              },
              {
                q: "How fast will we see improvement?",
                a: "Most players improve fastest with consistency. I’ll give a simple plan after the first session.",
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
              Text me to get started
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
                      I’ll reply as soon as I can to confirm a time and
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
                        placeholder="Gilbert or Mesa"
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
                we’ll confirm a simple location in Gilbert or Mesa and what you
                want for your player.
              </p>
            </div>

            {/* Calendly typically expects this CSS for proper widget styling */}
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
                <span className="text-lg">Gilbert & Mesa (local parks)</span>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-6">
              I usually reply within 24 hours. If I’m coaching, I’ll respond
              later that day.
            </p>
          </div>
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

export default Home;
