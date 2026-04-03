import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950">

      <section className="relative flex flex-col items-center justify-center min-h-[90vh] text-center px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/40 to-slate-950 pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto">
          <span className="inline-block bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 tracking-wide uppercase">
            Civic Tech for India
          </span>

          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
            Report potholes.
            <br />
            <span className="text-indigo-400">Earn rewards.</span>
            <br />
            Fix your city.
          </h1>

          <p className="text-slate-400 text-lg md:text-xl max-w-xl mx-auto mb-10">
            Upload a photo, get your location verified by AI, earn points and redeem them for real cash or gift cards.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/report"
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-8 py-3 rounded-xl transition text-lg">
              Report a Pothole
            </Link>
            <Link href="/map"
              className="bg-slate-800 hover:bg-slate-700 text-white font-semibold px-8 py-3 rounded-xl transition text-lg">
              View Live Map
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center mb-12 text-slate-100">How it works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { step: '01', title: 'Take a photo', desc: 'Photograph any pothole on a public road. Our AI verifies it instantly.' },
            { step: '02', title: 'Earn points', desc: 'Verified reports earn you points. Severe potholes earn more.' },
            { step: '03', title: 'Get rewarded', desc: 'Redeem your points for UPI cash transfers or popular gift cards.' },
          ].map((item) => (
            <div key={item.step} className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <span className="text-indigo-500 font-bold text-sm">{item.step}</span>
              <h3 className="text-xl font-semibold mt-2 mb-3">{item.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-10 pb-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: '10,000+', label: 'Reports submitted' },
            { value: '₹2.4L+', label: 'Rewards paid out' },
            { value: '48 hrs', label: 'Avg. municipal response' },
            { value: '94%', label: 'AI accuracy rate' },
          ].map((stat) => (
            <div key={stat.label} className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <p className="text-3xl font-bold text-indigo-400">{stat.value}</p>
              <p className="text-slate-400 text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}