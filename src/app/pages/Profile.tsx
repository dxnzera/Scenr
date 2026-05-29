import { Bookmark, Clapperboard, Tv, UserRound } from "lucide-react";
import { useWatchlist } from "../hooks/useWatchlist";

export function Profile() {
  const watchlist = useWatchlist();
  const savedSeries = watchlist.movies.filter((movie) => movie.kind === "tv").length;
  const savedMovies = watchlist.movies.filter((movie) => movie.kind === "movie").length;

  return (
    <div className="min-h-screen pb-16 pt-8 md:pb-14 md:pt-10">
      <div className="mx-auto max-w-[1280px] px-4 md:px-6">
        <div className="panel-surface content-fade-in overflow-hidden rounded-[28px] border border-white/10 backdrop-blur-xl md:rounded-[38px]">
          <div className="relative p-5 md:p-10">
            <div className="panel-accent-glow absolute inset-0" />
            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center md:gap-5">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[24px] border border-white/10 bg-white/8 text-2xl font-semibold text-white md:h-24 md:w-24 md:rounded-[28px] md:text-3xl">
                  DM
                </div>
                <div className="space-y-2">
                  <span className="text-[11px] uppercase tracking-[0.3em] text-white/45 md:text-xs md:tracking-[0.42em]">
                    Usuario local
                  </span>
                  <h1 className="text-3xl font-semibold text-white md:text-4xl">Daniel Mendes</h1>
                  <p className="max-w-xl text-sm leading-6 text-white/65 md:text-base md:leading-normal">
                    Area reservada para perfil, historico e preferencias. Por enquanto ela ja centraliza o que voce salvou no app.
                  </p>
                </div>
              </div>

              <div className="flex w-fit items-center gap-3 rounded-full border border-white/10 bg-white/6 px-4 py-2.5 text-sm text-white/72 md:px-5 md:py-3 md:text-base">
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
              <p className="text-3xl font-semibold text-white md:text-4xl">{watchlist.count}</p>
              <p className="mt-2 text-sm text-white/52">titulos salvos no dispositivo</p>
            </div>

            <div className="bg-black/20 p-6">
              <div className="mb-4 flex items-center gap-3 text-white/72">
                <Clapperboard className="h-5 w-5" />
                Filmes
              </div>
              <p className="text-3xl font-semibold text-white md:text-4xl">{savedMovies}</p>
              <p className="mt-2 text-sm text-white/52">filmes prontos para rever depois</p>
            </div>

            <div className="bg-black/20 p-6">
              <div className="mb-4 flex items-center gap-3 text-white/72">
                <Tv className="h-5 w-5" />
                Series
              </div>
              <p className="text-3xl font-semibold text-white md:text-4xl">{savedSeries}</p>
              <p className="mt-2 text-sm text-white/52">series esperando maratona</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
