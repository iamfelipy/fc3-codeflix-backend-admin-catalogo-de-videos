# Especificação da funcionalidade: Endpoint REST de listagem e busca de vídeos

**Feature Branch**: `005-video-rest-endpoint`

**Criado em**: 2026-10-16

**Status**: Aprovado

**Entrada**: Descrição do usuário: "Tarefa 5 — Endpoint REST de listagem e busca de vídeos. Implementar o endpoint REST GET /videos na camada nest-modules, seguindo como referência o método search existente em src/nest-modules/genres-module/genres.controller.ts. Criar os testes unitários, de integração e E2E necessários para validar o endpoint de listagem e busca de vídeos, seguindo os padrões existentes no módulo de gêneros e em test/genres."

## Cenários de uso e testes

### História de usuário 1 - Listar e buscar vídeos via API REST (Prioridade: P1)

Um cliente da API envia uma requisição `GET /videos` com parâmetros opcionais de paginação (`page`, `per_page`), ordenação (`sort`, `sort_dir`), busca por título (`search`) e filtros de associação (`categories_id`, `genres_id`, `cast_members_id`), e recebe a lista paginada de vídeos formatada por apresentadores (`VideoCollectionPresenter` / `VideoPresenter`), seguindo o padrão estabelecido no módulo de gêneros (`GenresController`).

**Motivo desta prioridade**: Expor o caso de uso de listagem de vídeos através de um endpoint REST é essencial para consumo externo e integração com a interface da aplicação.

**Teste independente**: Fazer requisições HTTP GET para `/videos` com diferentes parâmetros e verificar os códigos de status, payloads JSON retornados, metadados de paginação e filtros aplicados.

**Cenários de aceitação**:

1. **Dado** vídeos cadastrados no sistema, **quando** uma requisição `GET /videos` é realizada sem parâmetros, **então** a API retorna o status 200 e a primeira página de vídeos com paginação padrão e apresentador adequado.
2. **Dado** vídeos cadastrados com títulos e associações específicas, **quando** uma requisição `GET /videos?search=...&categories_id[]=...` é realizada, **então** a API retorna os vídeos filtrados e paginados correspondentes.
3. **Dado** testes unitários do controller, **quando** o `VideosController` é executado com mocks do `ListVideosUseCase`, **então** ele delega corretamente os parâmetros da requisição para o input do caso de uso e retorna o presenter formatado.
4. **Dado** testes de integração do controller, **quando** `VideosController` é integrado com o módulo e repositório Sequelize, **então** as requisições HTTP retornam os dados persistidos corretamente.
5. **Dado** testes E2E (End-to-End), **quando** requisições HTTP são enviadas para a aplicação NestJS em execução de teste para `/videos`, **então** o fluxo completo desde o endpoint HTTP até o banco de dados e retorno do presenter é validado com sucesso.

### Casos extremos

- Parâmetros de paginação inválidos ou filtros com formatos incorretos acionam validações de DTO / filtros existentes (ex: `SearchVideosDto`).
- Requisições sem registros correspondentes retornam lista vazia com contagem total igual a zero.

## Requisitos

### Requisitos funcionais

- **FR-001**: O módulo de vídeos (`VideosModule`) DEVE expor o endpoint `GET /videos` no `VideosController`.
- **FR-002**: O endpoint DEVE aceitar parâmetros de busca e filtragem através de um DTO (`SearchVideosDto` ou equivalente adequado) alinhado com o `ListVideosInput`.
- **FR-003**: O método de busca do controller DEVE invocar o `ListVideosUseCase` injetado no módulo.
- **FR-004**: A resposta do endpoint DEVE ser serializada através de `VideoCollectionPresenter` (ou presenter correspondente para listagem de vídeos).
- **FR-005**: Provedores e injeção de dependência no `VideosModule` DEVEM registrar o caso de uso de listagem e repositório Sequelize de vídeos adequadamente.

### Requisitos de testes

- **TR-001**: O módulo de vídeos DEVE conter testes unitários para o `VideosController` (`videos.controller.spec.ts`), cobrindo o método de busca (`search`).
- **TR-002**: O módulo de vídeos DEVE conter testes de integração para o `VideosController` (`videos.controller.int-spec.ts`) integrando com o banco de dados Sequelize e repositório.
- **TR-003**: Devem ser criados testes E2E (`test/videos/list-videos.e2e-spec.ts` ou equivalentes) seguindo o padrão de `test/genres/list-genres.e2e-spec.ts`.

### Entidades principais

- **Vídeo (Controller, DTO, Presenter, UseCase)**: Componentes da camada `nest-modules/videos-module` integrados com a camada `core/video`.

## Critérios de sucesso

### Resultados mensuráveis

- **SC-001**: O endpoint `GET /videos` responde corretamente a requisições com paginação, ordenação, busca e filtros.
- **SC-002**: Todos os testes unitários, de integração e E2E do módulo de vídeos passam com sucesso sem regressões.
