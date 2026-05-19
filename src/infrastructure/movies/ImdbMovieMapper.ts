import { Movie } from "../../domain/movies/Movie";

type UnknownRecord = Record<string, unknown>;

function asRecord(value: unknown): UnknownRecord | null {
  return typeof value === "object" && value !== null ? (value as UnknownRecord) : null;
}

function asString(value: unknown) {
  return typeof value === "string" ? value : "";
}

function asNumber(value: unknown) {
  return typeof value === "number" ? value : Number(value);
}

function readNested(record: UnknownRecord, path: string[]): unknown {
  let current: unknown = record;

  for (const segment of path) {
    const next = asRecord(current);

    if (!next || !(segment in next)) {
      return undefined;
    }

    current = next[segment];
  }

  return current;
}

function extractImage(value: unknown): string {
  if (typeof value === "string") {
    return value;
  }

  const record = asRecord(value);

  if (!record) {
    return "";
  }

  return (
    asString(record.url) ||
    asString(record.imageUrl) ||
    asString(record.id) ||
    asString(record.image) ||
    ""
  );
}

function extractGenres(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (typeof item === "string") {
          return item;
        }

        const record = asRecord(item);
        return record ? asString(record.name) || asString(record.genre) : "";
      })
      .filter(Boolean);
  }

  const record = asRecord(value);

  if (!record) {
    return [];
  }

  const nestedGenres = readNested(record, ["genres"]);

  if (Array.isArray(nestedGenres)) {
    return extractGenres(nestedGenres);
  }

  const names = Array.isArray(record.names) ? record.names.map(asString) : [];
  return names.filter(Boolean);
}

function extractDuration(record: UnknownRecord): string {
  const runtimeMinutes =
    typeof record.runtimeMinutes === "number"
      ? record.runtimeMinutes
      : asNumber(record.runtimeMinutes);

  if (Number.isFinite(runtimeMinutes) && runtimeMinutes > 0) {
    const hours = Math.floor(runtimeMinutes / 60);
    const minutes = runtimeMinutes % 60;

    if (!hours) {
      return `${minutes}m`;
    }

    return `${hours}h ${minutes}m`;
  }

  return (
    asString(record.runtime) ||
    asString(record.runningTimeInMinutes) ||
    asString(readNested(record, ["runningTimeInMinutes"])) ||
    asString(record.duration) ||
    "N/D"
  );
}

function extractTrailerUrl(value: unknown): string | undefined {
  if (typeof value === "string") {
    return value;
  }

  const record = asRecord(value);

  if (!record) {
    return undefined;
  }

  return asString(record.url) || asString(record.videoUrl) || undefined;
}

function buildBackdrop(record: UnknownRecord, fallbackPoster: string) {
  return (
    extractImage(readNested(record, ["image"])) ||
    extractImage(record.primaryImage) ||
    extractImage(record.image) ||
    extractImage(record.backdrop) ||
    fallbackPoster
  );
}

function extractYear(record: UnknownRecord) {
  const releaseDate = readNested(record, ["releaseDate"]);
  const releaseDateRecord = asRecord(releaseDate);

  if (releaseDateRecord && Number.isFinite(asNumber(releaseDateRecord.year))) {
    return String(releaseDateRecord.year);
  }

  const releaseYear = readNested(record, ["releaseYear"]);
  const releaseYearRecord = asRecord(releaseYear);

  if (releaseYearRecord && Number.isFinite(asNumber(releaseYearRecord.year))) {
    return String(releaseYearRecord.year);
  }

  return (
    asString(record.startYear) ||
    asString(record.releaseDate).slice(0, 4) ||
    asString(record.year) ||
    "N/D"
  );
}

function extractRating(record: UnknownRecord) {
  const ratings = asRecord(readNested(record, ["ratings"]));
  const certificate = asRecord(readNested(record, ["certificate"]));

  return (
    asString(record.contentRating) ||
    asString(record.rating) ||
    asString(certificate?.rating) ||
    (ratings && Number.isFinite(asNumber(ratings.rating))
      ? `${asNumber(ratings.rating).toFixed(1)}`
      : "") ||
    asString(record.certificate) ||
    "N/A"
  );
}

function extractDescription(record: UnknownRecord) {
  const plotOutline = asRecord(readNested(record, ["plotOutline"]));
  const plotSummary = asRecord(readNested(record, ["plotSummary"]));

  return (
    asString(record.description) ||
    asString(record.plot) ||
    asString(record.overview) ||
    asString(plotOutline?.text) ||
    asString(plotSummary?.text) ||
    "Sem sinopse disponível no momento."
  );
}

function extractTitle(record: UnknownRecord) {
  const nestedTitle = asRecord(readNested(record, ["title"]));

  return (
    asString(record.primaryTitle) ||
    asString(record.originalTitle) ||
    asString(record.title) ||
    asString(record.name) ||
    asString(nestedTitle?.title) ||
    asString(readNested(record, ["originalTitleText", "text"])) ||
    ""
  );
}

function extractId(record: UnknownRecord) {
  return (
    asString(record.id) ||
    asString(record.tconst) ||
    asString(record.imdbId) ||
    asString(record._id) ||
    asString(readNested(record, ["title", "id"])) ||
    ""
  );
}

export class ImdbMovieMapper {
  toMovie(payload: unknown): Movie | null {
    const record = asRecord(payload);

    if (!record) {
      return null;
    }

    const id = extractId(record);
    const title = extractTitle(record);

    if (!id || !title) {
      return null;
    }

    const poster =
      extractImage(readNested(record, ["image"])) ||
      extractImage(record.primaryImage) ||
      extractImage(record.poster) ||
      extractImage(record.image) ||
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=600&fit=crop";

    const rawGenres = readNested(record, ["genres", "genres"]) ?? record.genres;

    return new Movie({
      id,
      title,
      description: extractDescription(record),
      year: extractYear(record),
      rating: extractRating(record),
      duration: extractDuration(record),
      genres: extractGenres(rawGenres),
      poster,
      backdrop: buildBackdrop(record, poster),
      kind:
        asString(record.type) === "tvSeries" ||
        asString(readNested(record, ["titleType", "id"])) === "tvSeries"
          ? "tv"
          : "movie",
      imdbUrl: asString(record.url) || `https://www.imdb.com/title/${id}/`,
      trailerUrl: extractTrailerUrl(record.trailer),
    });
  }

  toMovieCollection(payload: unknown): Movie[] {
    const record = asRecord(payload);
    const rawItems = Array.isArray(payload)
      ? payload
      : Array.isArray(record?.results)
        ? record.results
        : Array.isArray(record?.titles)
          ? record.titles
          : Array.isArray(record?.data)
            ? record.data
            : [];

    return rawItems
      .map((item) => this.toMovie(item))
      .filter((movie): movie is Movie => movie !== null);
  }
}
