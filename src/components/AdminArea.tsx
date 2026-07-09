import React, { useState, useEffect } from 'react';
import { Settings, Save } from 'lucide-react';
import { motion } from 'motion/react';

export const AdminArea: React.FC = () => {
  const [tmdbApiKey, setTmdbApiKey] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const savedKey = localStorage.getItem('streambox_tmdb_api_key');
    if (savedKey) {
      setTmdbApiKey(savedKey);
    }
  }, []);

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      localStorage.setItem('streambox_tmdb_api_key', tmdbApiKey);
      setMessage('Configuration saved successfully. Reloading...');
      setTimeout(() => window.location.reload(), 1500);
    } catch (e) {
      setError('An error occurred');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 pt-24 px-4 pb-12 flex justify-center items-start">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-xl p-8"
      >
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-zinc-800">
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Settings className="h-6 w-6 text-zinc-400" />
            API Configuration
          </h1>
        </div>

        {message && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/50 text-green-400 rounded-md text-sm">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 text-red-400 rounded-md text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSaveConfig} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">
              TMDb API Key
            </label>
            <input
              type="text"
              value={tmdbApiKey}
              onChange={(e) => setTmdbApiKey(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-colors"
              placeholder="Enter your TMDb API Key"
            />
            <p className="mt-2 text-xs text-zinc-500">
              This key is used for fetching movies, tv shows, and searching from TMDB.
            </p>
          </div>

          <div className="pt-4 border-t border-zinc-800">
            <button
              type="submit"
              className="flex items-center gap-2 bg-white text-black px-6 py-2.5 rounded hover:bg-zinc-200 transition-colors font-semibold"
            >
              <Save className="h-5 w-5" />
              Save Configuration
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
