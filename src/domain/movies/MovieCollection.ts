import { Movie } from "./Movie";
import { type MovieKind } from "./Movie";

export class MovieCollection {
  constructor(private readonly items: Movie[]) {}

  static empty() {
    return new MovieCollection([]);
  }

  get all(): Movie[] {
    return [...this.items];
  }

  get size(): number {
    return this.items.length;
  }

  first(): Movie | null {
    return this.items[0] ?? null;
  }

  featured(): Movie | null {
    return this.items.find((movie) => movie.featured) ?? this.first();
  }

  take(limit: number): Movie[] {
    return this.items.slice(0, limit);
  }

  sortByLatest(): MovieCollection {
    return new MovieCollection(
      [...this.items].sort((left, right) => right.yearNumber - left.yearNumber),
    );
  }

  filterByGenre(genre: string): MovieCollection {
    return new MovieCollection(this.items.filter((movie) => movie.hasGenre(genre)));
  }

  filterByKind(kind: MovieKind): MovieCollection {
    return new MovieCollection(this.items.filter((movie) => movie.isKind(kind)));
  }

  search(query: string): MovieCollection {
    return new MovieCollection(this.items.filter((movie) => movie.matchesQuery(query)));
  }

  relatedTo(target: Movie, limit = 6): MovieCollection {
    return new MovieCollection(
      this.items
        .filter(
          (movie) =>
            movie.id !== target.id &&
            movie.genres.some((genre) => target.hasGenre(genre)),
        )
        .slice(0, limit),
    );
  }

  genres(): string[] {
    return [
      "Todos",
      ...new Set(this.items.flatMap((movie) => movie.genres).filter(Boolean)),
    ];
  }

  uniqueById(): MovieCollection {
    const uniqueItems = new Map<string, Movie>();

    this.items.forEach((movie) => {
      if (!uniqueItems.has(movie.id)) {
        uniqueItems.set(movie.id, movie);
      }
    });

    return new MovieCollection([...uniqueItems.values()]);
  }
}
