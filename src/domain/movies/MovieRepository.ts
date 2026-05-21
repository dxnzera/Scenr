import { type MovieKind } from "./Movie";
import { Movie } from "./Movie";
import { MovieCollection } from "./MovieCollection";

export interface MovieSearchCriteria {
  query?: string;
  genre?: string;
  type?: "movie" | "tv";
  limit?: number;
}

export interface HomeSectionConfig {
  title: string;
  query: string;
  type?: MovieKind;
}

export interface HomeSection {
  title: string;
  movies: Movie[];
}

export interface MovieRepository {
  search(criteria?: MovieSearchCriteria): Promise<MovieCollection>;
  findById(id: string): Promise<Movie | null>;
}
