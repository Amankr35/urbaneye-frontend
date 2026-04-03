'use client';

import { useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleAuth(e) {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          setMessage(error.message);
        } else {
          setMessage('Login successful 🎉');
          setTimeout(() => { window.location.href = '/report'; }, 500);
        }
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) {
          setMessage(error.message);
        } else {
          setMessage('Signup successful! Now login.');
          setIsLogin(true);
        }
      }
    } catch (err) {
      console.error(err);
      setMessage('Something went wrong ❌');
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8">

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {isLogin ? 'Welcome back' : 'Join UrbanEye'}
          </h1>
          <p className="text-slate-400 text-sm">
            {isLogin ? 'Log in to your account' : 'Create your account and start reporting'}
          </p>
        </div>

        <form onSubmit={handleAuth} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition mt-2"
          >
            {loading ? 'Please wait...' : isLogin ? 'Log in' : 'Create account'}
          </button>
        </form>

        {message && (
          <p className={`mt-4 text-center text-sm ${message.includes('❌') ? 'text-red-400' : 'text-green-400'}`}>
            {message}
          </p>
        )}

        <p className="mt-6 text-center text-sm text-slate-400">
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <span
            onClick={() => { setIsLogin(!isLogin); setMessage(''); }}
            className="text-indigo-400 hover:underline cursor-pointer font-medium"
          >
            {isLogin ? 'Sign up' : 'Log in'}
          </span>
        </p>

      </div>
    </main>
  );
}