import React, { useState, useRef } from 'react';
import { UserProfile } from '../types';
import { Upload, Check } from 'lucide-react';
import { motion } from 'motion/react';

interface AccountSettingsProps {
  profile: UserProfile;
  onSave: (updatedProfile: UserProfile) => void;
}

const AVATAR_SEEDS = ['Felix', 'Aneka', 'Jasper', 'Max', 'Luna', 'Oscar', 'Bella', 'Simba', 'Nala', 'Leo', 'Mia', 'Chloe', 'Oliver', 'Loki', 'Toby', 'Milo'];

export const AccountSettings: React.FC<AccountSettingsProps> = ({ profile, onSave }) => {
  const [name, setName] = useState(profile.name);
  const [avatar, setAvatar] = useState(profile.avatar);
  const [customAvatar, setCustomAvatar] = useState<string | null>(profile.avatar.includes('dicebear') ? null : profile.avatar);
  const [selectedAvatarSeed, setSelectedAvatarSeed] = useState(profile.avatar.includes('dicebear') ? profile.avatar.split('seed=')[1] : '');

  const fileInputRef = useRef<HTMLInputElement>(null);

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
        setAvatar(resizedDataUrl);
        setSelectedAvatarSeed('');
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    onSave({
      ...profile,
      name,
      avatar
    });
  };

  return (
    <div className="pt-24 px-4 pb-12 flex flex-col items-center justify-center min-h-screen">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl bg-zinc-900 rounded-xl p-8 md:p-12 border border-zinc-800"
      >
        <h2 className="text-3xl font-bold text-white mb-8">Edit Profile</h2>
        
        <form onSubmit={handleSave}>
          <div className="mb-8 max-w-xl">
            <label className="block text-zinc-400 mb-2 font-medium">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter profile name"
              className="w-full bg-zinc-950 text-white border border-zinc-800 rounded-lg p-4 focus:outline-none focus:ring-1 focus:ring-white focus:border-white transition-colors"
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
                    setAvatar(`https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`);
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
              disabled={!name.trim()}
              className="bg-white text-black px-8 py-3 rounded-lg font-bold hover:bg-zinc-200 disabled:opacity-50 transition-colors"
            >
              Save Profile
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
