'use client';

import { useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { useRouter } from 'next/navigation';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    async function handleCallback() {
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', session.user.id)
          .single();

        if (!profile) {
          await supabase.from('profiles').insert({
            id: session.user.id,
            full_name: session.user.user_metadata?.full_name || session.user.email,
            total_points: 0,
          });
        }

        router.push('/dashboard');
      } else {
        router.push('/auth');
      }
    }

    handleCallback();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-400 text-sm">Signing you in...</p>
      </div>
    </div>
  );
}