# Plano de implementação: Endpoint REST de listagem e busca de vídeos

**Branch**: `005-video-rest-endpoint` | **Date**: 2026-10-16 | **Spec**: [spec.md](spec.md)

## Resumo

Implementar o endpoint REST `GET /videos` na camada `nest-modules/videos-module`, seguindo como referência o método `search` do `GenresController`. Criar o DTO `SearchVideosDto`, os presenters (`VideoPresenter`, `VideoCollectionPresenter`, `VideoCategoryPresenter`, `VideoGenrePresenter`, `VideoCastMemberPresenter`), injetar o `ListVideosUseCase` em `VideosController` e em `VideosModule`, e criar os testes unitários, de integração e E2E correspondentes.

## Contexto técnico

**Linguagem/versão**: TypeScript 5.1
**Dependências principais**: NestJS, class-validator, class-transformer, Sequelize, `@nestjs/sequelize`
**Armazenamento**: PostgreSQL / SQLite via Sequelize
**Testes**: Jest; testes unitários do controller, testes de integração do controller com Sequelize, e testes E2E (`test/videos/list-videos.e2e-spec.ts`)
**Plataforma-alvo**: Backend NestJS

## Estrutura do projeto

```text
specs/005-video-rest-endpoint/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
└── tasks.md

../src/nest-modules/videos-module/
├── dto/
│   └── search-videos.dto.ts
├── videos.controller.ts
├── videos.module.ts
├── videos.presenter.ts
├── videos.providers.ts
└── __tests__/
    ├── videos.controller.spec.ts
    └── videos.controller.int-spec.ts

../test/videos/
└── list-videos.e2e-spec.ts
```
