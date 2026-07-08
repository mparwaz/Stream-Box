import React, { useRef, useState } from 'react';
import { Movie } from '../types';
import { getImageUrl } from '../api';
import { ChevronLeft, ChevronRight, Info } from 'lucide-react';
import { motion } from 'motion/react';

interface MovieRowProps {
  title: string;
  movies: Movie[];
  onMovieClick: (movie: Movie) => void;
  onMoreInfo?: (movie: Movie) => void;
}

export const MovieRow: React.FC<MovieRowProps> = ({ title, movies, onMovieClick, onMoreInfo }) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleScroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  if (!movies.length) return null;

  return (
    <div 
      className="relative z-10 px-4 md:px-12 my-8 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <h2 className="text-xl md:text-2xl font-bold text-white mb-4 pl-2">{title}</h2>
      
      <div className="relative">
        <button
          onClick={() => handleScroll('left')}
          className={`absolute left-0 top-0 bottom-0 z-40 bg-black/50 w-12 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70 ${isHovered ? 'visible' : 'invisible'}`}
        >
          <ChevronLeft className="h-8 w-8 text-white" />
        </button>

        <div 
          ref={rowRef}
          className="flex items-center gap-4 overflow-x-auto scrollbar-hide py-4 px-2 -mx-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {movies.map((movie) => {
            const posterUrl = getImageUrl(movie.poster_path, 'w500');
            if (!posterUrl) return null;
            
            const displayTitle = movie.title || movie.name;
            const year = (movie.release_date || movie.first_air_date || '')?.substring(0, 4);

            return (
              <motion.div
                key={movie.id}
                className="relative flex-none w-[140px] md:w-[200px] cursor-pointer rounded-md overflow-hidden bg-zinc-800 transition-transform duration-300"
                whileHover={{ scale: 1.05, zIndex: 30 }}
                onClick={() => onMovieClick(movie)}
              >
                <img
                  src={posterUrl}
                  alt={displayTitle}
                  className="w-full h-auto object-cover rounded-md shadow-lg"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 group/item">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-white text-sm font-semibold line-clamp-2">{displayTitle}</p>
                      {year && <p className="text-green-400 text-xs mt-1">{year}</p>}
                    </div>
                    {onMoreInfo && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onMoreInfo(movie);
                        }}
                        className="p-1.5 bg-zinc-800/80 hover:bg-zinc-600 rounded-full text-white backdrop-blur-sm transition-colors opacity-0 group-hover/item:opacity-100"
                        title="More Info"
                      >
                        <Info className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <button
          onClick={() => handleScroll('right')}
          className={`absolute right-0 top-0 bottom-0 z-40 bg-black/50 w-12 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70 ${isHovered ? 'visible' : 'invisible'}`}
        >
          <ChevronRight className="h-8 w-8 text-white" />
        </button>
      </div>
    </div>
  );
};
