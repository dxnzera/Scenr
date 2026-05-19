import { Link, useLocation } from "react-router";
import { Search, Moon, Sun, UserRound } from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { useWatchlist } from "../hooks/useWatchlist";
import { Button } from "./ui/button";

export function Header() {
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const watchlist = useWatchlist();

  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems = [
    { name: "Início", path: "/" },
    { name: "Explorar", path: "/browse" },
    { name: "Minha Lista", path: "/my-list" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 pt-4 md:px-6">
      <div className="liquid-glass mx-auto max-w-[1400px] rounded-[28px] px-5 py-4 md:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8 md:gap-12">
            <Link to="/" className="flex items-center gap-3">
              <img
                src="/brand/scenr-icon.png"
                alt="Scenr"
                className="h-11 w-11 rounded-2xl object-cover shadow-[0_16px_40px_rgba(34,16,69,0.18)]"
              />
              <div>
                <span className="block text-sm text-muted-foreground">Streaming</span>
                <span className="text-lg font-semibold tracking-[0.2em] text-foreground uppercase">Scenr</span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative text-sm transition-colors ${
                    location.pathname === item.path
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.name}
                  {item.path === "/my-list" && watchlist.count > 0 && (
                    <span className="ml-2 rounded-full bg-primary/12 px-2 py-0.5 text-xs text-primary">
                      {watchlist.count}
                    </span>
                  )}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3 md:gap-4">
            <Button asChild variant="glass" className="hidden px-4 md:inline-flex">
              <Link to="/search">
                <Search className="w-4 h-4" />
                Buscar títulos
              </Link>
            </Button>

            {/* {mounted && (
              <Button
                variant="glass"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                {theme === "dark" ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </Button>
            )} */}

            <Button variant="glass" size="icon" className="relative" aria-label="Perfil">
              <UserRound className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
