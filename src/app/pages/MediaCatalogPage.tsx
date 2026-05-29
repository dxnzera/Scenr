import { useEffect, useMemo, useState } from "react";
import { type MovieKind } from "../../domain/movies/Movie";
import { MovieCollection } from "../../domain/movies/MovieCollection";
import { getMovieApplication } from "../../application/movies/MovieApplication";
import { MovieCard } from "../components/MovieCard";
import { Button } from "../components/ui/button";

const genreQueriesByType: Record<MovieKind, string[]> = {
  movie: ["Action", "Drama", "Thriller", "Adventure", "Sci-Fi", "Mystery"],
  tv: ["Drama", "Thriller", "Mystery", "Sci-Fi", "Adventure", "Comedy"],
};

interface MediaCatalogPageProps {
  eyebrow: string;
  title: string;
  description: string;
  type: MovieKind;
}

export function MediaCatalogPage({
  eyebrow,
  title,
  description,
  type,
}: MediaCatalogPageProps) {
  const application = useMemo(() => getMovieApplication(), []);
  const [selectedGenre, setSelectedGenre] = useState<string>("Todos");
  const [catalog, setCatalog] = useState(MovieCollection.empty());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setSelectedGenre("Todos");

    async function loadCatalog() {
      try {
        const collection = await application.getBrowseCatalog.execute(
          genreQueriesByType[type],
          type,
        );

        if (active) {
          setCatalog(collection);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadCatalog();

    return () => {
      active = false;
    };
  }, [application, type]);

  const genres = catalog.genres();
  const filteredMovies = catalog.filterByGenre(selectedGenre).all;

  return (
    <div className="min-h-screen pb-16 pt-8 md:pb-14 md:pt-10">
      <div className="mx-auto max-w-[1480px] px-4 md:px-6">
        <div className="content-fade-in space-y-7 md:space-y-8">
          <div className="panel-surface relative overflow-hidden rounded-[28px] border border-white/10 p-5 backdrop-blur-xl md:rounded-[36px] md:p-10">
            <div className="panel-accent-glow absolute inset-0" />
            <div className="relative max-w-3xl space-y-3 md:space-y-4">
              <span className="text-[11px] uppercase tracking-[0.32em] text-white/55 md:text-xs md:tracking-[0.45em]">
                {eyebrow}
              </span>
              <h1 className="text-3xl font-semibold leading-tight text-white md:text-5xl md:leading-normal">
                {title}
              </h1>
              <p className="max-w-2xl text-sm leading-7 text-white/68 md:text-lg md:leading-8">
                {description}
              </p>
              <div className="flex flex-wrap gap-2 pt-2 md:gap-3 md:pt-3">
                {genres.map((genre) => (
                  <Button
                    key={genre}
                    onClick={() => setSelectedGenre(genre)}
                    variant={selectedGenre === genre ? "hero" : "glass"}
                    className="px-4 md:px-5"
                  >
                    {genre}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {loading && (
            <div className="text-sm text-white/58">Carregando catalogo...</div>
          )}

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-6 lg:grid-cols-4 xl:grid-cols-5">
            {filteredMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>

          {!loading && !filteredMovies.length && (
            <div className="liquid-glass rounded-[24px] px-5 py-8 text-center text-white/72 md:rounded-[30px] md:px-8 md:py-10">
              Nenhum titulo apareceu nesse filtro agora.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
