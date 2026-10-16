# Data Model: Ampliar Testes de Busca do Repositório de Vídeos

**Feature Branch**: `004-video-repo-search-tests`

## Entities & Value Objects

- **Video**: Agregado raiz persistido via `VideoModel` e associado a `CategoryModel`, `GenreModel`, e `CastMemberModel`.
- **VideoSearchParams**: Critérios de busca (page, per_page, sort, sort_dir, filter).
- **VideoSearchResult**: Resultado contendo os itens encontrados (`items`), total de registros (`total`), etc.
