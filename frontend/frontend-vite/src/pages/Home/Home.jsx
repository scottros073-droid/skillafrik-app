// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="bg-white dark:bg-gray-950 text-gray-900 dark:text-white overflow-x-hidden">

      <Navbar />
      <Hero />
      <TrustedUSA />
      <FeaturedJobs />
      <FreelancerGrid />
      <Stats />
      <EscrowTracker />
      <AIUsageBilling />
      <Testimonials />
      <CommunitySafety />
      <FinalCTA />
      <Footer />

    </div>
  );
}

/* ================= NAVBAR ================= */

function Navbar() {
  return (
    <nav className="fixed w-full top-0 z-50 backdrop-blur-lg bg-white/70 dark:bg-gray-900/70 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/">
          <img src="http://localhost:5000/public/logo.png" alt="SkillAfrik Logo" className="w-10 h-10 rounded-xl" />
        </Link>

        <div className="flex gap-6 items-center">
          <Link to="/login" className="hover:text-blue-600 font-medium">
            Login
          </Link>
          <Link
            to="/signup"
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow-lg hover:scale-105 transition"
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}

/* ================= HERO ================= */

function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center text-center px-6 pt-20">

      <div className="absolute inset-0">
        <img
          src="/hero.jpg"
          alt="Hero"
          className="w-full h-full object-cover"
          onError={(e) => (e.target.style.display = "none")}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/70 to-purple-900/70"></div>
      </div>

      <div className="relative z-10 max-w-4xl text-white">
        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
          Africa’s Smartest Freelance Platform
          <span className="block bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            AI Powered. Escrow Secured.
          </span>
        </h1>

        <div className="mt-10 flex flex-col sm:flex-row gap-6 justify-center">
          <Link
            to="/signup"
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-lg shadow-2xl hover:scale-105 transition"
          >
            Join Free
          </Link>

          <Link
            to="/login"
            className="px-8 py-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold text-lg hover:bg-white/20 transition"
          >
            Login
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ================= TRUSTED USA ================= */

function TrustedUSA() {
  return (
    <section className="py-20 text-center bg-white dark:bg-gray-900">
      <h2 className="text-4xl font-bold mb-12">
        Trusted by USA Companies 🇺🇸
      </h2>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto px-6">
        <Company name="New York SaaS Startup" rating="4.9" />
        <Company name="California AI Agency" rating="5.0" />
        <Company name="Texas Ecommerce Brand" rating="4.8" />
      </div>
    </section>
  );
}

/* ================= FEATURED JOBS ================= */

function FeaturedJobs() {
  return (
    <section className="py-24 bg-gray-50 dark:bg-gray-900 text-center px-6">
      <h2 className="text-4xl font-bold mb-12">
        Featured Jobs
      </h2>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <Job title="Build React Website" budget="$800" rating="4.9" />
        <Job title="Design Mobile App UI" budget="$600" rating="5.0" />
        <Job title="Full Stack SaaS Build" budget="$2500" rating="4.8" />
      </div>
    </section>
  );
}

/* ================= FREELANCERS ================= */

function FreelancerGrid() {
  const freelancers = [
    { name: "Amina", skill: "UI/UX Designer" },
    { name: "David", skill: "Full Stack Dev" },
    { name: "Grace", skill: "Mobile Engineer" },
    { name: "Samuel", skill: "Video Editor" }
  ];

  return (
    <section className="py-24 bg-white dark:bg-gray-950 text-center px-6">
      <h2 className="text-4xl font-bold mb-12">Top African Talent</h2>

      <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
        {freelancers.map((f, i) => (
          <div key={i} className="p-6 bg-gray-100 dark:bg-gray-800 rounded-2xl shadow-lg hover:scale-105 transition">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white font-bold">
              {f.name[0]}
            </div>
            <h3 className="font-bold">{f.name}</h3>
            <p className="text-sm text-gray-500">{f.skill}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ================= STATS COUNTER ================= */

function Stats() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let interval = setInterval(() => {
      setCount((prev) => (prev < 100 ? prev + 1 : 100));
    }, 20);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-20 text-center bg-gray-50 dark:bg-gray-900">
      <h2 className="text-4xl font-bold mb-12">Platform Growth</h2>
      <div className="text-5xl font-bold text-blue-600">
        {count}%
      </div>
      <p className="mt-4 text-gray-600 dark:text-gray-300">
        Client Satisfaction Rate
      </p>
    </section>
  );
}

/* ================= ESCROW TRACKER ================= */

function EscrowTracker() {
  return (
    <section className="py-24 text-center bg-white dark:bg-gray-950 px-6">
      <h2 className="text-4xl font-bold mb-8">Escrow Payment Flow</h2>

      <div className="max-w-3xl mx-auto bg-gray-100 dark:bg-gray-800 rounded-3xl p-8 shadow-lg">
        <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-4">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-4 rounded-full w-3/4"></div>
        </div>

        <div className="flex justify-between mt-4 text-sm">
          <span>Funded</span>
          <span>In Progress</span>
          <span>Released</span>
        </div>
      </div>
    </section>
  );
}

/* ================= AI BILLING ================= */

function AIUsageBilling() {
  return (
    <section className="py-24 text-center bg-gray-50 dark:bg-gray-900 px-6">
      <h2 className="text-4xl font-bold mb-6">AI Usage Billing</h2>
      <p className="max-w-3xl mx-auto text-gray-600 dark:text-gray-300">
        Track your AI credits usage transparently. Pay only for what you use.
      </p>
    </section>
  );
}

/* ================= TESTIMONIALS ================= */

function Testimonials() {
  const reviews = [
    "Secure escrow makes hiring stress-free.",
    "The AI tools help us move faster.",
    "Best freelance platform for African talent."
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % reviews.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-24 text-center bg-white dark:bg-gray-900 px-6">
      <h2 className="text-4xl font-bold mb-12">Client Reviews</h2>
      <div className="max-w-3xl mx-auto p-10 bg-gray-100 dark:bg-gray-800 rounded-3xl shadow-lg">
        <p className="text-xl italic">"{reviews[index]}"</p>
      </div>
    </section>
  );
}

/* ================= COMMUNITY ================= */

function CommunitySafety() {
  return (
    <section className="py-24 text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6">
      <h2 className="text-4xl font-bold mb-6">Protected Community</h2>
      <p>No sharing contacts. No WhatsApp deals. All payments via escrow.</p>
    </section>
  );
}

/* ================= CTA ================= */

function FinalCTA() {
  return (
    <section className="py-24 text-center bg-white dark:bg-gray-950 px-6">
      <h2 className="text-4xl font-bold">Join SkillAfrik Today</h2>

      <Link
        to="/signup"
        className="inline-block mt-8 px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-2xl shadow-xl hover:scale-105 transition"
      >
        Create Free Account
      </Link>
    </section>
  );
}

/* ================= FOOTER ================= */

function Footer() {
  return (
    <footer className="py-10 text-center bg-gray-900 text-gray-400">
      <img src="http://localhost:5000/public/logo.png" alt="SkillAfrik Logo" className="w-10 h-10 mx-auto mb-4 rounded-xl" />
      <p>© {new Date().getFullYear()} SkillAfrik. All rights reserved.</p>
    </footer>
  );
}

/* ================= SMALL COMPONENTS ================= */

function Company({ name, rating }) {
  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-800 rounded-2xl shadow-lg">
      <h3 className="font-bold mb-2">{name}</h3>
      <p className="text-yellow-500">⭐ {rating}</p>
    </div>
  );
}

function Job({ title, budget, rating }) {
  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:scale-105 transition">
      <h3 className="font-bold mb-2">{title}</h3>
      <p className="text-blue-600 font-semibold">{budget}</p>
      <p className="text-yellow-500">⭐ {rating}</p>
    </div>
  );
}