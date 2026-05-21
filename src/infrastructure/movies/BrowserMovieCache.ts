import { Movie, type MovieProps } from "../../domain/movies/Movie";
import { MovieCollection } from "../../domain/movies/MovieCollection";
import { type MovieSearchCriteria } from "../../domain/movies/MovieRepository";

interface CacheSnapshot {
  details: Record<string, CacheEntry<MovieProps>>;
  searches: Record<string, CacheEntry<MovieProps[]>>;
}

interface CacheEntry<T> {
  expiresAt: number;
  value: T;
}

const EMPTY_SNAPSHOT: CacheSnapshot = {
  details: {},
  searches: {},
};

export class BrowserMovieCache {
  private readonly detailEntries = new Map<string, CacheEntry<MovieProps>>();
  private readonly searchEntries = new Map<string, CacheEntry<MovieProps[]>>();

  constructor(
    private readonly storageKey = "scenr.movie-cache.v1",
    private readonly detailTtlMs = 1000 * 60 * 60 * 12,
    private readonly searchTtlMs = 1000 * 60 * 60 * 4,
  ) {
    this.hydrate();
  }

  getMovie(id: string): Movie | null {
    const entry = this.detailEntries.get(id);

    if (!entry || this.isExpired(entry.expiresAt)) {
      this.detailEntries.delete(id);
      this.persist();
      return null;
    }

    return new Movie(entry.value);
  }

  setMovie(movie: Movie) {
    this.writeMovie(movie);
    this.persist();
  }

  seedMovies(movies: Movie[]) {
    movies.forEach((movie) => this.writeMovie(movie));
    this.persist();
  }

  getSearch(criteria?: MovieSearchCriteria): MovieCollection | null {
    const key = this.serializeCriteria(criteria);
    const entry = this.searchEntries.get(key);

    if (!entry || this.isExpired(entry.expiresAt)) {
      this.searchEntries.delete(key);
      this.persist();
      return null;
    }

    return new MovieCollection(entry.value.map((movie) => new Movie(movie)));
  }

  setSearch(criteria: MovieSearchCriteria | undefined, movies: Movie[]) {
    const key = this.serializeCriteria(criteria);

    this.searchEntries.set(key, {
      value: movies.map((movie) => movie.toProps()),
      expiresAt: Date.now() + this.searchTtlMs,
    });

    movies.forEach((movie) => this.writeMovie(movie));
    this.persist();
  }

  private writeMovie(movie: Movie) {
    this.detailEntries.set(movie.id, {
      value: movie.toProps(),
      expiresAt: Date.now() + this.detailTtlMs,
    });
  }

  private hydrate() {
    if (typeof window === "undefined") {
      return;
    }

    try {
      const rawSnapshot = window.localStorage.getItem(this.storageKey);
      const snapshot = rawSnapshot
        ? (JSON.parse(rawSnapshot) as CacheSnapshot)
        : EMPTY_SNAPSHOT;

      this.loadEntries(snapshot.details, this.detailEntries);
      this.loadEntries(snapshot.searches, this.searchEntries);
      this.pruneExpiredEntries();
    } catch {
      this.detailEntries.clear();
      this.searchEntries.clear();
    }
  }

  private loadEntries<T>(
    entries: Record<string, CacheEntry<T>>,
    target: Map<string, CacheEntry<T>>,
  ) {
    Object.entries(entries).forEach(([key, entry]) => {
      if (!this.isExpired(entry.expiresAt)) {
        target.set(key, entry);
      }
    });
  }

  private pruneExpiredEntries() {
    this.detailEntries.forEach((entry, key) => {
      if (this.isExpired(entry.expiresAt)) {
        this.detailEntries.delete(key);
      }
    });

    this.searchEntries.forEach((entry, key) => {
      if (this.isExpired(entry.expiresAt)) {
        this.searchEntries.delete(key);
      }
    });

    this.persist();
  }

  private persist() {
    if (typeof window === "undefined") {
      return;
    }

    const snapshot: CacheSnapshot = {
      details: Object.fromEntries(this.detailEntries.entries()),
      searches: Object.fromEntries(this.searchEntries.entries()),
    };

    window.localStorage.setItem(this.storageKey, JSON.stringify(snapshot));
  }

  private serializeCriteria(criteria?: MovieSearchCriteria) {
    return JSON.stringify({
      genre: criteria?.genre ?? "",
      limit: criteria?.limit ?? 0,
      query: criteria?.query?.trim().toLowerCase() ?? "",
      type: criteria?.type ?? "all",
    });
  }

  private isExpired(expiresAt: number) {
    return expiresAt <= Date.now();
  }
}
