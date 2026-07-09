import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TrailerModalProps {
  videoKey: string;
  onClose: () => void;
}

export const TrailerModal: React.FC<TrailerModalProps> = ({ videoKey, onClose }) => {
  useEffect(() => {
    if (videoKey) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [videoKey]);

  if (!videoKey) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div 
          className="absolute inset-0 bg-black/90 backdrop-blur-sm cursor-pointer"
          onClick={onClose}
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full aspect-video md:aspect-auto md:h-[85vh] max-w-6xl bg-black rounded-xl overflow-hidden shadow-2xl z-[101]"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-50 bg-black/50 hover:bg-zinc-800 text-white rounded-full p-2 transition-all focus:outline-none"
          >
            <X className="h-6 w-6" />
          </button>
          <iframe
            src={`https://www.youtube.com/embed/${videoKey}?autoplay=1`}
            title="Trailer"
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
