import React, { useState, useEffect, useRef } from 'react';
import { UserProfile } from '../types';
import { Plus, Check, Trash2, Upload } from 'lucide-react';
import { motion } from 'motion/react';

interface ProfileScreenProps {
  profiles: UserProfile[];
  onSelectProfile: (profile: UserProfile) => void;
  onAddProfile: (profile: Omit<UserProfile, 'id'>) => void;
  onDeleteProfile: (profileId: string) => void;
}

const AVATAR_SEEDS = ['Felix', 'Aneka', 'Jasper', 'Max', 'Luna', 'Oscar', 'Bella', 'Simba', 'Nala', 'Leo', 'Mia', 'Chloe', 'Oliver', 'Loki', 'Toby', 'Milo'];

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ profiles, onSelectProfile, onAddProfile, onDeleteProfile }) => {
  const [isCreating, setIsCreating] = useState(profiles.length === 0);
  const [isManaging, setIsManaging] = useState(false);
  
  const [newProfileName, setNewProfileName] = useState('');
  const [selectedAvatarSeed, setSelectedAvatarSeed] = useState(AVATAR_SEEDS[0]);
  const [customAvatar, setCustomAvatar] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      avatar: customAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedAvatarSeed}`
    });
    
    setNewProfileName('');
    setCustomAvatar(null);
    setSelectedAvatarSeed(AVATAR_SEEDS[0]);
    setIsCreating(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 256;
        const MAX_HEIGHT = 256;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        const resizedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setCustomAvatar(resizedDataUrl);
        setSelectedAvatarSeed(''); // Clear default selection
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  if (isCreating) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-4xl bg-zinc-900 rounded-xl p-8 md:p-12 border border-zinc-800"
        >
          <h2 className="text-3xl font-bold text-white mb-8">Add Profile</h2>
          
          <form onSubmit={handleCreate}>
            <div className="mb-8 max-w-xl">
              <label className="block text-zinc-400 mb-2 font-medium">Name</label>
              <input
                type="text"
                value={newProfileName}
                onChange={(e) => setNewProfileName(e.target.value)}
                placeholder="Enter profile name"
                className="w-full bg-zinc-950 text-white border border-zinc-800 rounded-lg p-4 focus:outline-none focus:ring-1 focus:ring-white focus:border-white transition-colors"
                autoFocus
              />
            </div>

            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <label className="block text-zinc-400 font-medium">Choose Avatar</label>
                <button 
                  type="button" 
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 text-sm bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-md transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  Upload Custom
                </button>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  ref={fileInputRef} 
                  onChange={handleImageUpload} 
                />
              </div>

              {customAvatar && (
                <div className="mb-6 flex flex-col items-start gap-4">
                  <div className="text-xs text-green-400 uppercase tracking-wider font-semibold">Custom Upload Selected</div>
                  <div className="relative">
                    <img src={customAvatar} alt="Custom" className="w-24 h-24 object-cover rounded-md border-2 border-white" />
                    <button 
                      type="button" 
                      onClick={() => { setCustomAvatar(null); setSelectedAvatarSeed(AVATAR_SEEDS[0]); }}
                      className="absolute -top-3 -right-3 bg-red-600 rounded-full p-1.5 hover:bg-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-4 max-h-[30vh] overflow-y-auto p-2 -ml-2 rounded-lg scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
                {AVATAR_SEEDS.map((seed) => (
                  <button
                    key={seed}
                    type="button"
                    onClick={() => {
                      setSelectedAvatarSeed(seed);
                      setCustomAvatar(null);
                    }}
                    className={`relative rounded-md overflow-hidden transition-all flex-shrink-0 ${selectedAvatarSeed === seed && !customAvatar ? 'ring-2 ring-white scale-110 z-10 shadow-xl' : 'opacity-70 hover:opacity-100 hover:scale-105'}`}
                  >
                    <img 
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`} 
                      alt={`Avatar ${seed}`} 
                      className="w-16 h-16 md:w-20 md:h-20 bg-zinc-800"
                    />
                    {selectedAvatarSeed === seed && !customAvatar && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <Check className="text-white w-6 h-6 md:w-8 md:h-8" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-4 pt-4 border-t border-zinc-800">
              <button
                type="submit"
                disabled={!newProfileName.trim()}
                className="bg-white text-black px-8 py-3 rounded-lg font-bold hover:bg-zinc-200 disabled:opacity-50 transition-colors"
              >
                Save Profile
              </button>
              {profiles.length > 0 && (
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="bg-transparent border border-zinc-600 text-zinc-300 px-8 py-3 rounded-lg font-bold hover:text-white hover:border-white transition-colors"
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
                className={`w-24 h-24 md:w-36 md:h-36 rounded-md overflow-hidden border-2 transition-all ${
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
            <div className="w-24 h-24 md:w-36 md:h-36 rounded-md overflow-hidden border-2 border-transparent group-hover:border-zinc-300 bg-zinc-800 flex items-center justify-center transition-all">
              <Plus className="text-zinc-400 group-hover:text-zinc-300 w-12 h-12 md:w-16 md:h-16" />
            </div>
            <span className="text-zinc-400 group-hover:text-white mt-4 text-sm md:text-lg transition-colors">
              Add Profile
            </span>
          </motion.button>
        </div>

        {profiles.length > 0 && (
          <button
            onClick={() => setIsManaging(!isManaging)}
            className={`px-8 py-3 border rounded-full font-semibold transition-colors ${
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
