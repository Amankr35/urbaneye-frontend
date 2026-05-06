'use client';

import { useState } from 'react';
import { supabase } from '../../lib/supabase';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Delhi', 'Jammu and Kashmir',
  'Ladakh', 'Lakshadweep', 'Puducherry'
];

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [state, setState] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  async function handleGoogleLogin() {
    setGoogleLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      setMessage(error.message);
      setGoogleLoading(false);
    }
  }

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
          setTimeout(() => { window.location.href = '/dashboard'; }, 500);
        }
      } else {
        if (!name.trim()) {
          setMessage('Please enter your name');
          setLoading(false);
          return;
        }
        if (!state) {
          setMessage('Please select your state');
          setLoading(false);
          return;
        }

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: name.trim(), state } }
        });

        if (error) {
          setMessage(error.message);
        } else {
          if (data?.user) {
            await supabase.from('profiles').upsert({
              id: data.user.id,
              full_name: name.trim(),
              state,
              total_points: 0,
            });
          }
          setMessage('Account created! You can now log in.');
          setIsLogin(true);
          setName('');
          setState('');
        }
      }
    } catch (err) {
      console.error(err);
      setMessage('Something went wrong ❌');
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-10">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8">

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {isLogin ? 'Welcome back' : 'Join UrbanEye'}
          </h1>
          <p className="text-slate-400 text-sm">
            {isLogin ? 'Log in to your account' : 'Create your account and start reporting'}
          </p>
        </div>

        {/* Google button */}
        <button
          onClick={handleGoogleLogin}
          disabled={googleLoading}
          className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-800 font-semibold py-3 rounded-xl transition mb-6 disabled:opacity-50"
        >
          {googleLoading ? (
            <span className="text-sm">Redirecting...</span>
          ) : (
            <>
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="text-sm">Continue with Google</span>
            </>
          )}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-slate-700" />
          <span className="text-slate-500 text-xs">or continue with email</span>
          <div className="flex-1 h-px bg-slate-700" />
        </div>

        <form onSubmit={handleAuth} className="flex flex-col gap-4">
          {!isLogin && (
            <>
              <input
                type="text"
                placeholder="Your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
              />
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                required
                className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition"
              >
                <option value="" disabled>Select your state</option>
                {INDIAN_STATES.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </>
          )}

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
          <p className={`mt-4 text-center text-sm ${message.includes('❌') || message.includes('error') ? 'text-red-400' : 'text-green-400'}`}>
            {message}
          </p>
        )}

        <p className="mt-6 text-center text-sm text-slate-400">
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <span
            onClick={() => { setIsLogin(!isLogin); setMessage(''); setName(''); setState(''); }}
            className="text-indigo-400 hover:underline cursor-pointer font-medium"
          >
            {isLogin ? 'Sign up' : 'Log in'}
          </span>
        </p>

      </div>
    </main>
  );
}