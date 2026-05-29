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
            type: nextMovie.kind,
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
                  type: nextMovie.kind,
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
      <div className="min-h-screen pb-16 pt-8 md:pb-12 md:pt-10">
        <div className="mx-auto max-w-[1480px] px-4 text-muted-foreground md:px-6">
          Carregando detalhes...
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen pb-16 pt-8 md:pb-12 md:pt-10">
        <div className="mx-auto max-w-[1480px] px-4 md:px-6">
          <h1>Filme não encontrado</h1>
        </div>
      </div>
    );
  }

  const isSaved = watchlist.has(movie.id);

  return (
    <div className="min-h-screen pt-0 md:pt-6">
      <div className="relative min-h-[760px] w-full overflow-hidden md:min-h-[820px]">
        <img
          src={movie.backdrop}
          alt={movie.title}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="hero-overlay-top absolute inset-0" />
        <div className="hero-overlay-side absolute inset-0" />
        <div className="detail-overlay-accent absolute inset-0" />

        <Link
          to="/"
          className="liquid-glass absolute left-4 top-4 rounded-full p-3 text-white transition-colors md:left-6 md:top-6"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </Link>

        <div className="relative mx-auto flex min-h-[760px] max-w-[1480px] items-end px-4 pb-20 md:min-h-[820px] md:px-6">
          <div className="max-w-3xl space-y-5 md:space-y-7">
            <div className="space-y-4 md:space-y-5">
              <h1 className="text-4xl font-semibold leading-tight text-white md:text-6xl md:leading-normal">{movie.title}</h1>

              <div className="flex flex-wrap items-center gap-2 text-sm text-white/82 md:gap-4 md:text-base">
                <span className="rounded-full border border-white/20 bg-black/18 px-3 py-1 text-sm backdrop-blur-xl">
                  {movie.rating}
                </span>
                <span>{movie.year}</span>
                <span>{movie.duration}</span>
              </div>

              <div className="flex max-h-20 flex-wrap gap-2 overflow-hidden md:max-h-none">
                {movie.genres.map((genre) => (
                  <span
                    key={genre}
                    className="rounded-full border border-white/14 bg-white/10 px-3 py-1 text-xs text-white/86 backdrop-blur-xl md:px-4 md:py-1.5 md:text-sm"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 md:gap-4">
              <Button variant="hero" size="lg" className="min-w-[132px] px-6 md:px-10">
                <Play className="w-6 h-6 fill-current" />
                Assistir
              </Button>
              <Button
                variant="glass"
                size="lg"
                className="min-w-[132px] px-6 md:px-8"
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

            <div className="max-w-2xl space-y-3 md:space-y-4">
              <h2 className="text-xl font-semibold text-white">Sinopse</h2>
              <p className="text-base leading-7 text-white/78 md:text-lg md:leading-relaxed">
                {movie.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 pb-20 pt-10 md:pt-14">
        <MovieRow title="Mais títulos para você" movies={relatedMovies} />
      </div>
    </div>
  );
}
