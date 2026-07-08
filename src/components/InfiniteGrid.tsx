import React, { useEffect, useRef, useState } from 'react';
import { Movie } from '../types';
import { getImageUrl } from '../api';
import { Info } from 'lucide-react';

interface InfiniteGridProps {
  fetchMore: (page: number) => Promise<Movie[]>;
  onMovieClick: (movie: Movie) => void;
  title?: string;
  initialMovies?: Movie[];
  onMoreInfo?: (movie: Movie) => void;
}

export const InfiniteGrid: React.FC<InfiniteGridProps> = ({ fetchMore, onMovieClick, title, initialMovies = [], onMoreInfo }) => {
  const [movies, setMovies] = useState<Movie[]>(initialMovies);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerTarget = useRef(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMoreMovies();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [observerTarget, hasMore, isLoading, page]);

  const loadMoreMovies = async () => {
    setIsLoading(true);
    try {
      const newMovies = await fetchMore(page);
      if (newMovies.length === 0) {
        setHasMore(false);
      } else {
        setMovies(prev => {
          // avoid duplicates
          const existingIds = new Set(prev.map(m => m.id));
          const uniqueNewMovies = newMovies.filter(m => !existingIds.has(m.id));
          return [...prev, ...uniqueNewMovies];
        });
        setPage(p => p + 1);
      }
    } catch (err) {
      console.error("Failed to load more movies", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load if no initialMovies provided
  useEffect(() => {
    if (movies.length === 0 && hasMore && !isLoading) {
      loadMoreMovies();
    }
  }, []);

  return (
    <div className="pt-24 px-4 md:px-12 pb-12 min-h-screen">
      {title && <h2 className="text-2xl font-bold mb-6">{title}</h2>}
      
      {movies.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {movies.map((movie, index) => {
            const displayTitle = movie.title || movie.name;
            const posterUrl = getImageUrl(movie.poster_path, 'w500');
            
            return (
              <div 
                key={`${movie.id}-${index}`} 
                className="cursor-pointer group relative rounded-md overflow-hidden aspect-[2/3] bg-zinc-800"
                onClick={() => onMovieClick(movie)}
              >
                {posterUrl ? (
                  <img 
                    src={posterUrl} 
                    alt={displayTitle}
                    className="w-full h-full object-cover transform transition duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-center p-4">
                    <span className="text-sm font-medium text-zinc-400">{displayTitle}</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2 group/item">
                  <div className="flex justify-between items-end w-full">
                    <p className="text-sm font-semibold truncate text-white mr-2">{displayTitle}</p>
                    {onMoreInfo && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onMoreInfo(movie);
                        }}
                        className="p-1.5 bg-zinc-800/80 hover:bg-zinc-600 rounded-full text-white backdrop-blur-sm transition-colors opacity-0 group-hover/item:opacity-100 shrink-0"
                        title="More Info"
                      >
                        <Info className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : !isLoading ? (
        <div className="text-center text-zinc-500 mt-20">
          <p className="text-xl">No results found.</p>
        </div>
      ) : null}
      
      {isLoading && (
        <div className="flex justify-center py-8 w-full">
          <div className="w-8 h-8 rounded-full border-4 border-zinc-700 border-t-zinc-400 animate-spin" />
        </div>
      )}
      
      <div ref={observerTarget} className="h-4 w-full" />
    </div>
  );
};
