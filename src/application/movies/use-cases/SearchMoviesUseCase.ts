import { type MovieKind } from "../../../domain/movies/Movie";
import { type MovieRepository } from "../../../domain/movies/MovieRepository";

export class SearchMoviesUseCase {
  constructor(private readonly movieRepository: MovieRepository) {}

  execute(query: string, type?: MovieKind) {
    return this.movieRepository.search({
      query,
      type,
      limit: 24,
    });
  }
}
