'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

function useCountUp(target, duration = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let start = 0;
          const step = target / (duration / 16);
          const timer = setInterval(() => {
            start += step;
            if (start >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.floor(start));
            }
          }, 16);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return { count, ref };
}

function StatCard({ value, numericValue, label }) {
  const { count, ref } = useCountUp(numericValue || 0);
  return (
    <div ref={ref} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center">
      <p className="text-3xl font-bold text-indigo-400">
        {numericValue ? count.toLocaleString() + (value.includes('+') ? '+' : '') : value}
      </p>
      <p className="text-slate-400 text-sm mt-1">{label}</p>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">

      <section className="relative flex flex-col items-center justify-center min-h-[92vh] text-center px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/50 to-slate-950 pointer-events-none" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto">
          <span className="inline-block bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 tracking-widest uppercase">
            Civic Tech for India
          </span>

          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6 tracking-tight">
            Report potholes.
            <br />
            <span className="text-indigo-400">Earn rewards.</span>
            <br />
            Fix your city.
          </h1>

          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Upload a photo, get it verified by AI in seconds, earn points and
            redeem them for real cash or gift cards — while helping fix India's roads.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              href="/report"
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-8 py-4 rounded-xl transition text-lg"
            >
              Report a Pothole
            </Link>
            <Link
              href="/map"
              className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold px-8 py-4 rounded-xl transition text-lg"
            >
              View Live Map
            </Link>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-400">
            {['AI-verified reports', 'Real cash rewards', 'Direct to municipalities', 'Free to use'].map(f => (
              <div key={f} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 inline-block" />
                {f}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-24">
        <div className="text-center mb-14">
          <h2 className="text-4xl font-bold mb-4">How it works</h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Three simple steps to turn road problems into personal rewards
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              step: '01',
              title: 'Take a photo',
              desc: 'Photograph any pothole on a public road and submit your location. Takes under 30 seconds.',
              icon: '📸',
            },
            {
              step: '02',
              title: 'AI verifies it',
              desc: 'Our AI instantly checks if it is a real pothole and rates its severity — minor, moderate, or severe.',
              icon: '🤖',
            },
            {
              step: '03',
              title: 'Get rewarded',
              desc: 'Earn 30–100 points per report. Redeem for UPI cash or gift cards once you hit 500 points.',
              icon: '💸',
            },
          ].map((item, i) => (
            <div
              key={item.step}
              className="relative bg-slate-900 border border-slate-800 rounded-2xl p-7 hover:border-indigo-500/40 transition"
            >
              <div className="text-3xl mb-4">{item.icon}</div>
              <span className="text-indigo-500 font-bold text-xs tracking-widest uppercase">{item.step}</span>
              <h3 className="text-xl font-semibold mt-2 mb-3">{item.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
              {i < 2 && (
                <div className="hidden md:block absolute top-1/2 -right-4 text-slate-600 text-2xl z-10">
                  →
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          <StatCard value="10,000+" numericValue={10000} label="Reports submitted" />
          <StatCard value="₹2.4L+" label="Rewards paid out" />
          <StatCard value="48 hrs" label="Avg. municipal response" />
          <StatCard value="94%" numericValue={94} label="AI accuracy rate" />
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold mb-4">Points breakdown</h2>
          <p className="text-slate-400">More severe potholes earn you more points</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              severity: 'Minor',
              points: 30,
              color: 'border-yellow-500/30 bg-yellow-500/5',
              badge: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
              desc: 'Surface cracks, small depressions',
            },
            {
              severity: 'Moderate',
              points: 60,
              color: 'border-orange-500/30 bg-orange-500/5',
              badge: 'text-orange-400 bg-orange-400/10 border-orange-400/30',
              desc: 'Visible hole, affects one lane',
            },
            {
              severity: 'Severe',
              points: 100,
              color: 'border-red-500/30 bg-red-500/5',
              badge: 'text-red-400 bg-red-400/10 border-red-400/30',
              desc: 'Large hole, safety hazard',
            },
          ].map((item) => (
            <div key={item.severity} className={`rounded-2xl border p-6 text-center ${item.color}`}>
              <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${item.badge}`}>
                {item.severity}
              </span>
              <p className="text-4xl font-bold mt-4 mb-1">+{item.points}</p>
              <p className="text-slate-400 text-xs">points per report</p>
              <p className="text-slate-500 text-xs mt-3">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-16">
        <div className="relative bg-indigo-600/10 border border-indigo-500/20 rounded-3xl p-12 text-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 to-transparent pointer-events-none" />
          <div className="relative z-10">
            <h2 className="text-4xl font-bold mb-4">Ready to make a difference?</h2>
            <p className="text-slate-400 mb-8 max-w-lg mx-auto">
              Join thousands of citizens already reporting potholes and earning rewards across India.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth"
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-8 py-4 rounded-xl transition"
              >
                Create free account
              </Link>
              <Link
                href="/leaderboard"
                className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold px-8 py-4 rounded-xl transition"
              >
                View leaderboard
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="text-center pb-10 text-slate-500 text-sm">
        Made with <span className="text-red-400">♥</span> by Aman
      </div>

    </div>
  );
}