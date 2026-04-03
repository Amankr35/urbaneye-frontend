'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const severityColors = {
  minor: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
  moderate: 'text-orange-400 bg-orange-400/10 border-orange-400/30',
  severe: 'text-red-400 bg-red-400/10 border-red-400/30',
};

const severityPoints = { minor: 30, moderate: 60, severe: 100 };

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState(false);
  const [redeemMsg, setRedeemMsg] = useState('');

  useEffect(() => {
    async function loadDashboard() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/auth');
        return;
      }
      const u = session.user;
      setUser(u);
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', u.id)
        .single();
      setProfile(profileData);
      const { data: reportsData } = await supabase
        .from('reports')
        .select('*')
        .eq('user_id', u.id)
        .order('created_at', { ascending: false });
      setReports(reportsData || []);
      setLoading(false);
    }
    loadDashboard();
  }, []);

  async function handleRedeem(rewardType) {
    if (!profile || profile.total_points < 500) {
      setRedeemMsg('You need at least 500 points to redeem');
      return;
    }
    setRedeeming(true);
    setRedeemMsg('');
    const { error } = await supabase.from('redemptions').insert({
      user_id: user.id,
      points_spent: 500,
      reward_type: rewardType,
      status: 'pending',
    });
    if (error) {
      setRedeemMsg('Redemption failed');
      setRedeeming(false);
      return;
    }
    await supabase
      .from('profiles')
      .update({ total_points: profile.total_points - 500 })
      .eq('id', user.id);
    setProfile(prev => ({ ...prev, total_points: prev.total_points - 500 }));
    setRedeemMsg('Redemption submitted! We will contact you within 48 hours.');
    setRedeeming(false);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push('/auth');
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <p className="text-slate-400">Loading dashboard...</p>
      </div>
    );
  }

  const totalReports = reports.length;
  const severeCount = reports.filter(r => r.severity === 'severe').length;
  const progressToRedeem = Math.min((profile?.total_points || 0) / 500 * 100, 100);
  const pointsLeft = Math.max(500 - (profile?.total_points || 0), 0);

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10">
      <div className="max-w-4xl mx-auto">

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-slate-400 text-sm mt-1">
              {profile?.full_name || user?.email}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm text-slate-400 hover:text-white border border-slate-700 hover:border-slate-500 px-4 py-2 rounded-xl transition"
          >
            Log out
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total points', value: profile?.total_points ?? 0, highlight: true },
            { label: 'Reports submitted', value: totalReports },
            { label: 'Severe reports', value: severeCount },
            { label: 'Points needed', value: pointsLeft + ' left' },
          ].map((stat) => (
            <div
              key={stat.label}
              className={`rounded-2xl p-5 border ${stat.highlight
                ? 'bg-indigo-600/10 border-indigo-500/30'
                : 'bg-slate-900 border-slate-800'}`}
            >
              <p className="text-xs text-slate-400 mb-1">{stat.label}</p>
              <p className={`text-2xl font-bold ${stat.highlight ? 'text-indigo-400' : 'text-white'}`}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 mb-8">
          <div className="flex justify-between items-center mb-3">
            <p className="text-sm font-medium">Progress to next redemption</p>
            <p className="text-sm text-slate-400">{profile?.total_points ?? 0} / 500 points</p>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-3">
            <div
              className="bg-indigo-500 h-3 rounded-full transition-all duration-500"
              style={{ width: progressToRedeem + '%' }}
            />
          </div>
          <p className="text-xs text-slate-500 mt-2">500 points = ₹50 cash or gift card</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 mb-8">
          <h2 className="text-lg font-semibold mb-1">Redeem rewards</h2>
          <p className="text-slate-400 text-sm mb-4">
            You have{' '}
            <span className="text-indigo-400 font-semibold">{profile?.total_points ?? 0} points</span>.
            {' '}Minimum 500 points required.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleRedeem('cash')}
              disabled={redeeming || (profile?.total_points ?? 0) < 500}
              className="py-3 rounded-xl border border-green-500/30 bg-green-500/10 text-green-400 hover:bg-green-500/20 disabled:opacity-40 disabled:cursor-not-allowed font-medium text-sm transition"
            >
              UPI Cash (Rs.50)
            </button>
            <button
              onClick={() => handleRedeem('giftcard')}
              disabled={redeeming || (profile?.total_points ?? 0) < 500}
              className="py-3 rounded-xl border border-purple-500/30 bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 disabled:opacity-40 disabled:cursor-not-allowed font-medium text-sm transition"
            >
              Gift Card (Rs.50)
            </button>
          </div>
          {redeemMsg && (
            <p className={`mt-3 text-sm text-center ${redeemMsg.includes('failed') ? 'text-red-400' : 'text-green-400'}`}>
              {redeemMsg}
            </p>
          )}
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <h2 className="text-lg font-semibold mb-4">Your reports</h2>
          {reports.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-4xl mb-3">🚧</p>
              <p className="text-slate-400 text-sm mb-4">No reports yet.</p>
              <Link
                href="/report"
                className="inline-block bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-5 py-2 rounded-xl transition"
              >
                Submit your first report
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {reports.map((r) => (
                <div
                  key={r.id}
                  className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-xl border border-slate-700"
                >
                  {r.image_url && (
                    <img
                      src={r.image_url}
                      alt="pothole"
                      className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full border capitalize font-medium ${severityColors[r.severity] || 'text-slate-400 bg-slate-700 border-slate-600'}`}>
                        {r.severity || 'unknown'}
                      </span>
                      <span className="text-xs text-slate-500">
                        {r.confidence}% confidence
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      {new Date(r.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-indigo-400 font-bold">+{severityPoints[r.severity] || 10}</p>
                    <p className="text-xs text-slate-500">points</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}