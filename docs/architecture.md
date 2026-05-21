# Arquitetura do Scenr

O projeto foi consolidado para trabalhar com uma unica aplicacao na raiz do repositorio.

## Camadas

### `src/domain`

Define os objetos e contratos centrais do sistema:

- `Movie`: entidade com comportamento proprio, como busca textual e leitura de metadados.
- `MovieCollection`: encapsula operacoes sobre listas de filmes.
- `MovieRepository`: contrato que desacopla regra de negocio da origem dos dados.

### `src/application`

Coordena os fluxos da aplicacao:

- casos de uso para home, busca, catalogo e detalhe
- `MovieApplication` como ponto de composicao das dependencias
- `WatchlistManager` para gerenciar a lista local

### `src/infrastructure`

Implementa detalhes externos:

- cliente HTTP da IMDb
- mapeadores de resposta
- repositorio remoto
- repositorio fallback

### `src/app`

Contem a camada de apresentacao:

- rotas
- paginas
- componentes
- hooks

## Beneficios da organizacao

- reduz acoplamento entre interface e dados
- melhora reaproveitamento de codigo
- centraliza regras em objetos com responsabilidade clara
- facilita manutencao e testes futuros
