# Research: Ampliar Testes de Busca do Repositório de Vídeos

**Feature Branch**: `004-video-repo-search-tests`

## 1. Análise da Suíte Existente
- **Decision**: Inspecionar o `describe('search method tests')` em `video-sequelize.repository.int-spec.ts` para identificar quais cenários de paginação, ordenação e filtros já estão cobertos.
- **Rationale**: Evita duplicação e assegura que apenas os cenários faltantes sejam implementados.

## 2. Cenários Complementares
- **Decision**: Adicionar testes complementares para:
  - Paginação avançada e limites por página.
  - Ordenação cruzada (`sort` e `sort_dir`).
  - Filtros combinados de título com categorias/gêneros/elenco.
- **Rationale**: Garante cobertura 100% robusta do método `search` mantendo a integridade dos testes já existentes.
