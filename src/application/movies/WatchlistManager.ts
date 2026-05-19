import { Movie, type MovieProps } from "../../domain/movies/Movie";

type WatchlistListener = (ids: string[]) => void;

export class WatchlistManager {
  private movies = new Map<string, Movie>();
  private listeners = new Set<WatchlistListener>();
  private readonly storageKey: string;

  constructor(storageKey = "movie-streaming-watchlist") {
    this.storageKey = storageKey;
    this.hydrate();
  }

  getIds(): string[] {
    return [...this.movies.keys()];
  }

  getMovies(): Movie[] {
    return [...this.movies.values()];
  }

  has(id: string): boolean {
    return this.movies.has(id);
  }

  toggle(movie: Movie | MovieProps): string[] {
    const normalizedMovie = movie instanceof Movie ? movie : new Movie(movie);

    if (this.movies.has(normalizedMovie.id)) {
      this.movies.delete(normalizedMovie.id);
    } else {
      this.movies.set(normalizedMovie.id, normalizedMovie);
    }

    this.persist();
    this.notify();

    return this.getIds();
  }

  subscribe(listener: WatchlistListener) {
    this.listeners.add(listener);

    return () => {
      this.listeners.delete(listener);
    };
  }

  private hydrate() {
    if (typeof window === "undefined") {
      return;
    }

    try {
      const rawIds = window.localStorage.getItem(this.storageKey);
      const parsedMovies = rawIds ? (JSON.parse(rawIds) as MovieProps[]) : [];
      this.movies = new Map(
        parsedMovies.map((movie) => {
          const normalizedMovie = new Movie(movie);
          return [normalizedMovie.id, normalizedMovie];
        }),
      );
    } catch {
      this.movies = new Map();
    }
  }

  private persist() {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(
      this.storageKey,
      JSON.stringify(this.getMovies().map((movie) => movie.toProps())),
    );
  }

  private notify() {
    const currentIds = this.getIds();
    this.listeners.forEach((listener) => listener(currentIds));
  }
}
