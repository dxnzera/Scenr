import { MovieCard } from "../components/MovieCard";
import { useEffect, useMemo, useState } from "react";
import { getMovieApplication } from "../../application/movies/MovieApplication";
import { Movie } from "../../domain/movies/Movie";
import { useWatchlist } from "../hooks/useWatchlist";

export function MyList() {
  const application = useMemo(() => getMovieApplication(), []);
  const watchlist = useWatchlist();
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    let active = true;

    async function loadWatchlist() {
      const storedMovies = new Map(
        application.watchlistManager.getMovies().map((movie) => [movie.id, movie] as const),
      );
      const loadedMovies = await Promise.all(
        watchlist.ids.map(async (id) => {
          const detailedMovie = await application.getMovieDetails.execute(id);
          return detailedMovie ?? storedMovies.get(id) ?? null;
        }),
      );

      if (active) {
        setMovies(loadedMovies.filter((movie): movie is Movie => movie !== null));
      }
    }

    void loadWatchlist();

    return () => {
      active = false;
    };
  }, [application, watchlist.ids]);

  return (
    <div className="min-h-screen pb-12 pt-10">
      <div className="mx-auto max-w-[1480px] px-6">
        <div className="content-fade-in space-y-8">
          <div>
            <h1 className="mb-2 text-4xl font-semibold">Minha Lista</h1>
            <p className="text-muted-foreground">
              {movies.length} título{movies.length !== 1 ? "s" : ""} salvo{movies.length !== 1 ? "s" : ""}
            </p>
          </div>

          {movies.length > 0 ? (
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          ) : (
            <div className="liquid-glass rounded-[32px] py-20 text-center">
              <p className="text-lg text-white/70">
                Sua lista está vazia. Salve títulos na Home, na busca ou na página de detalhes.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
