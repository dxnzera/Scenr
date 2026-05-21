import { Movie } from "../../domain/movies/Movie";
import { MovieCollection } from "../../domain/movies/MovieCollection";
import {
  type MovieRepository,
  type MovieSearchCriteria,
} from "../../domain/movies/MovieRepository";
import { fallbackMovieSeeds } from "./fallbackMovieSeeds";

export class FallbackMovieRepository implements MovieRepository {
  private readonly collection = new MovieCollection(
    fallbackMovieSeeds.map((seed) => new Movie(seed)),
  );

  async search(criteria?: MovieSearchCriteria): Promise<MovieCollection> {
    const kindFiltered = criteria?.type
      ? this.collection.filterByKind(criteria.type)
      : this.collection;

    const genreFiltered = criteria?.genre
      ? kindFiltered.filterByGenre(criteria.genre)
      : kindFiltered;

    const searchedCollection = criteria?.query
      ? genreFiltered.search(criteria.query)
      : genreFiltered;

    const limitedMovies = criteria?.limit
      ? searchedCollection.take(criteria.limit)
      : searchedCollection.all;

    return new MovieCollection(limitedMovies);
  }

  async findById(id: string): Promise<Movie | null> {
    return this.collection.all.find((movie) => movie.id === id) ?? null;
  }
}
