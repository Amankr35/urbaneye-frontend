'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function Leaderboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchUsers() {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, total_points')
      .order('total_points', { ascending: false });

    if (error) {
      console.error('Fetch error:', error);
      return;
    }

    setUsers(data || []);
    setLoading(false);
  }

  useEffect(() => {
    fetchUsers();
    const interval = setInterval(fetchUsers, 2000);
    return () => clearInterval(interval);
  }, []);

  const medals = ['🥇', '🥈', '🥉'];

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12">
      <div className="max-w-2xl mx-auto">

        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-2">Leaderboard</h1>
          <p className="text-slate-400 text-sm">Top reporters making their city better — updates live</p>
        </div>

        {loading ? (
          <div className="text-center text-slate-400 py-20">Loading...</div>
        ) : users.length === 0 ? (
          <div className="text-center text-slate-400 py-20">
            <p className="text-4xl mb-4">🚀</p>
            <p>No reports yet. Be the first!</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {users.map((user, i) => (
              <div
                key={user.id}
                className={`flex items-center justify-between px-5 py-4 rounded-2xl border transition
                  ${i === 0 ? 'bg-yellow-500/10 border-yellow-500/30' :
                    i === 1 ? 'bg-slate-400/10 border-slate-400/30' :
                    i === 2 ? 'bg-orange-500/10 border-orange-500/30' :
                    'bg-slate-900 border-slate-800'}`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl w-8 text-center">
                    {medals[i] || `#${i + 1}`}
                  </span>
                  <div>
                    <p className="font-semibold">{user.full_name || 'Anonymous'}</p>
                    <p className="text-xs text-slate-400">Reporter</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-indigo-400">{user.total_points ?? 0}</p>
                  <p className="text-xs text-slate-400">points</p>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </main>
  );
}