import { GetBrowseCatalogUseCase } from "./use-cases/GetBrowseCatalogUseCase";
import { GetHomeSectionsUseCase } from "./use-cases/GetHomeSectionsUseCase";
import { GetMovieDetailsUseCase } from "./use-cases/GetMovieDetailsUseCase";
import { SearchMoviesUseCase } from "./use-cases/SearchMoviesUseCase";
import { WatchlistManager } from "./WatchlistManager";
import { type HomeSection, type HomeSectionConfig } from "../../domain/movies/MovieRepository";
import { FallbackMovieRepository } from "../../infrastructure/movies/FallbackMovieRepository";
import { RemoteMovieRepository } from "../../infrastructure/movies/RemoteMovieRepository";

export const landingHomeSections: HomeSectionConfig[] = [
  { title: "Em alta agora", query: "Em alta", type: "movie" },
  { title: "Series em alta", query: "Em alta", type: "tv" },
  { title: "Noite de suspense", query: "Thriller", type: "movie" },
  { title: "Sci-fi para maratonar", query: "Sci-Fi", type: "tv" },
];

export class MovieApplication {
  readonly watchlistManager = new WatchlistManager();
  readonly repository = new RemoteMovieRepository(new FallbackMovieRepository());
  readonly getHomeSections = new GetHomeSectionsUseCase(this.repository);
  readonly getBrowseCatalog = new GetBrowseCatalogUseCase(this.repository);
  readonly getMovieDetails = new GetMovieDetailsUseCase(this.repository);
  readonly searchMovies = new SearchMoviesUseCase(this.repository);
  private homeBootstrapPromise: Promise<HomeSection[]> | null = null;

  constructor() {
    this.repository.seedCache(this.watchlistManager.getMovies());
  }

  warmHomeSections() {
    if (this.homeBootstrapPromise) {
      return this.homeBootstrapPromise;
    }

    this.homeBootstrapPromise = this.getHomeSections
      .execute(landingHomeSections)
      .catch((error) => {
        this.homeBootstrapPromise = null;
        throw error;
      });

    return this.homeBootstrapPromise;
  }
}

let movieApplication: MovieApplication | null = null;

export function getMovieApplication() {
  if (!movieApplication) {
    movieApplication = new MovieApplication();
  }

  return movieApplication;
}
