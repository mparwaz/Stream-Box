import React, { useState, useEffect } from 'react';
import { Settings, LogIn, UserPlus, Save, LogOut } from 'lucide-react';
import { motion } from 'motion/react';

export const AdminArea: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('adminToken') || '');
  const [view, setView] = useState<'login' | 'register'>('login');
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const [tmdbApiKey, setTmdbApiKey] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (token) {
      setIsLoggedIn(true);
      fetchConfig();
    }
  }, [token]);

  const fetchConfig = async () => {
    try {
      const res = await fetch('/api/admin/config', {
        headers: { Authorization: token }
      });
      if (res.ok) {
        const data = await res.json();
        setTmdbApiKey(data.tmdbApiKey || '');
      } else {
        handleLogout();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok && data.token) {
        setToken(data.token);
        localStorage.setItem('adminToken', data.token);
        setIsLoggedIn(true);
        setUsername('');
        setPassword('');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (e) {
      setError('An error occurred');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/admin/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Registration successful. Please login.');
        setView('login');
        setUsername('');
        setPassword('');
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (e) {
      setError('An error occurred');
    }
  };

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const res = await fetch('/api/admin/config', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: token
        },
        body: JSON.stringify({ tmdbApiKey })
      });
      if (res.ok) {
        setMessage('Configuration saved successfully. Reloading...');
        setTimeout(() => window.location.reload(), 1500);
      } else {
        setError('Failed to save configuration');
      }
    } catch (e) {
      setError('An error occurred');
    }
  };

  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('adminToken');
    setIsLoggedIn(false);
  };

  if (isLoggedIn) {
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
              Admin Configuration
            </h1>
            <button 
              onClick={handleLogout}
              className="text-zinc-400 hover:text-white flex items-center gap-2"
            >
              <LogOut className="h-5 w-5" />
              Logout
            </button>
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
  }

  return (
    <div className="min-h-screen bg-zinc-950 pt-32 px-4 flex justify-center items-start">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-xl p-8"
      >
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">
            {view === 'login' ? 'Admin Login' : 'Create Admin'}
          </h2>
          <p className="text-zinc-400 text-sm">
            {view === 'login' 
              ? 'Enter your credentials to access the admin area.' 
              : 'Register a new admin account.'}
          </p>
        </div>

        {message && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/50 text-green-400 rounded-md text-sm text-center">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 text-red-400 rounded-md text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={view === 'login' ? handleLogin : handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1.5">Username</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1.5">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500"
            />
          </div>

          <button
            type="submit"
            className="w-full flex justify-center items-center gap-2 bg-white text-black py-2.5 rounded-lg hover:bg-zinc-200 transition-colors font-semibold mt-6"
          >
            {view === 'login' ? <LogIn className="h-5 w-5" /> : <UserPlus className="h-5 w-5" />}
            {view === 'login' ? 'Sign In' : 'Register'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setView(view === 'login' ? 'register' : 'login');
              setError('');
              setMessage('');
            }}
            className="text-sm text-zinc-400 hover:text-white transition-colors"
          >
            {view === 'login' 
              ? "Don't have an account? Register" 
              : "Already have an account? Login"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
