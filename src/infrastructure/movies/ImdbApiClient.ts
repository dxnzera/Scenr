import { type MovieSearchCriteria } from "../../domain/movies/MovieRepository";

type ImdbTitleResponse = Record<string, unknown>;
type ImdbSearchResponse = Record<string, unknown> | Array<Record<string, unknown>>;

export class ImdbApiClient {
  private readonly apiKey = import.meta.env.VITE_RAPIDAPI_KEY?.trim();
  private readonly baseUrl =
    import.meta.env.VITE_RAPIDAPI_BASE_URL?.trim() ?? "https://imdb236.p.rapidapi.com";
  private readonly configuredHost = import.meta.env.VITE_RAPIDAPI_HOST?.trim();

  get isConfigured() {
    return Boolean(this.apiKey);
  }

  async search(criteria: MovieSearchCriteria = {}): Promise<ImdbSearchResponse> {
    this.ensureConfiguration();

    const normalizedQuery = criteria.query?.trim() ?? "";
    const normalizedGenre =
      criteria.genre?.trim() && criteria.genre !== "Todos" ? criteria.genre.trim() : "";

    if (!normalizedQuery && !normalizedGenre) {
      return this.request(
        criteria.type === "tv"
          ? "/api/imdb/most-popular-tv"
          : "/api/imdb/most-popular-movies",
      );
    }

    const params = new URLSearchParams();

    if (criteria.type) {
      params.set("type", criteria.type);
    }

    if (criteria.limit) {
      params.set("rows", String(criteria.limit));
    }

    if (normalizedQuery) {
      params.set("query", normalizedQuery);
    }

    if (normalizedGenre) {
      params.set("genre", normalizedGenre);
    }

    params.set("sortOrder", "ASC");
    params.set("sortField", "id");

    return this.request(`/api/imdb/search?${params.toString()}`);
  }

  async getById(id: string): Promise<ImdbTitleResponse> {
    this.ensureConfiguration();

    const endpoints = [
      `/title/get-overview-details?${new URLSearchParams({ tconst: id }).toString()}`,
      `/api/imdb/title?${new URLSearchParams({ id }).toString()}`,
    ];

    let lastError: unknown;

    for (const endpoint of endpoints) {
      try {
        return await this.request(endpoint);
      } catch (error) {
        lastError = error;
      }
    }

    throw lastError ?? new Error("Movie detail request failed.");
  }

  private ensureConfiguration() {
    if (!this.isConfigured) {
      throw new Error("RapidAPI credentials are not configured.");
    }
  }

  private async request(endpoint: string) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      cache: "no-store",
      headers: {
        "x-rapidapi-key": this.apiKey,
        "x-rapidapi-host": this.resolveRequestHost(),
      },
    });

    if (!response.ok) {
      throw new Error(`RapidAPI request failed with status ${response.status}.`);
    }

    return response.json();
  }

  private resolveRequestHost() {
    try {
      return new URL(this.baseUrl).host;
    } catch {
      return this.configuredHost || "imdb236.p.rapidapi.com";
    }
  }
}
