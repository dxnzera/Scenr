import { MovieCollection } from "../../../domain/movies/MovieCollection";
import { type Movie, type MovieKind } from "../../../domain/movies/Movie";
import { type MovieRepository } from "../../../domain/movies/MovieRepository";

export class GetBrowseCatalogUseCase {
  constructor(private readonly movieRepository: MovieRepository) {}

  async execute(queries: string[], type: MovieKind = "movie"): Promise<MovieCollection> {
    const currentYear = new Date().getFullYear();
    const popularCollection = (await this.movieRepository.search({
      type,
      limit: 80,
    }))
      .uniqueById()
      .sortByLatest();

    const collections = await Promise.all(
      queries.map((query) =>
        this.movieRepository.search({
          genre: query,
          type,
          limit: 20,
        }),
      ),
    );

    const recentPopularMovies = this.pickRecentMovies(popularCollection.all, currentYear, 30);
    const supplementalMovies = collections
      .flatMap((collection) => collection.uniqueById().sortByLatest().all)
      .filter((movie) => movie.yearNumber >= currentYear - 8);

    return new MovieCollection([...recentPopularMovies, ...supplementalMovies]).uniqueById();
  }

  private pickRecentMovies(movies: Movie[], currentYear: number, limit: number) {
    const recentThresholds = [currentYear - 2, currentYear - 4, currentYear - 8];

    for (const threshold of recentThresholds) {
      const recentMovies = movies.filter((movie) => movie.yearNumber >= threshold).slice(0, limit);

      if (recentMovies.length >= Math.min(12, limit)) {
        return recentMovies;
      }
    }

    return movies.slice(0, limit);
  }
}
