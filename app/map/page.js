'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { supabase } from '../../lib/supabase';

const MapContainer = dynamic(() => import('react-leaflet').then(m => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(m => m.TileLayer), { ssr: false });
const CircleMarker = dynamic(() => import('react-leaflet').then(m => m.CircleMarker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(m => m.Popup), { ssr: false });

const severityColors = {
  minor: '#facc15',
  moderate: '#f97316',
  severe: '#ef4444',
};

export default function MapPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    if (typeof window !== 'undefined') {
      const L = require('leaflet');
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
      });
    }

    fetchReports();
  }, []);

  async function fetchReports() {
    const { data, error } = await supabase.from('reports').select('*');
    if (error) {
      console.error(error);
      return;
    }
    setReports(data);
    setLoading(false);
  }

  const filtered = filter === 'all'
    ? reports
    : reports.filter(r => r.severity === filter);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10">
      <div className="max-w-6xl mx-auto">

        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Live pothole map</h1>
            <p className="text-slate-400 mt-1 text-sm">
              {reports.length} verified reports across India
            </p>
          </div>

          <div className="flex gap-2">
            {['all', 'minor', 'moderate', 'severe'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition
                  ${filter === f
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-4 mb-4 text-sm">
          {[
            { label: 'Minor', color: 'bg-yellow-400' },
            { label: 'Moderate', color: 'bg-orange-500' },
            { label: 'Severe', color: 'bg-red-500' },
          ].map(s => (
            <div key={s.label} className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${s.color}`} />
              <span className="text-slate-300">{s.label}</span>
            </div>
          ))}
        </div>

        <div className="rounded-2xl overflow-hidden border border-slate-800" style={{ height: '70vh' }}>
          {loading ? (
            <div className="h-full flex items-center justify-center text-slate-400 bg-slate-900">
              Loading map...
            </div>
          ) : (
            <MapContainer
              center={[20.5937, 78.9629]}
              zoom={5}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {filtered.map((r) => (
                <CircleMarker
                  key={r.id}
                  center={[r.lat, r.lng]}
                  radius={10}
                  fillColor={severityColors[r.severity] || '#94a3b8'}
                  color="#fff"
                  weight={1.5}
                  fillOpacity={0.9}
                >
                  <Popup>
                    <div className="text-sm">
                      <p className="font-semibold capitalize mb-1">
                        {r.severity} pothole
                      </p>
                      <p className="text-gray-500 text-xs mb-2">
                        Confidence: {r.confidence}%
                      </p>
                      {r.image_url && (
                        <img
                          src={r.image_url}
                          alt="pothole"
                          className="rounded w-40"
                        />
                      )}
                    </div>
                  </Popup>
                </CircleMarker>
              ))}
            </MapContainer>
          )}
        </div>

      </div>
    </div>
  );
}