"use client";


import Link from "next/link";

import { useState, useEffect, useRef } from "react";

export default function HomePage() {
 const [dark, setDark] = useState(true);

useEffect(() => {
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "light") {
    setDark(false);
  } else {
    setDark(true);
  }
}, []);

useEffect(() => {
  localStorage.setItem("theme", dark ? "dark" : "light");
}, [dark]);;

  const theme = {
    bg: dark ? "bg-[#0a0a0a]" : "bg-[#fafaf8]",
    text: dark ? "text-white" : "text-zinc-900",
    subtext: dark ? "text-zinc-400" : "text-zinc-500",
    border: dark ? "border-zinc-800" : "border-zinc-200",
    card: dark ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200",
    nav: dark ? "bg-[#0f0f0f] border-zinc-800" : "bg-white border-zinc-200",
    badge: dark ? "bg-zinc-900 border-zinc-700 text-zinc-400" : "bg-zinc-100 border-zinc-200 text-zinc-500",
    stat: dark ? "bg-zinc-950 border-zinc-800" : "bg-zinc-50 border-zinc-200",
    cta: dark ? "bg-zinc-900 border-zinc-800" : "bg-zinc-50 border-zinc-200",
    toggle: dark ? "bg-zinc-800 text-zinc-300" : "bg-zinc-100 text-zinc-600",
  };

  const jobs = [
    "House Cleaning", "Office Cleaning", "Cooking & Chef Services",
    "Security Guard", "Driver & Chauffeur", "Nanny & Childcare",
    "Gardening & Landscaping", "Laundry & Ironing", "Elderly Care",
    "Shop Attendant", "Factory Worker", "Farm Labour",
    "Event Catering Staff", "Dispatch Rider", "General Housekeeper",
    "Plumbing Assistant", "Electrical Assistant", "Construction Labour",
    "Painting & Décor", "Warehouse Assistant",
  ];

  const statsRef = useRef<HTMLDivElement | null>(null);
const [startCount, setStartCount] = useState(false);

useEffect(() => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        setStartCount(true);
      }
    },
    { threshold: 0.3 }
  );

  if (statsRef.current) {
    observer.observe(statsRef.current);
  }

  return () => {
    if (statsRef.current) {
      observer.unobserve(statsRef.current);
    }
  };
}, []);

const Counter = ({ target }: { target: number }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!startCount) return;

    let start = 0;

    const interval = setInterval(() => {
      start += Math.ceil(target / 40);

      if (start >= target) {
        start = target;
        clearInterval(interval);
      }

      setCount(start);
    }, 40);

    return () => clearInterval(interval);
  }, [target]);

  return <>{count}</>;
};

  return (

    <div className={`min-h-screen ${theme.bg} ${theme.text} transition-colors duration-300`}>

      {/* NAVBAR */}
      <nav className={`sticky top-0 z-50 border-b ${theme.nav} ${theme.border} transition-colors duration-300 backdrop-blur-lg`}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">

          {/* LOGO AREA */}
          <div className="flex items-center gap-3">

            {/* REPLACE THIS WITH YOUR LOGO */}
            <div className="w-12 h-12 rounded-2xl overflow-hidden bg-zinc-800 animate-pulse">
              <img src="/logo godbless.jpeg" alt="logo" className="w-full h-full object-cover" />
            </div>

            <div>
              {/* REPLACE THIS WITH YOUR BRAND NAME IMAGE IF YOU WANT */}
              <h1 className="font-bold text-base leading-tight">
                GodblessAgency
              </h1>

              <p className={`text-xs ${theme.subtext}`}>
                Asaba, Delta State
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setDark(!dark)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium ${theme.toggle} transition-all duration-300 hover:scale-105`}
            >
              {dark ? (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 7a5 5 0 100 10A5 5 0 0012 7z" />
                  </svg>
                  Light
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                  </svg>
                  Dark
                </>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <div className="max-w-6xl mx-auto px-6 pt-20 pb-16 text-center animate-fadeIn">
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${theme.badge} text-xs mb-6 animate-bounce`}>
          ✦ Asaba's Most Trusted Work Agency
        </div>

        <h1 className="text-4xl md:text-6xl font-bold leading-tight">
          Your Trusted Bridge Between <br />
          <span className="text-amber-400">
            Talent and Employers
          </span>
        </h1>

        <p className={`${theme.subtext} mt-6 max-w-2xl mx-auto text-sm md:text-base leading-relaxed`}>
          GodblessAgency connects hardworking individuals to verified employers across Asaba and Delta State.
          Whether you need a worker or you are looking for work — we are your reliable partner.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/register"
            className="bg-amber-400 text-black px-8 py-3.5 rounded-xl font-bold hover:bg-amber-300 hover:scale-105 transition-all duration-300 text-sm shadow-lg"
          >
            Register as a Worker
          </Link>

       <a
  href="https://wa.me/2347060607436"
  target="_blank"
  rel="noopener noreferrer"
  className={`border ${theme.border} px-8 py-3.5 rounded-xl font-semibold hover:border-amber-400 hover:text-amber-400 hover:scale-105 transition-all duration-300 text-sm`}
>
  Hire a Worker
</a>
        </div>
      </div>

      {/* STATS */}
      <div className={`border-y ${theme.border} ${theme.stat} transition-colors duration-300`}>
   
