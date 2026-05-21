import { Link, useLocation } from "react-router";
import {
  Bookmark,
  Clapperboard,
  Home,
  Search,
  Tv,
  UserRound,
} from "lucide-react";
import { useWatchlist } from "../hooks/useWatchlist";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import logo from "../../../public/brand/scenr-icon.svg";

const primaryNavItems = [
  { name: "Buscar", path: "/search", icon: Search },
  { name: "Inicio", path: "/", icon: Home },
  { name: "Filmes", path: "/movies", icon: Clapperboard },
  { name: "Series", path: "/series", icon: Tv },
  { name: "Minha Lista", path: "/my-list", icon: Bookmark },
] as const;

const secondaryNavItems = [
  { name: "Usuario", path: "/profile", icon: UserRound },
] as const;

export function Header() {
  const location = useLocation();
  const watchlist = useWatchlist();

  const isActive = (path: string) =>
    path === "/" ? location.pathname === path : location.pathname.startsWith(path);

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-[104px] px-5 py-6 md:block lg:w-[120px]">
        <div className="side-nav-surface flex h-full flex-col justify-between rounded-[34px] px-4 py-5">
          <div className="space-y-6">
            <Link
              to="/"
              className="flex items-center justify-center rounded-full border border-white/10 bg-white/5 transition-transform scale-[1.1] duration-300 hover:scale-[1.2]"
            >
              <img
                src={logo}
                alt="Scenr"
                className="h-11 w-11 rounded-full object-cover shadow-[0_20px_50px_rgba(0,0,0,0.35)]"
              />
            </Link>

            <nav className="flex flex-col items-center gap-3">
              {primaryNavItems.map((item) => (
                <Tooltip key={item.path}>
                  <TooltipTrigger asChild>
                    <Link
                      to={item.path}
                      aria-label={item.name}
                      className={`side-nav-link ${isActive(item.path) ? "side-nav-link-active" : ""}`}
                    >
                      <div className="relative">
                        <item.icon className="h-5 w-5" />
                        {item.path === "/my-list" && watchlist.count > 0 && (
                          <span className="absolute -right-3 -top-3 flex h-5 min-w-5 items-center justify-center rounded-full bg-purple-900 px-1 text-[10px] font-semibold text-white">
                            {watchlist.count}
                          </span>
                        )}
                      </div>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right" sideOffset={12}>
                    {item.name}
                  </TooltipContent>
                </Tooltip>
              ))}
            </nav>
          </div>

          <div className="flex flex-col items-center gap-3">
            {secondaryNavItems.map((item) => (
              <Tooltip key={item.path}>
                <TooltipTrigger asChild>
                  <Link
                    to={item.path}
                    aria-label={item.name}
                    className={`side-nav-link ${isActive(item.path) ? "side-nav-link-active" : ""}`}
                  >
                    <item.icon className="h-5 w-5" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={12}>
                  {item.name}
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </div>
      </aside>

      <nav className="fixed inset-x-4 bottom-4 z-50 md:hidden">
        <div className="side-nav-surface flex items-center justify-between rounded-[26px] px-3 py-3">
          {[...primaryNavItems, ...secondaryNavItems].map((item) => (
            <Link
              key={item.path}
              to={item.path}
              aria-label={item.name}
              className={`side-nav-link h-11 w-11 ${isActive(item.path) ? "side-nav-link-active" : ""}`}
              title={item.name}
            >
              <div className="relative">
                <item.icon className="h-5 w-5" />
                {item.path === "/my-list" && watchlist.count > 0 && (
                  <span className="absolute -right-3 -top-3 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#5b33b6] px-1 text-[10px] font-semibold text-white">
                    {watchlist.count}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
