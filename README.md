# Scenr

Aplicacao web para exploracao de filmes, organizada em camadas orientadas a objetos para separar regra de negocio, casos de uso, infraestrutura e interface.

## Stack

- React 18
- TypeScript
- Vite
- React Router
- Tailwind CSS

## Estrutura

```text
src/
  app/             # paginas, componentes, hooks e rotas
  application/     # casos de uso e orquestracao da aplicacao
  domain/          # entidades, colecoes e contratos
  infrastructure/  # repositorios concretos, API e mapeadores
  styles/          # estilos globais e tema
```

## Arquitetura orientada a objetos

- `domain` concentra os objetos principais, como `Movie` e `MovieCollection`.
- `application` expoe casos de uso como busca, listagem e detalhes de filmes.
- `infrastructure` implementa o acesso a dados remoto e fallback local.
- `app` apenas consome esses objetos para renderizar a interface.

Isso evita duplicacao de responsabilidade e facilita evoluir o projeto sem espalhar regra de negocio pela UI.

## Scripts

```bash
npm install
npm run dev
npm run build
```

## Observacao sobre a limpeza

A pasta `page/` foi removida da estrutura por ser um segundo projeto Vite de exemplo, duplicando arquivos como `package.json`, `package-lock.json`, `README.md` e `vite.config`.

## Documentacao complementar

Veja [docs/architecture.md](./docs/architecture.md) para um resumo da organizacao interna do projeto.
