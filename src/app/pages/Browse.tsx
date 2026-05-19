import { MovieCard } from "../components/MovieCard";
import { useEffect, useMemo, useState } from "react";
import { getMovieApplication } from "../../application/movies/MovieApplication";
import { MovieCollection } from "../../domain/movies/MovieCollection";
import { Button } from "../components/ui/button";

export function Browse() {
  const application = useMemo(() => getMovieApplication(), []);
  const [selectedGenre, setSelectedGenre] = useState<string>("Todos");
  const [catalog, setCatalog] = useState(MovieCollection.empty());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadCatalog() {
      try {
        const collection = await application.getBrowseCatalog.execute([
          "Action",
          "Drama",
          "Thriller",
          "Adventure",
          "Sci-Fi",
          "Mystery",
        ]);

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
  }, [application]);

  const genres = catalog.genres();
  const filteredMovies = catalog.filterByGenre(selectedGenre).all;

  return (
    <div className="min-h-screen pb-12 pt-32">
      <div className="mx-auto max-w-[1400px] px-6">
        <div className="space-y-8">
          <div>
            <h1 className="mb-2 text-4xl font-semibold">Explorar catálogo</h1>
            <p className="text-muted-foreground">
              Gêneros e cards do app principal, agora abastecidos pela estrutura do
              `scenr`.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {genres.map((genre) => (
              <Button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                variant={selectedGenre === genre ? "secondary" : "glass"}
                className="px-6"
              >
                {genre}
              </Button>
            ))}
          </div>

          {loading && (
            <div className="text-muted-foreground">Carregando catálogo...</div>
          )}

          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filteredMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
