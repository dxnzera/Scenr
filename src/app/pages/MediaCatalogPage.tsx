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
    <div className="min-h-screen pb-14 pt-10">
      <div className="mx-auto max-w-[1480px] px-6">
        <div className="content-fade-in space-y-8">
          <div className="panel-surface relative overflow-hidden rounded-[36px] border border-white/10 p-8 backdrop-blur-xl md:p-10">
            <div className="panel-accent-glow absolute inset-0" />
            <div className="relative max-w-3xl space-y-4">
              <span className="text-xs uppercase tracking-[0.45em] text-white/55">
                {eyebrow}
              </span>
              <h1 className="text-4xl font-semibold text-white md:text-5xl">
                {title}
              </h1>
              <p className="max-w-2xl text-base leading-8 text-white/68 md:text-lg">
                {description}
              </p>
              <div className="flex flex-wrap gap-3 pt-3">
                {genres.map((genre) => (
                  <Button
                    key={genre}
                    onClick={() => setSelectedGenre(genre)}
                    variant={selectedGenre === genre ? "hero" : "glass"}
                    className="px-5"
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

          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filteredMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>

          {!loading && !filteredMovies.length && (
            <div className="liquid-glass rounded-[30px] px-8 py-10 text-center text-white/72">
              Nenhum titulo apareceu nesse filtro agora.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
