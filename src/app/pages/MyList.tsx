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
    <div className="min-h-screen pb-16 pt-8 md:pb-12 md:pt-10">
      <div className="mx-auto max-w-[1480px] px-4 md:px-6">
        <div className="content-fade-in space-y-7 md:space-y-8">
          <div>
            <h1 className="mb-2 text-3xl font-semibold md:text-4xl">Minha Lista</h1>
            <p className="text-muted-foreground">
              {movies.length} título{movies.length !== 1 ? "s" : ""} salvo{movies.length !== 1 ? "s" : ""}
            </p>
          </div>

          {movies.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-6 lg:grid-cols-4 xl:grid-cols-5">
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          ) : (
            <div className="liquid-glass rounded-[24px] px-5 py-14 text-center md:rounded-[32px] md:py-20">
              <p className="text-base text-white/70 md:text-lg">
                Sua lista está vazia. Salve títulos na Home, na busca ou na página de detalhes.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