<div
  ref={statsRef}
  className={`border-y ${theme.border} ${theme.stat} transition-colors duration-300`}
>
  <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">

    {[
      { value: 50, suffix: "+", label: "Workers Placed" },
      { value: 45, suffix: "+", label: "Partner Employers" },
      { value: 20, suffix: "+", label: "Job Categories" },
      { value: 24, suffix: "/7", label: "Support Available" },
    ].map((s) => (
      <div
        key={s.label}
        className="hover:-translate-y-1 transition-transform duration-300"
      >
        <h3 className="text-3xl font-bold text-amber-400">
          <Counter target={s.value} />
          {s.suffix}
        </h3>

        <p className={`${theme.subtext} text-sm mt-1`}>
          {s.label}
        </p>
      </div>
    ))}

  </div>
</div>
</div>

    {/* HOW IT WORKS */}
<div id="how" className="max-w-6xl mx-auto px-6 py-20">
  <div className="text-center mb-12">
    <p className="text-amber-400 text-xs font-semibold uppercase tracking-widest mb-2">
      The Process
    </p>

    <h2 className="text-2xl md:text-4xl font-bold">
      How It Works
    </h2>

    <p className={`${theme.subtext} mt-3 text-sm max-w-xl mx-auto`}>
      Our process is simple, transparent, and focused on helping serious workers secure real job opportunities.
    </p>
  </div>

  <div className="grid md:grid-cols-3 gap-6">

    {[
      {
        step: "01",
        title: "Pay Registration Fee",
        desc: "A small non-refundable form fee is required to begin your registration process. This helps us verify serious applicants and process your profile faster.",
      },

      {
        step: "02",
        title: "Complete Registration",
        desc: "Fill your form with your correct details, preferred work category, passport photograph, and contact information for verification and placement.",
      },

      {
        step: "03",
        title: "Get Employed",
        desc: "Once successfully employed, only 20% of your first salary goes to the agent as service commission. After that, every other salary belongs completely to you.",
      },

    ].map((item) => (
      <div
        key={item.step}
        className={`p-6 rounded-2xl border ${theme.card} transition-all duration-300 hover:-translate-y-2 hover:border-amber-400`}
      >
        <div className="text-amber-400 text-3xl font-black animate-pulse">
          {item.step}
        </div>

        <h3 className="font-bold mt-3 text-lg">
          {item.title}
        </h3>

        <p className={`text-sm ${theme.subtext} mt-2 leading-relaxed`}>
          {item.desc}
        </p>
      </div>
    ))}
  </div>

 
 
</div>

      {/* JOBS */}
      <div className={`border-y ${theme.border} py-20 transition-colors duration-300`}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-amber-400 text-xs font-semibold uppercase tracking-widest mb-2">
              What We Cover
            </p>

            <h2 className="text-2xl md:text-4xl font-bold">
              Jobs We Place
            </h2>

            <p className={`${theme.subtext} mt-3 text-sm max-w-xl mx-auto`}>
              We cover a wide range of job categories for both skilled and unskilled workers.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 justify-center">
            {jobs.map((job) => (
              <span
                key={job}
                className={`px-4 py-2 rounded-full border text-sm font-medium ${theme.badge} transition-all duration-300 hover:scale-105 hover:border-amber-400`}
              >
                {job}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* WHY CHOOSE US */}
      <div className={`border-y ${theme.border} py-20 ${theme.stat} transition-colors duration-300`}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-amber-400 text-xs font-semibold uppercase tracking-widest mb-2">
              Why Us
            </p>

            <h2 className="text-2xl md:text-4xl font-bold">
              Why Choose GodblessAgency
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {[
              "Years of experience placing workers in Delta State",
              "Wide network of verified and trusted employers",
              "We handle both skilled and unskilled placements",
              "Personal support throughout your placement process",
              "Fast turnaround — most placements done within days",
              "Transparent process with no hidden charges",
            ].map((point) => (
              <div
                key={point}
                className={`flex items-start gap-3 p-4 rounded-xl border ${theme.card} transition-all duration-300 hover:border-amber-400 hover:-translate-y-1`}
              >
                <div className="w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg
                    className="w-3 h-3 text-black"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>

                <p className={`text-sm ${theme.subtext}`}>
                  {point}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className={`${theme.bg} border-t ${theme.border} py-10 transition-colors duration-300`}>
        <div className="max-w-6xl mx-auto px-6 flex flex-col items-center justify-center text-center gap-4">

          {/* FOOTER LOGO PLACEHOLDER */}
          <div className="w-14 h-14 rounded-2xl overflow-hidden bg-zinc-800 animate-pulse">
            <img src="/logo godbless.jpeg" alt="logo" className="w-full h-full object-cover" />
          </div>

          <h3 className="font-bold text-lg">
            GodblessAgency
          </h3>

          <p className={`text-xs ${theme.subtext} max-w-md leading-relaxed`}>
            Connecting hardworking people with trusted employers across Asaba and Delta State.
          </p>

          <p className={`text-xs ${theme.subtext}`}>
            © {new Date().getFullYear()} GodblessAgency, Asaba, Delta State. All rights reserved.
          </p>

        </div>
      </div>

    </div>
  );
}