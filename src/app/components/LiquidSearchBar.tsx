import { Search } from "lucide-react";
import { Button } from "./ui/button";

interface LiquidSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  onSubmit?: () => void;
  actionLabel?: string;
  loading?: boolean;
}

export function LiquidSearchBar({
  value,
  onChange,
  placeholder,
  onSubmit,
  actionLabel = "Buscar",
  loading = false,
}: LiquidSearchBarProps) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit?.();
      }}
      className="liquid-glass flex w-full items-center gap-3 rounded-[28px] p-2"
    >
      <div className="flex flex-1 items-center gap-3 px-4">
        <Search className="h-5 w-5 text-white/70" />
        <input
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="h-12 w-full bg-transparent text-base text-white placeholder:text-white/60 focus:outline-none"
        />
      </div>

      <Button
        type="submit"
        variant="hero"
        size="lg"
        disabled={loading}
        className="rounded-full px-6"
      >
        {loading ? "Buscando..." : actionLabel}
      </Button>
    </form>
  );
}
