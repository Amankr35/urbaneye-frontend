'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';

const severityPoints = { minor: 30, moderate: 60, severe: 100 };
const severityColors = {
  minor: 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10',
  moderate: 'text-orange-400 border-orange-400/30 bg-orange-400/10',
  severe: 'text-red-400 border-red-400/30 bg-red-400/10',
};

export default function ReportPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [location, setLocation] = useState(null);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    setMounted(true);
    async function checkAuth() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/auth');
      }
    }
    checkAuth();
  }, []);

  if (!mounted) return null;

  function handleFile(e) {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setResult(null);
    setStatus('');
  }

  function detectLocation() {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      () => alert('Location permission denied')
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!file || !location) {
      alert('Please add image and detect location first');
      return;
    }

    try {
      setLoading(true);
      setResult(null);
      setStatus('Uploading image...');

      const cleanName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
      const fileName = `${Date.now()}-${cleanName}`;

      const { error: uploadError } = await supabase.storage
        .from('pothole-images')
        .upload(fileName, file, { contentType: file.type });

      if (uploadError) {
        console.error(uploadError);
        setStatus('Upload failed ❌');
        setLoading(false);
        return;
      }

      const { data } = supabase.storage
        .from('pothole-images')
        .getPublicUrl(fileName);

      setStatus('Running AI verification...');

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reports/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: data.publicUrl }),
      });

      if (!res.ok) {
        setStatus('Backend error ❌');
        setLoading(false);
        return;
      }

      const ai = await res.json();

      if (!ai.is_pothole) {
        setStatus(`Not a pothole ❌ — ${ai.reason}`);
        setLoading(false);
        return;
      }

      setStatus('Saving report...');

      const { error: dbError } = await supabase.from('reports').insert({
        image_url: data.publicUrl,
        lat: location.lat,
        lng: location.lng,
        severity: ai.severity,
        confidence: ai.confidence,
        status: 'verified',
      });

      if (dbError) {
        console.error(dbError);
        setStatus('Database error ❌');
        setLoading(false);
        return;
      }

      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData?.session?.user;

      if (!user) {
        setStatus('Please login first ❌');
        setLoading(false);
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('total_points')
        .eq('id', user.id)
        .single();

      const pointsEarned = severityPoints[ai.severity] || 10;

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ total_points: (profile?.total_points || 0) + pointsEarned })
        .eq('id', user.id);

      if (updateError) {
        console.error(updateError);
        setStatus('Points update failed ❌');
        setLoading(false);
        return;
      }

      setResult({ severity: ai.severity, confidence: ai.confidence, points: pointsEarned });
      setStatus('');
      setFile(null);
      setPreview(null);
      setLocation(null);

    } catch (err) {
      console.error(err);
      setStatus('Something went wrong ❌');
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950 p-6">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6">

        <h1 className="text-2xl font-bold text-center mb-6">Report a pothole</h1>

        <label
          htmlFor="photo"
          className="block w-full border-2 border-dashed border-slate-700 hover:border-indigo-500 rounded-xl p-6 text-center cursor-pointer transition mb-4"
        >
          {preview ? (
            <img src={preview} alt="preview" className="mx-auto max-h-48 rounded-xl" />
          ) : (
            <div>
              <p className="text-slate-400 text-sm">Click to upload a photo</p>
              <p className="text-slate-600 text-xs mt-1">JPG, PNG supported</p>
            </div>
          )}
        </label>
        <input id="photo" type="file" accept="image/*" onChange={handleFile} className="hidden" />

        <button
          type="button"
          onClick={detectLocation}
          className={`w-full py-2.5 rounded-xl text-sm font-medium border transition mb-3
            ${location
              ? 'bg-green-500/10 border-green-500/30 text-green-400'
              : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'}`}
        >
          {location
            ? `📍 ${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`
            : 'Detect my location'}
        </button>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 font-semibold transition"
        >
          {loading ? status || 'Processing...' : 'Submit report'}
        </button>

        {status && !loading && (
          <p className={`mt-4 text-center text-sm ${status.includes('❌') ? 'text-red-400' : 'text-slate-300'}`}>
            {status}
          </p>
        )}

        {result && (
          <div className="mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-center">
            <p className="text-green-400 font-semibold text-lg">Report verified ✓</p>
            <p className="text-green-300 text-sm mt-1">+{result.points} points earned</p>
            <div className="flex justify-center gap-3 mt-3">
              <span className={`text-xs px-3 py-1 rounded-full border capitalize font-medium ${severityColors[result.severity]}`}>
                {result.severity}
              </span>
              <span className="text-xs px-3 py-1 rounded-full border border-slate-600 text-slate-400">
                {result.confidence}% confidence
              </span>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}