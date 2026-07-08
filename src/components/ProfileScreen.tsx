import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { Plus, Check, Edit2, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';

interface ProfileScreenProps {
  profiles: UserProfile[];
  onSelectProfile: (profile: UserProfile) => void;
  onAddProfile: (profile: Omit<UserProfile, 'id'>) => void;
  onDeleteProfile: (profileId: string) => void;
}

const AVATAR_SEEDS = ['Felix', 'Aneka', 'Jasper', 'Max', 'Luna', 'Oscar', 'Bella', 'Simba', 'Nala', 'Leo'];

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ profiles, onSelectProfile, onAddProfile, onDeleteProfile }) => {
  const [isCreating, setIsCreating] = useState(profiles.length === 0);
  const [isManaging, setIsManaging] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');
  const [selectedAvatarSeed, setSelectedAvatarSeed] = useState(AVATAR_SEEDS[0]);

  useEffect(() => {
    if (profiles.length === 0) {
      setIsCreating(true);
      setIsManaging(false);
    }
  }, [profiles.length]);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProfileName.trim()) return;
    
    onAddProfile({
      name: newProfileName,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedAvatarSeed}`
    });
    
    setNewProfileName('');
    setIsCreating(false);
  };

  if (isCreating) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-2xl bg-zinc-900 rounded-lg p-8 md:p-12 border border-zinc-800"
        >
          <h2 className="text-3xl font-bold text-white mb-8">Add Profile</h2>
          
          <form onSubmit={handleCreate}>
            <div className="mb-8">
              <label className="block text-zinc-400 mb-2">Name</label>
              <input
                type="text"
                value={newProfileName}
                onChange={(e) => setNewProfileName(e.target.value)}
                placeholder="Name"
                className="w-full bg-zinc-800 text-white border border-zinc-700 rounded p-3 focus:outline-none focus:border-white"
                autoFocus
              />
            </div>

            <div className="mb-8">
              <label className="block text-zinc-400 mb-4">Choose Avatar</label>
              <div className="flex flex-wrap gap-4">
                {AVATAR_SEEDS.map((seed) => (
                  <button
                    key={seed}
                    type="button"
                    onClick={() => setSelectedAvatarSeed(seed)}
                    className={`relative rounded-md overflow-hidden transition-all ${selectedAvatarSeed === seed ? 'ring-2 ring-white scale-110' : 'opacity-70 hover:opacity-100'}`}
                  >
                    <img 
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`} 
                      alt={`Avatar ${seed}`} 
                      className="w-16 h-16 bg-zinc-800"
                    />
                    {selectedAvatarSeed === seed && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <Check className="text-white w-6 h-6" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={!newProfileName.trim()}
                className="bg-white text-black px-8 py-3 rounded font-bold hover:bg-zinc-200 disabled:opacity-50 transition-colors"
              >
                Save
              </button>
              {profiles.length > 0 && (
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="bg-transparent border border-zinc-500 text-zinc-300 px-8 py-3 rounded font-bold hover:text-white hover:border-white transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4 relative">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center w-full max-w-5xl"
      >
        <h1 className="text-3xl md:text-5xl text-white font-medium mb-12">
          {isManaging ? 'Manage Profiles' : "Who's watching?"}
        </h1>
        
        <div className="flex flex-wrap justify-center gap-6 md:gap-12 mb-16">
          {profiles.map((profile) => (
            <motion.div
              key={profile.id}
              whileHover={{ scale: isManaging ? 1 : 1.05 }}
              className="flex flex-col items-center group relative"
            >
              <button
                onClick={() => {
                  if (!isManaging) {
                    onSelectProfile(profile);
                  }
                }}
                className={`w-24 h-24 md:w-32 md:h-32 rounded-md overflow-hidden border-2 transition-all ${
                  isManaging ? 'border-zinc-500 opacity-50' : 'border-transparent group-hover:border-white'
                }`}
              >
                <img 
                  src={profile.avatar} 
                  alt={profile.name} 
                  className="w-full h-full object-cover bg-zinc-800"
                />
              </button>

              {isManaging && (
                <button
                  onClick={() => onDeleteProfile(profile.id)}
                  className="absolute inset-0 m-auto w-12 h-12 bg-black/80 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors border border-white/20 z-10"
                >
                  <Trash2 className="w-5 h-5 text-white" />
                </button>
              )}

              <span className={`mt-4 text-sm md:text-lg transition-colors ${
                isManaging ? 'text-zinc-500' : 'text-zinc-400 group-hover:text-white'
              }`}>
                {profile.name}
              </span>
            </motion.div>
          ))}
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => setIsCreating(true)}
            className="flex flex-col items-center group"
          >
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-md overflow-hidden border-2 border-transparent group-hover:border-zinc-300 bg-zinc-800 flex items-center justify-center transition-all">
              <Plus className="text-zinc-400 group-hover:text-zinc-300 w-12 h-12" />
            </div>
            <span className="text-zinc-400 group-hover:text-white mt-4 text-sm md:text-lg transition-colors">
              Add Profile
            </span>
          </motion.button>
        </div>

        {profiles.length > 0 && (
          <button
            onClick={() => setIsManaging(!isManaging)}
            className={`px-6 py-2 border rounded font-semibold transition-colors ${
              isManaging 
                ? 'bg-white text-black border-white hover:bg-zinc-200' 
                : 'bg-transparent text-zinc-500 border-zinc-500 hover:text-white hover:border-white'
            }`}
          >
            {isManaging ? 'Done' : 'Manage Profiles'}
          </button>
        )}
      </motion.div>
    </div>
  );
};
