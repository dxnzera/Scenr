import { GetBrowseCatalogUseCase } from "./use-cases/GetBrowseCatalogUseCase";
import { GetHomeSectionsUseCase } from "./use-cases/GetHomeSectionsUseCase";
import { GetMovieDetailsUseCase } from "./use-cases/GetMovieDetailsUseCase";
import { SearchMoviesUseCase } from "./use-cases/SearchMoviesUseCase";
import { WatchlistManager } from "./WatchlistManager";
import { FallbackMovieRepository } from "../../infrastructure/movies/FallbackMovieRepository";
import { RemoteMovieRepository } from "../../infrastructure/movies/RemoteMovieRepository";

export class MovieApplication {
  readonly watchlistManager = new WatchlistManager();
  readonly repository = new RemoteMovieRepository(new FallbackMovieRepository());
  readonly getHomeSections = new GetHomeSectionsUseCase(this.repository);
  readonly getBrowseCatalog = new GetBrowseCatalogUseCase(this.repository);
  readonly getMovieDetails = new GetMovieDetailsUseCase(this.repository);
  readonly searchMovies = new SearchMoviesUseCase(this.repository);

  constructor() {
    this.repository.seedCache(this.watchlistManager.getMovies());
  }
}

let movieApplication: MovieApplication | null = null;

export function getMovieApplication() {
  if (!movieApplication) {
    movieApplication = new MovieApplication();
  }

  return movieApplication;
}
