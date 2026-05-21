import { MediaCatalogPage } from "./MediaCatalogPage";

export function Movies() {
  return (
    <MediaCatalogPage
      eyebrow="Colecao"
      title="Filmes para ver agora"
      description="Um catalogo pensado para descoberta rapida, com acao, drama, ficcao e suspense em cards mais cinematograficos."
      type="movie"
    />
  );
}
