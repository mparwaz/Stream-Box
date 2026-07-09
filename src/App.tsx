import React, { useEffect, useState } from 'react';
import { Navbar, AppView } from './components/Navbar';
import { Hero } from './components/Hero';
import { MovieRow } from './components/MovieRow';
import { PlayerModal } from './components/PlayerModal';
import { InfoModal } from './components/InfoModal';
import { InfiniteGrid } from './components/InfiniteGrid';
import { ProfileScreen } from './components/ProfileScreen';
import { AdminArea } from "./components/AdminArea";
import { Movie, UserProfile } from './types';
import { 
  fetchTrending, 
  fetchPopular, 
  fetchTopRated, 
  fetchActionMovies, 
  fetchComedyMovies,
  fetchMovies,
  fetchTvShows,
  fetchLatest,
  searchMovies 
} from './api';

export default function App() {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [currentProfile, setCurrentProfile] = useState<UserProfile | null>(null);

  const [currentView, setCurrentView] = useState<AppView>('home');
  const [searchQuery, setSearchQuery] = useState('');

  const [trending, setTrending] = useState<Movie[]>([]);
  const [popular, setPopular] = useState<Movie[]>([]);
  const [topRated, setTopRated] = useState<Movie[]>([]);
  const [actionMovies, setActionMovies] = useState<Movie[]>([]);
  const [comedyMovies, setComedyMovies] = useState<Movie[]>([]);
  
  const [heroMovie, setHeroMovie] = useState<Movie | null>(null);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [infoMovie, setInfoMovie] = useState<Movie | null>(null);
  
  const [error, setError] = useState<string | null>(null);
  const [isInitialLoadDone, setIsInitialLoadDone] = useState(false);

  const [isConfigured, setIsConfigured] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if TMDB API Key is configured
    fetch('/api/status')
      .then(res => res.json())
      .then(data => {
        setIsConfigured(data.isConfigured);
        if (data.isConfigured) {
          loadHomeData();
        }
      })
      .catch(() => setIsConfigured(false));

    // Load profiles from local storage
    const savedProfiles = localStorage.getItem('streambox_profiles');
    if (savedProfiles) {
      try {
        setProfiles(JSON.parse(savedProfiles));
      } catch (e) {
        console.error("Failed to parse profiles", e);
      }
    }
    
    // Load initial home page data
    const loadHomeData = async () => {
      try {
        const [trendingData, popularData, topRatedData, actionData, comedyData] = await Promise.all([
          fetchTrending(1),
          fetchPopular(1),
          fetchTopRated(1),
          fetchActionMovies(1),
          fetchComedyMovies(1)
        ]);

        setTrending(trendingData);
        setPopular(popularData);
        setTopRated(topRatedData);
        setActionMovies(actionData);
        setComedyMovies(comedyData);
        
        if (trendingData.length > 0) {
          const randomIndex = Math.floor(Math.random() * Math.min(5, trendingData.length));
          setHeroMovie(trendingData[randomIndex]);
        }
      } catch (err: any) {
        console.error("Failed to fetch initial data", err);
        setError("Failed to load movies. Ensure TMDB_API_KEY is set in your environment.");
      } finally {
        setIsInitialLoadDone(true);
      }
    };
  }, []);

  const handleAddProfile = (newProfile: Omit<UserProfile, 'id'>) => {
    const profile: UserProfile = { ...newProfile, id: Date.now().toString(), continueWatching: [] };
    const updatedProfiles = [...profiles, profile];
    setProfiles(updatedProfiles);
    localStorage.setItem('streambox_profiles', JSON.stringify(updatedProfiles));
    setCurrentProfile(profile);
  };

  const handleDeleteProfile = (profileId: string) => {
    const updatedProfiles = profiles.filter(p => p.id !== profileId);
    setProfiles(updatedProfiles);
    localStorage.setItem('streambox_profiles', JSON.stringify(updatedProfiles));
  };

  const handleSearch = (query: string) => {
    if (!query) {
      setCurrentView('home');
      setSearchQuery('');
      return;
    }
    setSearchQuery(query);
    setCurrentView('search');
  };

  const handleMovieSelect = (movie: Movie) => {
    setSelectedMovie(movie);
    if (currentProfile) {
      const currentList = currentProfile.continueWatching || [];
      const updatedList = [movie, ...currentList.filter(m => m.id !== movie.id)].slice(0, 15);
      const updatedProfile = { ...currentProfile, continueWatching: updatedList };
      setCurrentProfile(updatedProfile);
      
      const updatedProfiles = profiles.map(p => p.id === updatedProfile.id ? updatedProfile : p);
      setProfiles(updatedProfiles);
      localStorage.setItem('streambox_profiles', JSON.stringify(updatedProfiles));
    }
  };

  if (isConfigured === null) {
    return <div className="min-h-screen bg-zinc-950"></div>;
  }

  if (isConfigured === false) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white overflow-x-hidden pb-12">
        <Navbar 
          onSearch={handleSearch} 
          onClearSearch={() => { setSearchQuery(''); setCurrentView('home'); }} 
          currentView="admin"
          onViewChange={(view) => { setSearchQuery(''); setCurrentView(view); }}
          currentProfile={null}
          onLogout={() => {}}
        />
        <AdminArea />
      </div>
    );
  }

  if (!currentProfile) {
    return (
      <ProfileScreen 
        profiles={profiles} 
        onSelectProfile={setCurrentProfile} 
        onAddProfile={handleAddProfile} 
        onDeleteProfile={handleDeleteProfile}
      />
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white overflow-x-hidden pb-12">
      <Navbar 
        onSearch={handleSearch} 
        onClearSearch={() => { setSearchQuery(''); setCurrentView('home'); }} 
        currentView={currentView}
        onViewChange={(view) => { setSearchQuery(''); setCurrentView(view); }}
        currentProfile={currentProfile}
        onLogout={() => setCurrentProfile(null)}
      />
      
      {error && (
        <div className="pt-24 px-8">
          <div className="bg-red-900/50 border border-red-500 text-red-200 p-4 rounded-md">
            {error}
          </div>
        </div>
      )}
      
      {!error && (
        <>
          {currentView === 'home' && isInitialLoadDone && (
            <>
              <Hero movie={heroMovie} onPlay={handleMovieSelect} onMoreInfo={setInfoMovie} />
              <div className="py-8 relative z-20">
                {currentProfile.continueWatching && currentProfile.continueWatching.length > 0 && (
                  <MovieRow title={`Continue Watching for ${currentProfile.name}`} movies={currentProfile.continueWatching} onMovieClick={handleMovieSelect} onMoreInfo={setInfoMovie} />
                )}
                <MovieRow title="Trending Now" movies={trending} onMovieClick={handleMovieSelect} onMoreInfo={setInfoMovie} />
                <MovieRow title="Popular" movies={popular} onMovieClick={handleMovieSelect} onMoreInfo={setInfoMovie} />
                <MovieRow title="Top Rated" movies={topRated} onMovieClick={handleMovieSelect} onMoreInfo={setInfoMovie} />
                <MovieRow title="Action Packed" movies={actionMovies} onMovieClick={handleMovieSelect} onMoreInfo={setInfoMovie} />
                <MovieRow title="Comedies" movies={comedyMovies} onMovieClick={handleMovieSelect} onMoreInfo={setInfoMovie} />
              </div>
            </>
          )}

          {currentView === 'movies' && (
            <InfiniteGrid 
              key="movies"
              title="Movies"
              fetchMore={fetchMovies} 
              onMovieClick={handleMovieSelect} 
              onMoreInfo={setInfoMovie}
            />
          )}

          {currentView === 'tv' && (
            <InfiniteGrid 
              key="tv"
              title="TV Shows"
              fetchMore={fetchTvShows} 
              onMovieClick={handleMovieSelect} 
              onMoreInfo={setInfoMovie}
            />
          )}

          {currentView === 'latest' && (
            <InfiniteGrid 
              key="latest"
              title="Latest"
              fetchMore={fetchLatest} 
              onMovieClick={handleMovieSelect} 
              onMoreInfo={setInfoMovie}
            />
          )}

          {currentView === 'search' && searchQuery && (
            <InfiniteGrid 
              key={`search-${searchQuery}`}
              title={`Search Results for "${searchQuery}"`}
              fetchMore={(page) => searchMovies(searchQuery, page)} 
              onMovieClick={handleMovieSelect} 
              onMoreInfo={setInfoMovie}
            />
          )}
          {currentView === "admin" && (
            <AdminArea />
          )}
        </>
      )}

      {infoMovie && (
        <InfoModal movie={infoMovie} onClose={() => setInfoMovie(null)} onPlay={handleMovieSelect} />
      )}

      {selectedMovie && (
        <PlayerModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
      )}
    </div>
  );
}
