import { useEffect, useMemo, useState } from "react";
import { MovieCard } from "../components/MovieCard";
import { LiquidSearchBar } from "../components/LiquidSearchBar";
import { getMovieApplication } from "../../application/movies/MovieApplication";
import { MovieCollection } from "../../domain/movies/MovieCollection";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import { Button } from "../components/ui/button";

export function Search() {
  const application = useMemo(() => getMovieApplication(), []);
  const [query, setQuery] = useState("");
  const [selectedType, setSelectedType] = useState<"all" | "movie" | "tv">("all");
  const [results, setResults] = useState(MovieCollection.empty());
  const [discovery, setDiscovery] = useState(MovieCollection.empty());
  const [loading, setLoading] = useState(false);
  const debouncedQuery = useDebouncedValue(query, 350);

  useEffect(() => {
    let active = true;

    async function loadDiscovery() {
      const collection = selectedType === "all"
        ? await application.repository.search({ limit: 24 })
        : await application.getBrowseCatalog.execute(
            ["Drama", "Adventure", "Sci-Fi"],
            selectedType,
          );

      if (active) {
        setDiscovery(collection);
      }
    }

    void loadDiscovery();

    return () => {
      active = false;
    };
  }, [application, selectedType]);

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
        const collection = await application.searchMovies.execute(
          debouncedQuery,
          selectedType === "all" ? undefined : selectedType,
        );

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
  }, [application, debouncedQuery, selectedType]);

  return (
    <div className="min-h-screen pb-12 pt-10">
      <div className="mx-auto max-w-[1480px] px-6">
        <div className="content-fade-in space-y-10">
          <div className="max-w-3xl space-y-5">
            <span className="text-sm uppercase tracking-[0.4em] text-white/60">
              Busca
            </span>
            <h1 className="text-4xl font-semibold md:text-5xl">
              Encontre filmes e series sem sair do clima da home.
            </h1>
            <p className="max-w-2xl text-base text-muted-foreground md:text-lg">
              A busca agora conversa melhor com o catalogo inteiro e deixa voce alternar entre tudo, so filmes ou so series.
            </p>
            <div className="flex flex-wrap gap-3">
              {[
                { label: "Tudo", value: "all" },
                { label: "Filmes", value: "movie" },
                { label: "Series", value: "tv" },
              ].map((item) => (
                <Button
                  key={item.value}
                  variant={selectedType === item.value ? "hero" : "glass"}
                  className="px-5"
                  onClick={() => setSelectedType(item.value as "all" | "movie" | "tv")}
                >
                  {item.label}
                </Button>
              ))}
            </div>
            <LiquidSearchBar
              value={query}
              onChange={setQuery}
              placeholder="Pesquisar titulos, generos ou universos..."
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
              <h2 className="mb-6 text-2xl font-semibold">Sugestoes para comecar</h2>
              <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {discovery.take(10).map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            </div>
          )}

          {query && !loading && !results.size && (
            <div className="liquid-glass rounded-[32px] p-8 text-center text-white/70">
              Nenhum titulo encontrado. Tente um genero como `drama`, `action` ou `thriller`.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
