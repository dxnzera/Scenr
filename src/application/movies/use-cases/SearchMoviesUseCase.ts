import { type MovieRepository } from "../../../domain/movies/MovieRepository";

export class SearchMoviesUseCase {
  constructor(private readonly movieRepository: MovieRepository) {}

  execute(query: string) {
    return this.movieRepository.search({
      query,
      type: "movie",
      limit: 24,
    });
  }
}
