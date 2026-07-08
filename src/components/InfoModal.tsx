import React, { useEffect } from 'react';
import { Movie } from '../types';
import { X, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getImageUrl } from '../api';

interface InfoModalProps {
  movie: Movie | null;
  onClose: () => void;
  onPlay: (movie: Movie) => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({ movie, onClose, onPlay }) => {
  useEffect(() => {
    if (movie) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [movie]);

  if (!movie) return null;

  const backdropUrl = getImageUrl(movie.backdrop_path, 'original');
  const title = movie.title || movie.name;
  const year = (movie.release_date || movie.first_air_date || '')?.substring(0, 4);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 md:p-12 overflow-y-auto">
        <div 
          className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
          onClick={onClose}
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl bg-zinc-950 rounded-xl overflow-hidden shadow-2xl border border-zinc-800 z-[91] my-auto flex flex-col"
        >
          <div className="relative w-full aspect-video md:aspect-[21/9] bg-zinc-900">
            <img 
              src={backdropUrl} 
              alt={title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-50 bg-black/50 hover:bg-zinc-800 text-white rounded-full p-2 transition-all focus:outline-none"
            >
              <X className="h-6 w-6" />
            </button>
            <div className="absolute bottom-4 md:bottom-8 left-4 md:left-8 right-4">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight drop-shadow-lg">{title}</h2>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => {
                    onClose();
                    onPlay(movie);
                  }}
                  className="flex items-center gap-2 bg-white text-black px-6 py-2 md:py-2.5 rounded hover:bg-zinc-200 transition-colors font-semibold"
                >
                  <Play className="h-5 w-5 md:h-6 md:w-6 fill-black" />
                  Play
                </button>
              </div>
            </div>
          </div>
          
          <div className="p-4 md:p-8 flex flex-col md:flex-row gap-8">
            <div className="flex-grow md:w-2/3">
              <div className="flex items-center gap-4 mb-4 text-sm md:text-base font-medium">
                <span className="text-green-500">{Math.round((movie.vote_average || 0) * 10)}% Match</span>
                {year && <span className="text-zinc-300">{year}</span>}
                <span className="border border-zinc-500 text-zinc-300 px-1.5 rounded text-xs">HD</span>
              </div>
              <p className="text-zinc-300 text-sm md:text-lg leading-relaxed">
                {movie.overview}
              </p>
            </div>
            
            <div className="md:w-1/3 flex flex-col gap-4 text-sm">
              <div>
                <span className="text-zinc-500">Type:</span>
                <span className="text-white ml-2 capitalize">{movie.media_type || (movie.first_air_date ? 'TV Show' : 'Movie')}</span>
              </div>
              <div>
                <span className="text-zinc-500">Original Language:</span>
                <span className="text-white ml-2 uppercase">{movie.original_language}</span>
              </div>
              {movie.vote_count > 0 && (
                <div>
                  <span className="text-zinc-500">Votes:</span>
                  <span className="text-white ml-2">{movie.vote_count.toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
