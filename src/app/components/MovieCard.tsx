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
        className="group/card relative cursor-pointer overflow-hidden rounded-[24px]"
      >
        <div className="aspect-[2/3] relative">
          <img
            src={movie.poster}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/92 via-black/16 to-transparent opacity-0 transition-opacity duration-300 group-hover/card:opacity-100" />

          <div className="absolute inset-x-0 bottom-0 flex translate-y-3 items-end justify-between p-4 opacity-0 transition-all duration-300 group-hover/card:translate-y-0 group-hover/card:opacity-100">
            <Button variant="hero" size="icon" className="h-12 w-12">
              <Play className="w-5 h-5 text-black fill-black ml-0.5" />
            </Button>
            <Button
              variant="glass"
              size="icon"
              className="h-11 w-11"
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

        <div className="mt-4 space-y-2">
          <h3 className="font-medium text-foreground line-clamp-1">{movie.title}</h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{movie.year}</span>
            <span>•</span>
            <span>{movie.duration}</span>
          </div>
          <div className="flex flex-wrap gap-2">
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
