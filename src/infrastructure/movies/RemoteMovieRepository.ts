import { MovieCollection } from "../../domain/movies/MovieCollection";
import { Movie } from "../../domain/movies/Movie";
import {
  type MovieRepository,
  type MovieSearchCriteria,
} from "../../domain/movies/MovieRepository";
import { ImdbApiClient } from "./ImdbApiClient";
import { ImdbMovieMapper } from "./ImdbMovieMapper";

export class RemoteMovieRepository implements MovieRepository {
  private readonly apiClient = new ImdbApiClient();
  private readonly mapper = new ImdbMovieMapper();
  private readonly cache = new Map<string, Movie>();

  constructor(private readonly fallbackRepository: MovieRepository) {}

  async search(criteria?: MovieSearchCriteria): Promise<MovieCollection> {
    if (!this.apiClient.isConfigured) {
      return this.fallbackRepository.search(criteria);
    }

    try {
      const payload = await this.apiClient.search(criteria);
      const movies = this.mapper.toMovieCollection(payload);
      this.cacheMovies(movies);

      if (!movies.length) {
        return this.fallbackRepository.search(criteria);
      }

      return new MovieCollection(movies).uniqueById();
    } catch {
      return this.fallbackRepository.search(criteria);
    }
  }

  async findById(id: string) {
    const cachedMovie = this.cache.get(id);

    if (cachedMovie) {
      return cachedMovie;
    }

    if (!this.apiClient.isConfigured) {
      return this.fallbackRepository.findById(id);
    }

    try {
      const payload = await this.apiClient.getById(id);
      const movie = this.mapper.toMovie(payload);

      if (movie) {
        this.cache.set(id, movie);
        this.cache.set(movie.id, movie);
      }

      return movie ?? this.fallbackRepository.findById(id);
    } catch {
      return this.fallbackRepository.findById(id);
    }
  }

  private cacheMovies(movies: Movie[]) {
    movies.forEach((movie) => {
      this.cache.set(movie.id, movie);
    });
  }

  seedCache(movies: Movie[]) {
    this.cacheMovies(movies);
  }
}
