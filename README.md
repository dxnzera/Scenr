# Scenr 🎬

[![Next.js](https://img.shields.io/badge/Next.js-13-blue?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.3-blue?logo=tailwind-css)](https://tailwindcss.com/)
[![React](https://img.shields.io/badge/React-18-blue?logo=react)](https://reactjs.org/)

**Scenr** é um aplicativo de informações de filmes que permite explorar dados completos sobre filmes: onde assistir, nota, sinopse, elenco, estúdios, orçamento, bilheteria, trailer, IMDb e muito mais.

---

## Funcionalidades Principais

* Visualizar detalhes completos de filmes em um modal moderno e responsivo.
* Informações exibidas:

  * Título, título original, sinopse, gênero, classificação, duração.
  * Idioma, país de origem, estúdios, orçamento e bilheteria.
  * Nota média, número de votos, metascore.
  * Locais de filmagem.
  * Trailer e links externos (IMDb, site oficial).
* Layout adaptativo para imagens horizontais ou verticais.
* Tags de tecnologias: 4K, Dolby Vision, Dolby Atmos, CC, AD.
* Interface moderna com gradiente e blur de fundo no modal.

---

## Tecnologias

* Next.js 13
* React 18
* TypeScript
* Tailwind CSS
* Lucide Icons
* Next/Image para otimização de imagens

---

## Instalação Rápida

```bash
git clone https://github.com/SEU_USUARIO/scenr.git
cd scenr
npm install      # ou yarn install
npm run dev      # ou yarn dev
```

Acesse no navegador: [http://localhost:3000](http://localhost:3000)

---

## Como Usar

1. Navegue pelos filmes disponíveis.
2. Clique em qualquer filme para abrir o modal de detalhes.
3. Explore trailer, notas, links externos e informações completas.
4. Feche o modal clicando no `X` ou fora do modal.

---

## Estrutura de Dados (Movie)

```ts
export interface Movie {
  id: string;
  primaryTitle: string;
  originalTitle?: string;
  description?: string;
  primaryImage?: string | { url?: string };
  averageRating?: number;
  numVotes?: number;
  metascore?: number;
  releaseDate?: string;
  startYear?: string;
  runtimeMinutes?: number;
  runtime?: string;
  contentRating?: string;
  type?: 'tv' | 'movie';
  genres?: string[];
  countriesOfOrigin?: string[];
  spokenLanguages?: string[];
  filmingLocations?: string[];
  productionCompanies?: { name: string }[];
  budget?: number | string;
  grossWorldwide?: number | string;
  trailer?: { url?: string };
  externalLinks?: { url: string; site: string }[];
  url?: string;
}
```

---
## Licença | License

Este projeto é distribuído sob a licença **MIT**.
This project is licensed under the **MIT License**.

---

### Autor | Author

**Daniel Mendes**
📧 contato: [dxnzera@gmail.com](mailto:dxnzera@gmail.com)
📍 Brasil | Brazil
