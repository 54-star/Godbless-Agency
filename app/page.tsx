"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">

      {/* HERO */}
      <div className="max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-800 bg-zinc-900 text-xs text-zinc-400 mb-6">
          Trusted Work Agency • Fast Placement • Verified Workers
        </div>

        <h1 className="text-4xl md:text-6xl font-bold leading-tight">
          Find Work. Get Placed. <br />
          <span className="text-amber-400">Start Earning Fast.</span>
        </h1>

        <p className="text-zinc-400 mt-6 max-w-xl mx-auto text-sm md:text-base">
          We connect skilled and unskilled workers to real job opportunities
          across cleaning, security, cooking, driving, and general labor jobs.
        </p>

        <div className="mt-10 flex items-center justify-center gap-4">
          <Link
            href="/register"
            className="bg-amber-400 text-black px-6 py-3 rounded-xl font-semibold hover:bg-amber-300 transition"
          >
            Apply Now
          </Link>

          <Link
            href="#how"
            className="border border-zinc-700 px-6 py-3 rounded-xl text-zinc-300 hover:border-amber-400 hover:text-amber-400 transition"
          >
            How It Works
          </Link>
        </div>
      </div>

      {/* STATS */}
      <div className="border-y border-zinc-800 bg-zinc-950">
        <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">

          <div>
            <h3 className="text-3xl font-bold text-amber-400">1,000+</h3>
            <p className="text-zinc-400 text-sm mt-1">Workers Placed</p>
          </div>

          <div>
            <h3 className="text-3xl font-bold text-amber-400">200+</h3>
            <p className="text-zinc-400 text-sm mt-1">Partner Employers</p>
          </div>

          <div>
            <h3 className="text-3xl font-bold text-amber-400">24/7</h3>
            <p className="text-zinc-400 text-sm mt-1">Support Available</p>
          </div>

        </div>
      </div>

      {/* HOW IT WORKS */}
      <div id="how" className="max-w-5xl mx-auto px-6 py-20">

        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
          How It Works
        </h2>

        <div className="grid md:grid-cols-3 gap-6">

          <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900">
            <div className="text-amber-400 text-xl font-bold">01</div>
            <h3 className="font-semibold mt-3">Apply Online</h3>
            <p className="text-sm text-zinc-400 mt-2">
              Fill the registration form with your details and skills.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900">
            <div className="text-amber-400 text-xl font-bold">02</div>
            <h3 className="font-semibold mt-3">Verification</h3>
            <p className="text-sm text-zinc-400 mt-2">
              Our team reviews your application and confirms your profile.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900">
            <div className="text-amber-400 text-xl font-bold">03</div>
            <h3 className="font-semibold mt-3">Get Placed</h3>
            <p className="text-sm text-zinc-400 mt-2">
              We match you with available job opportunities quickly.
            </p>
          </div>

        </div>

      </div>

      {/* CTA */}
      <div className="bg-amber-400 text-black py-16 text-center">

        <h2 className="text-3xl font-bold">
          Ready to Start Working?
        </h2>

        <p className="mt-3 text-sm">
          Join hundreds of workers getting placed every month.
        </p>

        <Link
          href="/register"
          className="inline-block mt-6 bg-black text-white px-6 py-3 rounded-xl font-semibold"
        >
          Apply Now
        </Link>

      </div>

      {/* FOOTER */}
      <div className="py-10 text-center text-xs text-zinc-500">
        © {new Date().getFullYear()} GodblessAgency. All rights reserved.
      </div>

    </div>
  );
}