import {
  type HomeSection,
  type HomeSectionConfig,
  type MovieRepository,
} from "../../../domain/movies/MovieRepository";
import { type Movie } from "../../../domain/movies/Movie";

export class GetHomeSectionsUseCase {
  constructor(private readonly movieRepository: MovieRepository) {}

  async execute(configurations: HomeSectionConfig[]): Promise<HomeSection[]> {
    const currentYear = new Date().getFullYear();
    const popularCollection = (await this.movieRepository.search({
      type: "movie",
      limit: 60,
    }))
      .uniqueById()
      .sortByLatest();

    const sections = await Promise.all(
      configurations.map(async ({ title, query }) => {
        if (query === "Em alta") {
          return {
            title,
            movies: this.pickRecentMovies(popularCollection.all, currentYear),
          };
        }

        const collection = popularCollection.filterByGenre(query);
        const recentPopularMovies = this.pickRecentMovies(collection.all, currentYear);

        if (recentPopularMovies.length >= 8) {
          return {
            title,
            movies: recentPopularMovies,
          };
        }

        const genreCollection = (await this.movieRepository.search({
          genre: query,
          type: "movie",
          limit: 24,
        }))
          .uniqueById()
          .sortByLatest();

        return {
          title,
          movies: this.pickRecentMovies(genreCollection.all, currentYear),
        };
      }),
    );

    return sections.filter((section) => section.movies.length > 0);
  }

  private pickRecentMovies(movies: Movie[], currentYear: number) {
    const recentThresholds = [currentYear - 2, currentYear - 4, currentYear - 8];

    for (const threshold of recentThresholds) {
      const recentMovies = movies.filter((movie) => movie.yearNumber >= threshold).slice(0, 10);

      if (recentMovies.length >= 6) {
        return recentMovies;
      }
    }

    return movies.slice(0, 10);
  }
}
