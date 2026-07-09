export interface Movie {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  media_type?: string;
}

export interface VideoProvider {
  name: string;
  url: string;
}

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  continueWatching?: Movie[];
  myList?: Movie[];
}
