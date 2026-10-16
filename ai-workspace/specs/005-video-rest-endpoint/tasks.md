# Tarefas: Endpoint REST de listagem e busca de vídeos

**Branch**: `005-video-rest-endpoint` | **Spec**: [spec.md](spec.md) | **Plan**: [plan.md](plan.md)

## Tarefas de implementação

- [ ] **T001**: Criar o DTO `SearchVideosDto` em `../src/nest-modules/videos-module/dto/search-videos.dto.ts` estendendo `ListVideosInput`.
- [ ] **T002**: Criar os presenters (`VideoPresenter`, `VideoCollectionPresenter`, `VideoCategoryPresenter`, `VideoGenrePresenter`, `VideoCastMemberPresenter`) em `../src/nest-modules/videos-module/videos.presenter.ts`.
- [ ] **T003**: Registrar o `ListVideosUseCase` e dependências em `../src/nest-modules/videos-module/videos.providers.ts` e `../src/nest-modules/videos-module/videos.module.ts`.
- [ ] **T004**: Adicionar o método `search` (`GET /videos`) no `VideosController` (`../src/nest-modules/videos-module/videos.controller.ts`).
- [ ] **T005**: Criar testes unitários para o `VideosController` em `../src/nest-modules/videos-module/__tests__/videos.controller.spec.ts`.
- [ ] **T006**: Criar testes de integração para o `VideosController` em `../src/nest-modules/videos-module/__tests__/videos.controller.int-spec.ts`.
- [ ] **T007**: Criar testes E2E em `../test/videos/list-videos.e2e-spec.ts` seguindo o padrão de `test/genres/list-genres.e2e-spec.ts`.
- [ ] **T008**: Executar todos os testes e validar o funcionamento completo.
