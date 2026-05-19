import { useParams, Link } from "react-router";
import { Play, Plus, Share2, ArrowLeft, Check, ExternalLink } from "lucide-react";
import { MovieRow } from "../components/MovieRow";
import { useEffect, useMemo, useState } from "react";
import { getMovieApplication } from "../../application/movies/MovieApplication";
import { Movie } from "../../domain/movies/Movie";
import { Button } from "../components/ui/button";
import { useWatchlist } from "../hooks/useWatchlist";

export function MovieDetail() {
  const { id } = useParams();
  const application = useMemo(() => getMovieApplication(), []);
  const watchlist = useWatchlist();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [relatedMovies, setRelatedMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadMovie() {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        const nextMovie = await application.getMovieDetails.execute(id);

        if (!active) {
          return;
        }

        setMovie(nextMovie);

        if (nextMovie) {
          const popularCollection = (await application.repository.search({
            type: "movie",
            limit: 80,
          }))
            .uniqueById()
            .sortByLatest();

          const genreMatches = popularCollection
            .all
            .filter((candidateMovie) =>
              candidateMovie.genres.some((genre) => nextMovie.hasGenre(genre)),
            );

          let relatedMovies = genreMatches
            .filter((candidateMovie) => candidateMovie.id !== nextMovie.id)
            .slice(0, 6);

          if (relatedMovies.length < 6 && nextMovie.genres.length) {
            const supplementalCollections = await Promise.all(
              nextMovie.genres.slice(0, 2).map((genre) =>
                application.repository.search({
                  genre,
                  type: "movie",
                  limit: 24,
                }),
              ),
            );

            const supplementalMovies = supplementalCollections
              .flatMap((collection) => collection.uniqueById().sortByLatest().all)
              .filter(
                (candidateMovie) =>
                  candidateMovie.id !== nextMovie.id &&
                  candidateMovie.genres.some((genre) => nextMovie.hasGenre(genre)),
              );

            relatedMovies = [...relatedMovies, ...supplementalMovies]
              .filter(
                (candidateMovie, index, movies) =>
                  movies.findIndex((movie) => movie.id === candidateMovie.id) === index,
              )
              .slice(0, 6);
          }

          if (active) {
            setRelatedMovies(relatedMovies);
          }
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadMovie();

    return () => {
      active = false;
    };
  }, [application, id]);

  if (loading) {
    return (
      <div className="min-h-screen pb-12 pt-32">
        <div className="mx-auto max-w-[1400px] px-6 text-muted-foreground">
          Carregando detalhes...
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen pb-12 pt-32">
        <div className="mx-auto max-w-[1400px] px-6">
          <h1>Filme não encontrado</h1>
        </div>
      </div>
    );
  }

  const isSaved = watchlist.has(movie.id);

  return (
    <div className="min-h-screen pt-20">
      <div className="relative min-h-[820px] w-full overflow-hidden">
        <img
          src={movie.backdrop}
          alt={movie.title}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,5,18,0.7)_0%,rgba(8,5,18,0.24)_22%,rgba(8,5,18,0.84)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,4,18,0.72)_0%,rgba(7,4,18,0.18)_56%,transparent_80%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(128,91,255,0.22),transparent_28%)]" />

        <Link
          to="/"
          className="liquid-glass absolute left-6 top-6 rounded-full p-3 text-white transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </Link>

        <div className="relative mx-auto flex min-h-[820px] max-w-[1400px] items-end px-6 pb-20">
          <div className="max-w-3xl space-y-7">
            <div className="space-y-5">
              <h1 className="text-5xl font-semibold text-white md:text-6xl">{movie.title}</h1>

              <div className="flex flex-wrap items-center gap-4 text-white/82">
                <span className="rounded-full border border-white/20 bg-black/18 px-3 py-1 text-sm backdrop-blur-xl">
                  {movie.rating}
                </span>
                <span>{movie.year}</span>
                <span>{movie.duration}</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {movie.genres.map((genre) => (
                  <span
                    key={genre}
                    className="rounded-full border border-white/14 bg-white/10 px-4 py-1.5 text-sm text-white/86 backdrop-blur-xl"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <Button variant="hero" size="lg" className="px-10">
                <Play className="w-6 h-6 fill-current" />
                Assistir
              </Button>
              <Button
                variant="glass"
                size="lg"
                className="px-8"
                onClick={() => watchlist.toggle(movie)}
              >
                {isSaved ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                {isSaved ? "Na sua lista" : "Salvar"}
              </Button>
              <Button variant="glass" size="icon" className="h-12 w-12">
                <Share2 className="w-6 h-6" />
              </Button>
              {movie.imdbUrl && (
                <Button asChild variant="glass" size="lg" className="px-6">
                  <a href={movie.imdbUrl} target="_blank" rel="noreferrer">
                    IMDb
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </Button>
              )}
            </div>

            <div className="max-w-2xl space-y-4">
              <h2 className="text-xl font-semibold text-white">Sinopse</h2>
              <p className="text-lg leading-relaxed text-white/78">
                {movie.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 pb-20 pt-14">
        <MovieRow title="Mais títulos para você" movies={relatedMovies} />
      </div>
    </div>
  );
}
