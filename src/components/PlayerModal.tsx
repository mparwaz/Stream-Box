import React, { useEffect, useState } from 'react';
import { Movie } from '../types';
import { X, Server, ExternalLink, AlertTriangle, Tv, Film } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { fetchTvDetails, fetchTvSeason } from '../api';

interface PlayerModalProps {
  movie: Movie | null;
  onClose: () => void;
}

const SERVERS = [
  { name: 'VidSrc (vidsrc.me)', getUrl: (id: number, isTv: boolean, s: number, e: number) => `https://vidsrc.me/embed/${isTv ? `tv?tmdb=${id}&season=${s}&episode=${e}` : `movie?tmdb=${id}`}` },
  { name: 'VidSrc.to', getUrl: (id: number, isTv: boolean, s: number, e: number) => `https://vidsrc.to/embed/${isTv ? `tv/${id}/${s}/${e}` : `movie/${id}`}` },
  { name: 'VidSrc.net', getUrl: (id: number, isTv: boolean, s: number, e: number) => `https://vidsrc.net/embed/${isTv ? `tv?tmdb=${id}&season=${s}&episode=${e}` : `movie?tmdb=${id}`}` },
  { name: 'VidSrc.pm', getUrl: (id: number, isTv: boolean, s: number, e: number) => `https://vidsrc.pm/embed/${isTv ? `tv?tmdb=${id}&season=${s}&episode=${e}` : `movie?tmdb=${id}`}` },
  { name: 'VidSrc.xyz', getUrl: (id: number, isTv: boolean, s: number, e: number) => `https://vidsrc.xyz/embed/${isTv ? `tv?tmdb=${id}&season=${s}&episode=${e}` : `movie?tmdb=${id}`}` },
  { name: 'VidSrc Pro', getUrl: (id: number, isTv: boolean, s: number, e: number) => `https://vidsrc.pro/embed/${isTv ? `tv/${id}/${s}/${e}` : `movie/${id}`}` },
  { name: 'VidSrc Rip', getUrl: (id: number, isTv: boolean, s: number, e: number) => `https://vidsrc.rip/embed/${isTv ? `tv/${id}/${s}/${e}` : `movie/${id}`}` },
  { name: 'VidSrc ICU', getUrl: (id: number, isTv: boolean, s: number, e: number) => `https://vidsrc.icu/embed/${isTv ? `tv/${id}/${s}/${e}` : `movie/${id}`}` },
  { name: 'VidSrc.cc', getUrl: (id: number, isTv: boolean, s: number, e: number) => `https://vidsrc.cc/v2/embed/${isTv ? `tv/${id}/${s}/${e}` : `movie/${id}`}` },
  { name: 'VidSrc.in', getUrl: (id: number, isTv: boolean, s: number, e: number) => `https://vidsrc.in/embed/${isTv ? `tv/${id}/${s}/${e}` : `movie/${id}`}` },
  { name: 'VixSrc', getUrl: (id: number, isTv: boolean, s: number, e: number) => `https://vixsrc.net/embed/${isTv ? `tv/${id}/${s}/${e}` : `movie/${id}`}` },
  { name: '2Embed', getUrl: (id: number, isTv: boolean, s: number, e: number) => `https://www.2embed.cc/embed/${isTv ? `tv/${id}&s=${s}&e=${e}` : `${id}`}` },
  { name: 'SuperEmbed', getUrl: (id: number, isTv: boolean, s: number, e: number) => `https://multiembed.mov/?video_id=${id}&tmdb=1${isTv ? `&s=${s}&e=${e}` : ''}` },
  { name: 'VidLink', getUrl: (id: number, isTv: boolean, s: number, e: number) => `https://vidlink.pro/${isTv ? `tv/${id}/${s}/${e}` : `movie/${id}`}` },
  { name: 'SmashyStream', getUrl: (id: number, isTv: boolean, s: number, e: number) => `https://player.smashy.stream/${isTv ? `tv/${id}?s=${s}&e=${e}` : `movie/${id}`}` },
  { name: 'Embed.su', getUrl: (id: number, isTv: boolean, s: number, e: number) => `https://embed.su/embed/${isTv ? `tv/${id}/${s}/${e}` : `movie/${id}`}` },
  { name: 'AutoEmbed', getUrl: (id: number, isTv: boolean, s: number, e: number) => `https://player.autoembed.cc/embed/${isTv ? `tv/${id}/${s}/${e}` : `movie/${id}`}` },
  { name: 'VidCore', getUrl: (id: number, isTv: boolean, s: number, e: number) => `https://vidcore.tv/embed/${isTv ? `tv/${id}/${s}/${e}` : `movie/${id}`}` },
  { name: 'FSAPI', getUrl: (id: number, isTv: boolean, s: number, e: number) => `https://fsapi.xyz/${isTv ? `tv-tmdb/${id}-${s}-${e}` : `movie/${id}`}` },
  { name: 'Gomo', getUrl: (id: number, isTv: boolean, s: number, e: number) => `https://gomo.to/${isTv ? `show/${id}/${s}-${e}` : `movie/${id}`}` },
  { name: 'ApiIMDb', getUrl: (id: number, isTv: boolean, s: number, e: number) => `https://v2.apimdb.net/e/tmdb/${isTv ? `tv/${id}/${s}/${e}` : `movie/${id}`}` },
  { name: 'RiveStream', getUrl: (id: number, isTv: boolean, s: number, e: number) => `https://rive.to/api/embed/${isTv ? `tv/${id}/${s}/${e}` : `movie/${id}`}` },
  { name: 'VidCloud', getUrl: (id: number, isTv: boolean, s: number, e: number) => `https://vidcloud.stream/embed/${isTv ? `tv/${id}/${s}/${e}` : `movie/${id}`}` },
  { name: 'CurtStream', getUrl: (id: number, isTv: boolean, s: number, e: number) => `https://curtstream.com/embed/${isTv ? `tv/${id}/${s}/${e}` : `movie/${id}`}` },
  { name: 'DatabaseGdrivePlayer', getUrl: (id: number, isTv: boolean, s: number, e: number) => `https://databasegdriveplayer.co/player.php?${isTv ? `type=series&tmdb=${id}&season=${s}&episode=${e}` : `tmdb=${id}`}` },
  { name: 'GoDrivePlayer', getUrl: (id: number, isTv: boolean, s: number, e: number) => `https://godriveplayer.com/embed/${isTv ? `tv/${id}/${s}/${e}` : `movie/${id}`}` },
  { name: 'MultiEmbed (.mov)', getUrl: (id: number, isTv: boolean, s: number, e: number) => `https://multiembed.mov/?video_id=${id}&tmdb=1${isTv ? `&s=${s}&e=${e}` : ''}` },
  { name: 'MultiEmbed (.cm)', getUrl: (id: number, isTv: boolean, s: number, e: number) => `https://multiembed.cm/?video_id=${id}&tmdb=1${isTv ? `&s=${s}&e=${e}` : ''}` },
  { name: 'AllEmbed (.com)', getUrl: (id: number, isTv: boolean, s: number, e: number) => `https://allembed.com/embed/${isTv ? `tv/${id}/${s}/${e}` : `movie/${id}`}` },
  { name: 'AllEmbed (.to)', getUrl: (id: number, isTv: boolean, s: number, e: number) => `https://allembed.to/embed/${isTv ? `tv/${id}/${s}/${e}` : `movie/${id}`}` },
  { name: 'NoxEmbed', getUrl: (id: number, isTv: boolean, s: number, e: number) => `https://noxembed.xyz/embed/${isTv ? `tv/${id}/${s}/${e}` : `movie/${id}`}` },
  { name: 'Player.vidsrc', getUrl: (id: number, isTv: boolean, s: number, e: number) => `https://player.vidsrc.me/embed/${isTv ? `tv/${id}/${s}/${e}` : `movie/${id}`}` },
  { name: 'Videasy', getUrl: (id: number, isTv: boolean, s: number, e: number) => `https://videasy.net/embed/${isTv ? `tv/${id}/${s}/${e}` : `movie/${id}`}` },
  { name: 'MovieWP', getUrl: (id: number, isTv: boolean, s: number, e: number) => `https://moviewp.com/embed/${isTv ? `tv/${id}/${s}/${e}` : `movie/${id}`}` },
  { name: 'Vidsrc-api', getUrl: (id: number, isTv: boolean, s: number, e: number) => `https://vidsrc.api/embed/${isTv ? `tv/${id}/${s}/${e}` : `movie/${id}`}` },
];

