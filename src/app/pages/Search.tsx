import { useEffect, useMemo, useState } from "react";
import { MovieCard } from "../components/MovieCard";
import { LiquidSearchBar } from "../components/LiquidSearchBar";
import { getMovieApplication } from "../../application/movies/MovieApplication";
import { MovieCollection } from "../../domain/movies/MovieCollection";
import { useDebouncedValue } from "../hooks/useDebouncedValue";

export function Search() {
  const application = useMemo(() => getMovieApplication(), []);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(MovieCollection.empty());
  const [discovery, setDiscovery] = useState(MovieCollection.empty());
  const [loading, setLoading] = useState(false);
  const debouncedQuery = useDebouncedValue(query, 350);

  useEffect(() => {
    let active = true;

    async function loadDiscovery() {
      const collection = await application.getBrowseCatalog.execute([
        "Drama",
        "Adventure",
        "Sci-Fi",
      ]);

      if (active) {
        setDiscovery(collection);
      }
    }

    void loadDiscovery();

    return () => {
      active = false;
    };
  }, [application]);

  useEffect(() => {
    let active = true;

    async function runSearch() {
      if (!debouncedQuery.trim()) {
        setResults(MovieCollection.empty());
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const collection = await application.searchMovies.execute(debouncedQuery);

        if (active) {
          setResults(collection);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void runSearch();

    return () => {
      active = false;
    };
  }, [application, debouncedQuery]);

  return (
    <div className="min-h-screen pb-12 pt-32">
      <div className="mx-auto max-w-[1400px] px-6">
        <div className="space-y-10">
          <div className="max-w-3xl space-y-5">
            <span className="text-sm uppercase tracking-[0.4em] text-white/60">
              Busca
            </span>
            <h1 className="text-4xl font-semibold md:text-5xl">
              Encontre filmes com a pesquisa em liquid glass.
            </h1>
            <p className="max-w-2xl text-base text-muted-foreground md:text-lg">
              A interface ficou com o visual do app principal, mas agora a pesquisa usa a
              ideia do `scenr` com uma barra mais tátil e pronta para a API.
            </p>
            <LiquidSearchBar
              value={query}
              onChange={setQuery}
              placeholder="Pesquisar filmes, gêneros ou universos..."
              loading={loading}
            />
          </div>

          {query && (
            <div>
              <p className="mb-6 text-muted-foreground">
                {results.size} resultado{results.size !== 1 ? "s" : ""} para "{query}"
              </p>
              <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {results.all.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            </div>
          )}

          {!query && (
            <div>
              <h2 className="mb-6 text-2xl font-semibold">Sugestões para começar</h2>
              <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {discovery.take(10).map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            </div>
          )}

          {query && !loading && !results.size && (
            <div className="liquid-glass rounded-[32px] p-8 text-center text-white/70">
              Nenhum título encontrado. Tente um gênero como `drama`, `action` ou `thriller`.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
