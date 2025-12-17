"use client";

import React, { useState } from "react";

const Home = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Thank you for your interest! I will get back to you soon.");
        setFormData({ name: "", email: "", phone: "", message: "" });
      } else {
        alert("There was an error sending your message. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("There was an error sending your message. Please try again.");
    } finally {
      setIsSubmitting(false);
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
    <div className="min-h-screen bg-gradient-to-b from-white to-emerald-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-lg sticky top-0 z-50">
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
                  David Fales
                </h1>
                <p className="text-emerald-100 text-xs mt-0.5">
                  Private Coaching & Development
                </p>
              </div>
            </div>
            <nav className="hidden md:flex space-x-6">
              <a
                href="#services"
                className="hover:text-emerald-200 transition-colors duration-200 font-medium text-sm"
              >
                Services
              </a>
              <a
                href="#testing"
                className="hover:text-emerald-200 transition-colors duration-200 font-medium text-sm"
              >
                Testing
              </a>
              <a
                href="#credentials"
                className="hover:text-emerald-200 transition-colors duration-200 font-medium text-sm"
              >
                Credentials
              </a>
              <a
                href="#contact"
                className="hover:text-emerald-200 transition-colors duration-200 font-medium text-sm"
              >
                Contact
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-emerald-50 to-white">
        <div className="container mx-auto text-center max-w-4xl">
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Transform Your Potential into{" "}
            <span className="text-emerald-600">Performance</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Professional coaching backed by science, certification, and proven
            results
          </p>
          <a
            href="#contact"
            className="inline-block bg-emerald-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-emerald-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Start Your Journey
          </a>
        </div>
      </section>

      {/* Who This Is For Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Who This Is For
            </h2>
            <p className="text-xl text-emerald-100 leading-relaxed max-w-3xl mx-auto">
              Personalized soccer training designed specifically for YOU,
              focused on your unique strengths and development areas
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
                Individual Focus
              </h3>
              <p className="text-emerald-50 text-center leading-relaxed">
                One-on-one training specifically focused on YOUR development,
                strengths, and goals
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

      {/* Training Focus Section */}
      <section id="services" className="py-20 px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Training Focus
            </h2>
            <p className="text-xl text-gray-600">
              100% ball-based technical training for complete player development
            </p>
          </div>

          {/* Part 1: Technical Skills */}
          <div className="mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Core Technical Skills
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: "⚽",
                  title: "First Touch",
                  description:
                    "Master ball control and receiving skills with both feet under pressure.",
                },
                {
                  icon: "🏃",
                  title: "Dribbling",
                  description:
                    "Build close control, moves, and the ability to beat defenders.",
                },
                {
                  icon: "🎯",
                  title: "Passing",
                  description:
                    "Perfect technique and accuracy for short and long distribution.",
                },
                {
                  icon: "🥅",
                  title: "Finishing",
                  description:
                    "Improve shooting power, placement, and composure in front of goal.",
                },
              ].map((skill, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-emerald-50 to-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-emerald-100 text-center"
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
            <div className="bg-gradient-to-br from-emerald-50 to-white p-8 rounded-2xl shadow-lg border-2 border-emerald-200">
              <div className="text-5xl mb-4 text-center">🎯</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                Tailored to You
              </h3>
              <p className="text-gray-700 leading-relaxed text-lg">
                Every session is customized based on your age, current skill
                level, and specific goals. Whether you're building fundamentals
                or refining advanced techniques, the training adapts to where
                you are and where you want to go.
              </p>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-white p-8 rounded-2xl shadow-lg border-2 border-emerald-200">
              <div className="text-5xl mb-4 text-center">👥</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                Flexible Formats
              </h3>
              <p className="text-gray-700 leading-relaxed text-lg">
                Choose between individual one-on-one sessions for maximum
                personalized attention, or small-group training to add
                competitive elements while still getting focused coaching. Both
                formats ensure you get the touches and feedback you need.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testing Section */}
      <section
        id="testing"
        className="py-20 px-6 bg-gradient-to-b from-emerald-50 to-emerald-100"
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
            <div className="bg-gradient-to-r from-emerald-50 to-white p-8 rounded-2xl shadow-md border border-emerald-200 max-w-3xl mx-auto">
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
              <div className="bg-gradient-to-br from-emerald-50 to-white p-8 rounded-2xl shadow-lg border-2 border-emerald-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="text-3xl mr-3">⚽</span>
                  Hi, I'm David Fales
                </h3>
                <p className="text-gray-700 leading-relaxed text-lg">
                  I'm a dedicated soccer coach with a passion for helping young
                  players reach their full potential. What sets my coaching
                  apart is my data-driven approach I combine the results from
                  skill assessments and tests with personalized training that's
                  tailored specifically to how YOU play. This allows me to be an
                  all-around coach who addresses every aspect of your game, from
                  technical skills to tactical understanding, while building a
                  genuine love for the beautiful game.
                </p>
              </div>

              <div className="bg-gradient-to-br from-emerald-50 to-white p-8 rounded-2xl shadow-lg border-2 border-emerald-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="text-3xl mr-3">🎯</span>
                  My Coaching Philosophy
                </h3>
                <p className="text-gray-700 leading-relaxed text-lg">
                  Every player is unique, and that's exactly why I use a
                  combination of objective test data and in-depth observation of
                  your playing style. By analyzing how you perform in drills,
                  understanding your strengths, and identifying areas for
                  growth, I create a completely customized training plan that's
                  designed just for you. Whether you're just starting out or
                  looking to compete at higher levels, this comprehensive
                  approach ensures you get the all-around development you need
                  to reach your goals. Let's take your game to the next level
                  together!
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
            <div className="bg-gradient-to-br from-emerald-50 to-white p-8 rounded-2xl shadow-lg border-2 border-emerald-200">
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
                  "11v11 Grassroots Certification",
                  "9v9 Grassroots Certification",
                  "7v7 Grassroots Certification",
                ].map((cert, index) => (
                  <li key={index} className="flex items-start text-gray-700">
                    <span className="text-emerald-600 mr-3 text-2xl flex-shrink-0">
                      ●
                    </span>
                    <span className="text-lg">{cert}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Experience */}
            <div className="bg-gradient-to-br from-emerald-50 to-white p-8 rounded-2xl shadow-lg border-2 border-emerald-200">
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
      <section className="py-20 px-6 bg-gradient-to-b from-emerald-50 to-white">
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

      {/* Pricing & Scheduling Section */}
      <section className="py-20 px-6 bg-white">
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
            <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 text-white p-8 rounded-2xl shadow-2xl border-2 border-emerald-500">
              <div className="text-5xl mb-4 text-center">💰</div>
              <h3 className="text-3xl font-bold mb-4 text-center">
                $60 per Hour
              </h3>
              <p className="text-emerald-50 text-center text-lg mb-6">
                Per player
              </p>
              <div className="space-y-3">
                <div className="flex items-center text-emerald-50">
                  <span className="text-2xl mr-3">✓</span>
                  <span>Individual or small-group sessions</span>
                </div>
                <div className="flex items-center text-emerald-50">
                  <span className="text-2xl mr-3">✓</span>
                  <span>1-hour training sessions</span>
                </div>
                <div className="flex items-center text-emerald-50">
                  <span className="text-2xl mr-3">✓</span>
                  <span>100% ball-based training</span>
                </div>
                <div className="flex items-center text-emerald-50">
                  <span className="text-2xl mr-3">✓</span>
                  <span>Personalized coaching plan</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-white p-8 rounded-2xl shadow-lg border-2 border-emerald-200">
              <div className="text-5xl mb-4 text-center">📅</div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4 text-center">
                Flexible Scheduling
              </h3>
              <p className="text-gray-700 leading-relaxed text-lg mb-6">
                Training sessions are scheduled directly via message. Times are
                flexible and based on availability.
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
                  <span>Schedule via text, call, or email</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        className="py-20 px-6 bg-gradient-to-b from-emerald-50 to-emerald-100"
      >
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Let's Connect
            </h2>
            <p className="text-xl text-gray-600">
              Ready to start your transformation? Get in touch today.
            </p>
          </div>

          <div className="bg-white p-10 rounded-3xl shadow-2xl border-2 border-emerald-200">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-gray-700 font-semibold mb-2 text-lg"
                >
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
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
                  Email Address *
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

              <div>
                <label
                  htmlFor="phone"
                  className="block text-gray-700 font-semibold mb-2 text-lg"
                >
                  Phone Number
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
                  htmlFor="message"
                  className="block text-gray-700 font-semibold mb-2 text-lg"
                >
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none transition-colors resize-none text-gray-900"
                  placeholder="Tell me about your goals and what you're looking to achieve..."
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
                    href="tel:+17206122979"
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
                <span className="text-lg">Available for Virtual Sessions</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-emerald-700 to-emerald-800 text-white py-8 px-6">
        <div className="container mx-auto text-center">
          <div className="flex justify-center mb-4">
            <img
              src="/logo.jpeg"
              alt="David Fales Coaching Logo"
              className="h-12 w-auto"
            />
          </div>
          <p className="text-emerald-100 mb-2">
            © 2025 David Fales Private Coaching. All rights reserved.
          </p>
          <p className="text-emerald-200 text-sm">
            Empowering individuals to achieve extraordinary results.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
