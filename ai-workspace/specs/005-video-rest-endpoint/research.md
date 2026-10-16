# Pesquisa: Endpoint REST de listagem e busca de vídeos

**Branch**: `005-video-rest-endpoint`

## Decisões arquiteturais
1. **DTO**: `SearchVideosDto` estende `ListVideosInput` (ou implementa com decorators) para suportar paginação, ordenação, busca por título e filtros de coleções (`categories_id`, `genres_id`, `cast_members_id`).
2. **Presenters**: `VideoPresenter` e `VideoCollectionPresenter` mapeiam `VideoOutput` para o formato JSON exposto pela API, serializando datas com `@Transform` e sub-estruturas com `@Type`.
3. **Controller**: `VideosController` recebe `ListVideosUseCase` via `@Inject` e expõe `@Get() async search(@Query() searchParams: SearchVideosDto)`.
4. **Testes**: Seguir o padrão de `GenresController` e `test/genres/list-genres.e2e-spec.ts`.
