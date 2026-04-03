import './globals.css';

export const metadata = {
  title: 'UrbanEye',
  description: 'Report potholes, earn rewards, fix your city',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-white">
        <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <a href="/" className="text-xl font-bold text-indigo-400 tracking-tight">
              UrbanEye
            </a>
            <div className="flex items-center gap-6 text-sm font-medium">
              <a href="/map" className="text-slate-300 hover:text-white transition">Map</a>
              <a href="/report" className="text-slate-300 hover:text-white transition">Report</a>
              <a href="/leaderboard" className="text-slate-300 hover:text-white transition">Leaderboard</a>
              <a href="/dashboard" className="text-slate-300 hover:text-white transition">Dashboard</a>
              <a href="/auth" className="bg-indigo-600 hover:bg-indigo-500 px-4 py-1.5 rounded-lg transition">
                Login
              </a>
            </div>
          </div>
        </nav>
        <main className="pt-16">
          {children}
        </main>
      </body>
    </html>
  );
}