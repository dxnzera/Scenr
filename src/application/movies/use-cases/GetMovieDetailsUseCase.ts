import { type MovieRepository } from "../../../domain/movies/MovieRepository";

export class GetMovieDetailsUseCase {
  constructor(private readonly movieRepository: MovieRepository) {}

  execute(id: string) {
    return this.movieRepository.findById(id);
  }
}
