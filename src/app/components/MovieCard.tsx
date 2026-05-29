import { Movie } from "../../domain/movies/Movie";
import { Play, Plus, Check } from "lucide-react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { Button } from "./ui/button";
import { useWatchlist } from "../hooks/useWatchlist";

interface MovieCardProps {
  movie: Movie;
}

export function MovieCard({ movie }: MovieCardProps) {
  const watchlist = useWatchlist();
  const isSaved = watchlist.has(movie.id);

  return (
    <Link to={`/movie/${movie.id}`}>
      <motion.div
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.2 }}
        className="group/card relative cursor-pointer overflow-hidden rounded-[18px] md:rounded-[24px]"
      >
        <div className="aspect-[2/3] relative">
          <img
            src={movie.poster}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute left-2 top-2 rounded-full border border-white/12 bg-black/55 px-2 py-0.5 text-[9px] font-medium uppercase tracking-[0.16em] text-white/78 backdrop-blur-xl md:left-3 md:top-3 md:px-2.5 md:py-1 md:text-[11px] md:tracking-[0.22em]">
            {movie.kindLabel}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/92 via-black/16 to-transparent opacity-0 transition-opacity duration-300 group-hover/card:opacity-100" />

          <div className="absolute inset-x-0 bottom-0 flex translate-y-0 items-end justify-between p-3 opacity-100 transition-all duration-300 md:translate-y-3 md:p-4 md:opacity-0 md:group-hover/card:translate-y-0 md:group-hover/card:opacity-100">
            <Button variant="hero" size="icon" className="h-10 w-10 md:h-12 md:w-12">
              <Play className="w-5 h-5 text-black fill-black ml-0.5" />
            </Button>
            <Button
              variant="glass"
              size="icon"
              className="h-10 w-10 md:h-11 md:w-11"
              onClick={(event) => {
                event.preventDefault();
                watchlist.toggle(movie);
              }}
            >
              {isSaved ? (
                <Check className="w-5 h-5 text-current" />
              ) : (
                <Plus className="w-5 h-5 text-current" />
              )}
            </Button>
          </div>
        </div>

        <div className="mt-3 space-y-1.5 md:mt-4 md:space-y-2">
          <h3 className="line-clamp-2 text-sm font-medium text-foreground md:line-clamp-1 md:text-base">{movie.title}</h3>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground md:gap-2 md:text-sm">
            <span>{movie.year}</span>
            <span>•</span>
            <span>{movie.duration}</span>
          </div>
          <div className="hidden flex-wrap gap-2 sm:flex">
            {movie.genres.slice(0, 2).map((genre) => (
              <span
                key={genre}
                className="rounded-full border border-border bg-card px-2.5 py-1 text-xs text-muted-foreground"
              >
                {genre}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
