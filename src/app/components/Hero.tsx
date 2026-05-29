import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Play, Plus, Info, Check } from "lucide-react";
import { Link } from "react-router";
import { Movie } from "../../domain/movies/Movie";
import { useWatchlist } from "../hooks/useWatchlist";
import { Button } from "./ui/button";

interface HeroProps {
  movies: Movie[];
}

export function Hero({ movies }: HeroProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const watchlist = useWatchlist();
  const movie = movies[currentIndex] ?? movies[0];

  useEffect(() => {
    setCurrentIndex(0);
  }, [movies]);

  useEffect(() => {
    if (movies.length <= 1) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setCurrentIndex((currentValue) => (currentValue + 1) % movies.length);
    }, 7000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [movies]);

  if (!movie) {
    return null;
  }

  const isSaved = watchlist.has(movie.id);

  return (
    <div className="relative min-h-[720px] w-full overflow-hidden md:min-h-[860px]">
      <div className="absolute inset-0">
        <AnimatePresence mode="wait">
          <motion.img
            key={movie.id}
            src={movie.backdrop}
            alt={movie.title}
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="animate-slow-pan h-full w-full object-cover"
          />
        </AnimatePresence>
        <div className="hero-overlay-top absolute inset-0" />
        <div className="hero-overlay-side absolute inset-0" />
        <div className="hero-overlay-accent absolute inset-0" />
      </div>

      <div className="relative mx-auto flex min-h-[680px] max-w-[1480px] items-end px-4 pb-20 pt-8 md:min-h-[760px] md:items-center md:px-6 md:pb-16 md:pt-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={movie.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="content-fade-in max-w-3xl space-y-5 md:space-y-7"
          >
            <div className="liquid-glass inline-flex rounded-full px-3 py-1.5 text-xs text-white/80 md:px-4 md:py-2 md:text-sm">
              {movie.kindLabel} em destaque
            </div>

            <div className="space-y-3 md:space-y-4">
              <div className="text-[11px] uppercase tracking-[0.3em] text-white/52 md:text-xs md:tracking-[0.42em]">
                {movie.genres.slice(0, 2).join(" • ")}
              </div>
              <h1 className="hero-title-shadow max-w-4xl text-4xl font-semibold leading-tight text-white md:text-6xl lg:text-7xl">
                {movie.title}
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-sm text-white/88 md:gap-3 md:text-base">
              <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm backdrop-blur-xl">
                {movie.rating}
              </span>
              <span>{movie.year}</span>
              <span>{movie.duration}</span>
            </div>

            <p className="line-clamp-4 max-w-2xl text-base leading-7 text-white/82 md:line-clamp-none md:text-xl md:leading-relaxed">
              {movie.description}
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1 md:gap-3 md:pt-2">
              <Button variant="hero" size="lg" className="min-w-[132px] px-6 md:px-8">
                <Play className="w-5 h-5 fill-black" />
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
              <Button asChild variant="glass" size="icon" className="h-12 w-12">
                <Link to={`/movie/${movie.id}`}>
                  <Info className="w-5 h-5" />
                </Link>
              </Button>
            </div>

            <div className="flex max-h-16 flex-wrap gap-2 overflow-hidden pt-1 md:max-h-none md:pt-2">
              {movie.genres.map((genre) => (
                <span
                  key={genre}
                  className="rounded-full border border-white/14 bg-white/10 px-2.5 py-1 text-xs text-white/82 backdrop-blur-xl md:px-3 md:text-sm"
                >
                  {genre}
                </span>
              ))}
            </div>

            {movies.length > 1 && (
              <div className="flex items-center gap-2 pt-1 md:gap-3 md:pt-2">
                {movies.map((item, index) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setCurrentIndex(index)}
                    className={`h-1.5 rounded-full transition-all ${
                      index === currentIndex ? "w-12 bg-white" : "w-6 bg-white/30 hover:bg-white/50"
                    }`}
                    aria-label={`Mostrar destaque ${index + 1}: ${item.title}`}
                  />
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
