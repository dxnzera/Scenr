import { useEffect, useMemo, useState } from "react";
import { getMovieApplication } from "../../application/movies/MovieApplication";
import { Movie } from "../../domain/movies/Movie";

export function useWatchlist() {
  const application = useMemo(() => getMovieApplication(), []);
  const [ids, setIds] = useState<string[]>(() =>
    application.watchlistManager.getIds(),
  );

  useEffect(() => application.watchlistManager.subscribe(setIds), [application]);

  return {
    ids,
    movies: application.watchlistManager.getMovies(),
    count: ids.length,
    has: (id: string) => application.watchlistManager.has(id),
    toggle: (movie: Movie) => application.watchlistManager.toggle(movie),
  };
}
