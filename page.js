'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center min-h-[92vh] text-center px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/50 to-slate-950 pointer-events-none" />

        <div className="relative z-10 w-full max-w-3xl mx-auto">
          <span className="inline-block bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 tracking-widest uppercase">
            Civic Tech for India
          </span>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold leading-tight mb-6 tracking-tight">
            Report potholes.
            <br />
            <span className="text-indigo-400">Earn rewards.</span>
            <br />
            Fix your city.
          </h1>

          <p className="text-slate-400 text-base sm:text-lg md:text-xl max-w-xl mx-auto mb-8 leading-relaxed px-2">
            Upload a photo, get it verified by AI in seconds, earn points and
            redeem them for real cash or gift cards.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center px-4 sm:px-0">
            <Link
              href="/report"
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-8 py-3.5 rounded-xl transition text-base sm:text-lg w-full sm:w-auto"
            >
              Report a Pothole
            </Link>
            <Link
              href="/map"
              className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold px-8 py-3.5 rounded-xl transition text-base sm:text-lg w-full sm:w-auto"
            >
              View Live Map
            </Link>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mt-10 text-xs sm:text-sm text-slate-400 px-4">
            {['AI-verified reports', 'Real cash rewards', 'Direct to municipalities', 'Free to use'].map(f => (
              <div key={f} className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 inline-block flex-shrink-0" />
                {f}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <div className="text-center mb-10 sm:mb-14">
          <h2 className="text-2xl sm:text-4xl font-bold mb-3">How it works</h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
            Three simple steps to turn road problems into personal rewards
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {[
            { step: '01', title: 'Take a photo', desc: 'Photograph any pothole on a public road. Takes under 30 seconds.', icon: '📸' },
            { step: '02', title: 'AI verifies it', desc: 'Our AI checks if it is a real pothole and rates its severity instantly.', icon: '🤖' },
            { step: '03', title: 'Get rewarded', desc: 'Earn 30–100 points per report. Redeem for UPI cash or gift cards.', icon: '💸' },
          ].map((item) => (
            <div key={item.step} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-7">
              <div className="text-2xl sm:text-3xl mb-3">{item.icon}</div>
              <span className="text-indigo-500 font-bold text-xs tracking-widest uppercase">{item.step}</span>
              <h3 className="text-lg sm:text-xl font-semibold mt-2 mb-2">{item.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-5 text-center">
          {[
            { value: '10,000+', label: 'Reports submitted' },
            { value: '₹2.4L+', label: 'Rewards paid out' },
            { value: '48 hrs', label: 'Avg. municipal response' },
            { value: '94%', label: 'AI accuracy rate' },
          ].map((stat) => (
            <div key={stat.label} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6">
              <p className="text-xl sm:text-3xl font-bold text-indigo-400">{stat.value}</p>
              <p className="text-slate-400 text-xs sm:text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Points breakdown */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="text-2xl sm:text-4xl font-bold mb-3">Points breakdown</h2>
          <p className="text-slate-400 text-sm sm:text-base">More severe potholes earn you more points</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
          {[
            { severity: 'Minor', points: 30, color: 'border-yellow-500/30 bg-yellow-500/5', badge: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30', desc: 'Surface cracks, small depressions' },
            { severity: 'Moderate', points: 60, color: 'border-orange-500/30 bg-orange-500/5', badge: 'text-orange-400 bg-orange-400/10 border-orange-400/30', desc: 'Visible hole, affects one lane' },
            { severity: 'Severe', points: 100, color: 'border-red-500/30 bg-red-500/5', badge: 'text-red-400 bg-red-400/10 border-red-400/30', desc: 'Large hole, safety hazard' },
          ].map((item) => (
            <div key={item.severity} className={`rounded-2xl border p-5 sm:p-6 text-center ${item.color}`}>
              <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${item.badge}`}>
                {item.severity}
              </span>
              <p className="text-3xl sm:text-4xl font-bold mt-4 mb-1">+{item.points}</p>
              <p className="text-slate-400 text-xs">points per report</p>
              <p className="text-slate-500 text-xs mt-2">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-16 sm:pb-24">
        <div className="relative bg-indigo-600/10 border border-indigo-500/20 rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 to-transparent pointer-events-none" />
          <div className="relative z-10">
            <h2 className="text-2xl sm:text-4xl font-bold mb-3 sm:mb-4">Ready to make a difference?</h2>
            <p className="text-slate-400 text-sm sm:text-base mb-6 sm:mb-8 max-w-lg mx-auto">
              Join thousands of citizens already reporting potholes and earning rewards across India.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/auth"
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-8 py-3.5 rounded-xl transition w-full sm:w-auto"
              >
                Create free account
              </Link>
              <Link
                href="/leaderboard"
                className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold px-8 py-3.5 rounded-xl transition w-full sm:w-auto"
              >
                View leaderboard
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <div className="text-center pb-8 text-slate-500 text-sm">
        Made with <span className="text-red-400">♥</span> by Aman
      </div>

    </div>
  );
}