export const PlayerModal: React.FC<PlayerModalProps> = ({ movie, onClose }) => {
  const [activeServer, setActiveServer] = useState(0);
  const [showWarning, setShowWarning] = useState(true);
  
  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);
  const [seasonsList, setSeasonsList] = useState<any[]>([]);
  const [episodesList, setEpisodesList] = useState<any[]>([]);

  const isTvShow = movie?.media_type === 'tv' || !!movie?.name || !!movie?.first_air_date;

  useEffect(() => {
    if (movie) {
      document.body.style.overflow = 'hidden';
      setActiveServer(0); // Reset server selection on new movie
      setShowWarning(true);
      
      if (isTvShow) {
        setSeason(1);
        setEpisode(1);
        fetchTvDetails(movie.id).then(data => {
          setSeasonsList(data.seasons?.filter((s: any) => s.season_number > 0) || []);
        }).catch(err => console.error(err));
      }
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [movie, isTvShow]);

  useEffect(() => {
    if (movie && isTvShow && season > 0) {
      fetchTvSeason(movie.id, season).then(data => {
        setEpisodesList(data.episodes || []);
      }).catch(err => console.error(err));
    }
  }, [movie, isTvShow, season]);

  if (!movie) return null;

  const embedUrl = SERVERS[activeServer].getUrl(movie.id, !!isTvShow, season, episode);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-0 md:p-12">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full h-full md:h-auto max-w-6xl bg-black md:bg-zinc-950 md:rounded-lg overflow-hidden shadow-2xl md:border border-zinc-800 flex flex-col pt-[env(safe-area-inset-top)] md:pt-0"
        >
          {showWarning && (
            <div className="bg-yellow-500/90 text-black text-xs md:text-sm px-4 py-2 flex flex-col md:flex-row items-start md:items-center justify-between gap-2 md:gap-4 shrink-0 w-full z-50">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span className="font-medium line-clamp-2 md:line-clamp-none">
                  Getting "Sandboxing is not allowed" or playback errors? This is due to the AI Studio preview environment.
                </span>
              </div>
              <div className="flex items-center gap-2 md:gap-4 w-full md:w-auto justify-end">
                <a 
                  href={window.location.href} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 bg-black/20 hover:bg-black/30 px-3 py-1.5 rounded-md font-semibold transition-colors whitespace-nowrap text-xs md:text-sm"
                >
                  <span>Open in New Tab</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
                <button onClick={() => setShowWarning(false)} className="p-1.5 hover:bg-black/20 rounded-full shrink-0">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* Controls Header */}
          <div className="flex flex-wrap items-center justify-between p-2 md:p-4 shrink-0 z-50 bg-zinc-950 border-b border-zinc-800/50">
            <div className="flex flex-wrap gap-1.5 md:gap-2">
              <div className="bg-zinc-900 transition-colors rounded-md p-1 md:p-1.5 flex items-center gap-1.5 border border-zinc-700/50 text-white">
                <Server className="h-3.5 w-3.5 md:h-4 md:w-4 text-zinc-400 ml-1 shrink-0" />
                <select 
                  className="bg-transparent text-xs md:text-sm font-medium text-white focus:outline-none cursor-pointer pr-1 md:pr-2 appearance-none max-w-[120px] md:max-w-none truncate"
                  value={activeServer}
                  onChange={(e) => setActiveServer(Number(e.target.value))}
                >
                  {SERVERS.map((server, index) => (
                    <option key={server.name} value={index} className="bg-zinc-900 text-white">
                      {server.name}
                    </option>
                  ))}
                </select>
              </div>

              {isTvShow && seasonsList.length > 0 && (
                <>
                  <div className="bg-zinc-900 transition-colors rounded-md p-1 md:p-1.5 flex items-center gap-1.5 border border-zinc-700/50 text-white">
                    <Tv className="h-3.5 w-3.5 md:h-4 md:w-4 text-zinc-400 ml-1 shrink-0" />
                    <select 
                      className="bg-transparent text-xs md:text-sm font-medium text-white focus:outline-none cursor-pointer pr-1 md:pr-2 appearance-none max-w-[70px] md:max-w-[120px]"
                      value={season}
                      onChange={(e) => {
                        setSeason(Number(e.target.value));
                        setEpisode(1);
                      }}
                    >
                      {seasonsList.map((s) => (
                        <option key={s.season_number} value={s.season_number} className="bg-zinc-900 text-white">
                          S{s.season_number}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {episodesList.length > 0 && (
                    <div className="bg-zinc-900 transition-colors rounded-md p-1 md:p-1.5 flex items-center gap-1.5 border border-zinc-700/50 text-white">
                      <Film className="h-3.5 w-3.5 md:h-4 md:w-4 text-zinc-400 ml-1 shrink-0" />
                      <select 
                        className="bg-transparent text-xs md:text-sm font-medium text-white focus:outline-none cursor-pointer pr-1 md:pr-2 appearance-none max-w-[80px] md:max-w-[150px] truncate"
                        value={episode}
                        onChange={(e) => setEpisode(Number(e.target.value))}
                      >
                        {episodesList.map((e) => (
                          <option key={e.episode_number} value={e.episode_number} className="bg-zinc-900 text-white">
                            E{e.episode_number}: {e.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </>
              )}
            </div>

            <button
              onClick={onClose}
              className="bg-zinc-800 hover:bg-zinc-700 text-white rounded-full p-1.5 md:p-2 transition-all focus:outline-none ml-auto"
            >
              <X className="h-5 w-5 md:h-6 md:w-6" />
            </button>
          </div>
          
          <div className="w-full flex-grow bg-black relative flex items-center justify-center">
            <div className="w-full h-full md:aspect-video relative">
              <iframe
                src={embedUrl}
                title={movie.title || movie.name}
                className="absolute inset-0 w-full h-full border-0"
                allowFullScreen
                frameBorder="0"
                scrolling="no"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
