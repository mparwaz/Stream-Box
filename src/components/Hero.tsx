import React from 'react';
import { Movie } from '../types';
import { getImageUrl } from '../api';
import { Play, Info } from 'lucide-react';
import { motion } from 'motion/react';

interface HeroProps {
  movie: Movie | null;
  onPlay: (movie: Movie) => void;
  onMoreInfo: (movie: Movie) => void;
}

export const Hero: React.FC<HeroProps> = ({ movie, onPlay, onMoreInfo }) => {
  if (!movie) {
    return (
      <div className="h-[70vh] w-full bg-zinc-900 animate-pulse flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-zinc-700 border-t-zinc-500 animate-spin" />
      </div>
    );
  }

  const backdropUrl = getImageUrl(movie.backdrop_path, 'original');
  const title = movie.title || movie.name;
  const year = (movie.release_date || movie.first_air_date || '')?.substring(0, 4);

  return (
    <div className="relative h-[70vh] w-full max-h-[800px] min-h-[500px]">
      <div className="absolute inset-0">
        <img
          src={backdropUrl}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
      </div>

      <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 pb-24 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight drop-shadow-lg">
            {title}
          </h1>
          
          <div className="flex items-center gap-4 mb-4 text-sm font-medium">
            <span className="text-green-500">{Math.round((movie.vote_average || 0) * 10)}% Match</span>
            {year && <span className="text-zinc-300">{year}</span>}
            <span className="border border-zinc-500 text-zinc-300 px-1 rounded text-xs">HD</span>
          </div>
          
          <p className="text-zinc-300 text-base md:text-lg mb-8 line-clamp-3 drop-shadow">
            {movie.overview}
          </p>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => onPlay(movie)}
              className="flex items-center gap-2 bg-white text-black px-6 py-2.5 rounded hover:bg-zinc-200 transition-colors font-semibold"
            >
              <Play className="h-5 w-5 fill-black" />
              Play
            </button>
            <button 
              onClick={() => onMoreInfo(movie)}
              className="flex items-center gap-2 bg-zinc-600/70 text-white px-6 py-2.5 rounded hover:bg-zinc-600 transition-colors font-semibold backdrop-blur-sm"
            >
              <Info className="h-5 w-5" />
              More Info
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
