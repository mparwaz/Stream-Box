import { Movie } from './types';

const BASE_URL = 'https://api.themoviedb.org/3';

const getApiKey = () => {
  return localStorage.getItem('streambox_tmdb_api_key') || '';
};

const buildUrl = (path: string) => {
  const apiKey = getApiKey();
  const separator = path.includes('?') ? '&' : '?';
  return `${BASE_URL}${path}${separator}api_key=${apiKey}`;
};

export const fetchTrending = async (page = 1): Promise<Movie[]> => {
  const res = await fetch(buildUrl(`/trending/all/day?page=${page}`));
  if (!res.ok) throw new Error('Failed to fetch trending');
  const data = await res.json();
  return data.results || [];
};

export const fetchPopular = async (page = 1): Promise<Movie[]> => {
  const res = await fetch(buildUrl(`/movie/popular?page=${page}`));
  if (!res.ok) throw new Error('Failed to fetch popular');
  const data = await res.json();
  return data.results || [];
};

export const fetchTopRated = async (page = 1): Promise<Movie[]> => {
  const res = await fetch(buildUrl(`/movie/top_rated?page=${page}`));
  if (!res.ok) throw new Error('Failed to fetch top rated');
  const data = await res.json();
  return data.results || [];
};

export const fetchActionMovies = async (page = 1): Promise<Movie[]> => {
  const res = await fetch(buildUrl(`/discover/movie?with_genres=28&page=${page}`));
  if (!res.ok) throw new Error('Failed to fetch action movies');
  const data = await res.json();
  return data.results || [];
};

export const fetchComedyMovies = async (page = 1): Promise<Movie[]> => {
  const res = await fetch(buildUrl(`/discover/movie?with_genres=35&page=${page}`));
  if (!res.ok) throw new Error('Failed to fetch comedy movies');
  const data = await res.json();
  return data.results || [];
};

export const fetchMovies = async (page = 1): Promise<Movie[]> => {
  const res = await fetch(buildUrl(`/discover/movie?sort_by=popularity.desc&page=${page}`));
  if (!res.ok) throw new Error('Failed to fetch movies');
  const data = await res.json();
  return data.results || [];
};

export const fetchTvShows = async (page = 1): Promise<Movie[]> => {
  const res = await fetch(buildUrl(`/discover/tv?sort_by=popularity.desc&page=${page}`));
  if (!res.ok) throw new Error('Failed to fetch tv shows');
  const data = await res.json();
  return data.results || [];
};

export const fetchLatest = async (page = 1): Promise<Movie[]> => {
  const res = await fetch(buildUrl(`/movie/now_playing?page=${page}`));
  if (!res.ok) throw new Error('Failed to fetch latest');
  const data = await res.json();
  return data.results || [];
};

export const fetchTvDetails = async (id: number): Promise<any> => {
  const res = await fetch(buildUrl(`/tv/${id}`));
  if (!res.ok) throw new Error('Failed to fetch tv details');
  return await res.json();
};

export const fetchTvSeason = async (id: number, seasonNumber: number): Promise<any> => {
  const res = await fetch(buildUrl(`/tv/${id}/season/${seasonNumber}`));
  if (!res.ok) throw new Error('Failed to fetch tv season');
  return await res.json();
};

export const searchMovies = async (query: string, page = 1): Promise<Movie[]> => {
  const res = await fetch(buildUrl(`/search/multi?query=${encodeURIComponent(query)}&page=${page}`));
  if (!res.ok) throw new Error('Failed to search');
  const data = await res.json();
  // Filter out people from multi-search
  return data.results.filter((item: any) => item.media_type !== 'person') || [];
};

export const getImageUrl = (path: string | null, size: 'w500' | 'original' = 'w500') => {
  if (!path) return '';
  return `https://image.tmdb.org/t/p/${size}${path}`;
};
