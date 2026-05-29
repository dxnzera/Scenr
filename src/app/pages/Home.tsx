import { Hero } from "../components/Hero";
import { MovieRow } from "../components/MovieRow";
import { useEffect, useMemo, useState } from "react";
import { getMovieApplication } from "../../application/movies/MovieApplication";
import { type HomeSection } from "../../domain/movies/MovieRepository";
import { MovieCollection } from "../../domain/movies/MovieCollection";

export function Home() {
  const application = useMemo(() => getMovieApplication(), []);
  const [sections, setSections] = useState<HomeSection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadHome() {
      try {
        const nextSections = await application.warmHomeSections();

        if (active) {
          setSections(nextSections);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadHome();

    return () => {
      active = false;
    };
  }, [application]);

  const featuredMovies = useMemo(() => {
    const collection = new MovieCollection(
      sections.flatMap((section) => section.movies),
    ).uniqueById();

    const featuredMovie = collection.featured();

    if (!featuredMovie) {
      return [];
    }

    return [
      featuredMovie,
      ...collection.all.filter((movie) => movie.id !== featuredMovie.id),
    ].slice(0, 5);
  }, [sections]);

  return (
    <div className="min-h-screen">
      {featuredMovies.length ? (
        <Hero movies={featuredMovies} />
      ) : (
        <div className="mx-auto flex min-h-[720px] max-w-[1480px] items-center px-4 pb-24 pt-8 md:min-h-[860px] md:px-6 md:pt-10">
          <div className="space-y-4">
            <div className="h-10 w-40 rounded-full bg-white/10" />
            <div className="h-20 w-96 max-w-full rounded-[32px] bg-white/10" />
            <div className="h-24 w-[680px] max-w-full rounded-[32px] bg-white/10" />
          </div>
        </div>
      )}

      <div className="relative z-10 -mt-16 space-y-10 pb-16 md:-mt-24 md:space-y-14 md:pb-14">
        {sections.map((section) => (
          <MovieRow key={section.title} title={section.title} movies={section.movies} />
        ))}

        {!sections.length && !loading && (
          <div className="px-6 text-center text-muted-foreground">
            Não foi possível carregar o catálogo agora.
          </div>
        )}
      </div>
    </div>
  );
}
