import { MovieCollection } from "../../domain/movies/MovieCollection";
import { Movie } from "../../domain/movies/Movie";
import {
  type MovieRepository,
  type MovieSearchCriteria,
} from "../../domain/movies/MovieRepository";
import { BrowserMovieCache } from "./BrowserMovieCache";
import { ImdbApiClient } from "./ImdbApiClient";
import { ImdbMovieMapper } from "./ImdbMovieMapper";

export class RemoteMovieRepository implements MovieRepository {
  private readonly apiClient = new ImdbApiClient();
  private readonly mapper = new ImdbMovieMapper();
  private readonly cache = new Map<string, Movie>();
  private readonly browserCache = new BrowserMovieCache();
  private readonly inFlightSearches = new Map<string, Promise<MovieCollection>>();
  private readonly inFlightDetails = new Map<string, Promise<Movie | null>>();

  constructor(private readonly fallbackRepository: MovieRepository) {}

  async search(criteria?: MovieSearchCriteria): Promise<MovieCollection> {
    const searchKey = this.serializeCriteria(criteria);
    const cachedCollection = this.browserCache.getSearch(criteria);

    if (cachedCollection) {
      this.cacheMovies(cachedCollection.all);
      return cachedCollection.uniqueById();
    }

    const inFlightSearch = this.inFlightSearches.get(searchKey);

    if (inFlightSearch) {
      return inFlightSearch;
    }

    if (!this.apiClient.isConfigured) {
      return this.fallbackRepository.search(criteria);
    }

    const request = (async () => {
      try {
        const payload = await this.apiClient.search(criteria);
        const movies = this.mapper.toMovieCollection(payload);
        this.cacheMovies(movies);

        if (!movies.length) {
          return this.fallbackRepository.search(criteria);
        }

        this.browserCache.setSearch(criteria, movies);
        return new MovieCollection(movies).uniqueById();
      } catch {
        return this.fallbackRepository.search(criteria);
      } finally {
        this.inFlightSearches.delete(searchKey);
      }
    })();

    this.inFlightSearches.set(searchKey, request);
    return request;
  }

  async findById(id: string) {
    const cachedMovie = this.cache.get(id);

    if (cachedMovie) {
      return cachedMovie;
    }

    const persistedMovie = this.browserCache.getMovie(id);

    if (persistedMovie) {
      this.cache.set(id, persistedMovie);
      return persistedMovie;
    }

    const inFlightDetail = this.inFlightDetails.get(id);

    if (inFlightDetail) {
      return inFlightDetail;
    }

    if (!this.apiClient.isConfigured) {
      return this.fallbackRepository.findById(id);
    }

    const request = (async () => {
      try {
        const payload = await this.apiClient.getById(id);
        const movie = this.mapper.toMovie(payload);

        if (movie) {
          this.cache.set(id, movie);
          this.cache.set(movie.id, movie);
          this.browserCache.setMovie(movie);
        }

        return movie ?? this.fallbackRepository.findById(id);
      } catch {
        return this.fallbackRepository.findById(id);
      } finally {
        this.inFlightDetails.delete(id);
      }
    })();

    this.inFlightDetails.set(id, request);
    return request;
  }

  private cacheMovies(movies: Movie[]) {
    movies.forEach((movie) => {
      this.cache.set(movie.id, movie);
    });
  }

  seedCache(movies: Movie[]) {
    this.cacheMovies(movies);
    this.browserCache.seedMovies(movies);
  }

  private serializeCriteria(criteria?: MovieSearchCriteria) {
    return JSON.stringify({
      genre: criteria?.genre ?? "",
      limit: criteria?.limit ?? 0,
      query: criteria?.query?.trim().toLowerCase() ?? "",
      type: criteria?.type ?? "all",
    });
  }
}
