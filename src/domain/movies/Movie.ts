export type MovieKind = "movie" | "tv";

export interface MovieProps {
  id: string;
  title: string;
  description: string;
  year: string;
  rating: string;
  duration: string;
  genres: string[];
  poster: string;
  backdrop: string;
  featured?: boolean;
  kind?: MovieKind;
  imdbUrl?: string;
  trailerUrl?: string;
}

export class Movie {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly year: string;
  readonly rating: string;
  readonly duration: string;
  readonly genres: string[];
  readonly poster: string;
  readonly backdrop: string;
  readonly featured: boolean;
  readonly kind: MovieKind;
  readonly imdbUrl?: string;
  readonly trailerUrl?: string;

  constructor(props: MovieProps) {
    this.id = props.id;
    this.title = props.title;
    this.description = props.description;
    this.year = props.year;
    this.rating = props.rating;
    this.duration = props.duration;
    this.genres = props.genres;
    this.poster = props.poster;
    this.backdrop = props.backdrop;
    this.featured = props.featured ?? false;
    this.kind = props.kind ?? "movie";
    this.imdbUrl = props.imdbUrl;
    this.trailerUrl = props.trailerUrl;
  }

  matchesQuery(query: string): boolean {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return true;
    }

    return [
      this.title,
      this.description,
      this.year,
      ...this.genres,
    ].some((value) => value.toLowerCase().includes(normalizedQuery));
  }

  hasGenre(genre: string): boolean {
    if (genre === "Todos") {
      return true;
    }

    return this.genres.some(
      (currentGenre) => currentGenre.toLowerCase() === genre.toLowerCase(),
    );
  }

  get metadata(): string[] {
    return [this.year, this.rating, this.duration].filter(Boolean);
  }

  get yearNumber(): number {
    return Number(this.year) || 0;
  }

  toProps(): MovieProps {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      year: this.year,
      rating: this.rating,
      duration: this.duration,
      genres: [...this.genres],
      poster: this.poster,
      backdrop: this.backdrop,
      featured: this.featured,
      kind: this.kind,
      imdbUrl: this.imdbUrl,
      trailerUrl: this.trailerUrl,
    };
  }
}
