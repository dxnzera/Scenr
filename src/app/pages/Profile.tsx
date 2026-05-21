import { Bookmark, Clapperboard, Tv, UserRound } from "lucide-react";
import { useWatchlist } from "../hooks/useWatchlist";

export function Profile() {
  const watchlist = useWatchlist();
  const savedSeries = watchlist.movies.filter((movie) => movie.kind === "tv").length;
  const savedMovies = watchlist.movies.filter((movie) => movie.kind === "movie").length;

  return (
    <div className="min-h-screen pb-14 pt-10">
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="panel-surface content-fade-in overflow-hidden rounded-[38px] border border-white/10 backdrop-blur-xl">
          <div className="relative p-8 md:p-10">
            <div className="panel-accent-glow absolute inset-0" />
            <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div className="flex items-center gap-5">
                <div className="flex h-24 w-24 items-center justify-center rounded-[28px] border border-white/10 bg-white/8 text-3xl font-semibold text-white">
                  DM
                </div>
                <div className="space-y-2">
                  <span className="text-xs uppercase tracking-[0.42em] text-white/45">
                    Usuario local
                  </span>
                  <h1 className="text-4xl font-semibold text-white">Daniel Mendes</h1>
                  <p className="max-w-xl text-white/65">
                    Area reservada para perfil, historico e preferencias. Por enquanto ela ja centraliza o que voce salvou no app.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/6 px-5 py-3 text-white/72">
                <UserRound className="h-5 w-5" />
                Perfil em modo local
              </div>
            </div>
          </div>

          <div className="grid gap-px bg-white/8 md:grid-cols-3">
            <div className="bg-black/20 p-6">
              <div className="mb-4 flex items-center gap-3 text-white/72">
                <Bookmark className="h-5 w-5" />
                Minha Lista
              </div>
              <p className="text-4xl font-semibold text-white">{watchlist.count}</p>
              <p className="mt-2 text-sm text-white/52">titulos salvos no dispositivo</p>
            </div>

            <div className="bg-black/20 p-6">
              <div className="mb-4 flex items-center gap-3 text-white/72">
                <Clapperboard className="h-5 w-5" />
                Filmes
              </div>
              <p className="text-4xl font-semibold text-white">{savedMovies}</p>
              <p className="mt-2 text-sm text-white/52">filmes prontos para rever depois</p>
            </div>

            <div className="bg-black/20 p-6">
              <div className="mb-4 flex items-center gap-3 text-white/72">
                <Tv className="h-5 w-5" />
                Series
              </div>
              <p className="text-4xl font-semibold text-white">{savedSeries}</p>
              <p className="mt-2 text-sm text-white/52">series esperando maratona</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
