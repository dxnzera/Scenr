import { Movie } from "../../domain/movies/Movie";
import { Play, Plus, Info, Check } from "lucide-react";
import { Link } from "react-router";
import { useWatchlist } from "../hooks/useWatchlist";
import { Button } from "./ui/button";

interface HeroProps {
  movie: Movie;
}

export function Hero({ movie }: HeroProps) {
  const watchlist = useWatchlist();
  const isSaved = watchlist.has(movie.id);

  return (
    <div className="relative min-h-[760px] w-full overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={movie.backdrop}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,5,18,0.68)_0%,rgba(8,5,18,0.24)_18%,rgba(8,5,18,0.82)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,4,18,0.9)_0%,rgba(7,4,18,0.45)_44%,rgba(7,4,18,0.08)_74%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(128,91,255,0.24),transparent_30%)]" />
      </div>

      <div className="relative mx-auto flex min-h-[560px] max-w-[1400px] items-center px-6 pb-2 pt-40 md:pt-44">
        <div className="max-w-2xl space-y-6">
          <div className="liquid-glass inline-flex rounded-full px-4 py-2 text-sm text-white/80">
            Destaque da semana
          </div>

          <h1 className="text-5xl font-semibold text-white md:text-6xl lg:text-7xl">
            {movie.title}
          </h1>

          <div className="flex items-center gap-3 text-white/90">
            <span className="rounded-full border border-white/30 px-3 py-1 text-sm">
              {movie.rating}
            </span>
            <span>{movie.year}</span>
            <span>{movie.duration}</span>
          </div>

          <p className="text-lg text-white/90 leading-relaxed">
            {movie.description}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button variant="hero" size="lg" className="px-8">
              <Play className="w-5 h-5 fill-black" />
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
            <Button asChild variant="glass" size="icon" className="h-12 w-12">
              <Link to={`/movie/${movie.id}`}>
                <Info className="w-5 h-5" />
              </Link>
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {movie.genres.map((genre) => (
              <span
                key={genre}
                className="rounded-full border border-white/18 bg-white/10 px-3 py-1 text-sm text-white/85 backdrop-blur-xl"
              >
                {genre}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
