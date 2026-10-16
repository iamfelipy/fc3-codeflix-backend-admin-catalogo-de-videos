# Tasks: Ampliar Testes de Busca do Repositório de Vídeos

**Input**: Design documents from `/specs/004-video-repo-search-tests/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Inspect existing test suite structure in video repository

- [x] T001 Inspect existing test cases inside `describe('search method tests', () => {})` in `src/core/video/infra/db/sequelize/__tests__/video-sequelize.repository.int-spec.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Verify repository test environment setup

- [x] T002 Verify test helpers and database setup for video repository integration tests

---

## Phase 3: User Story 1 - Criar Testes Adicionais para o Método Search no Repositório Sequelize de Vídeos (Priority: P1) 🎯 MVP

**Goal**: Complementar os cenários de busca ausentes no método `search` em `src/core/video/infra/db/sequelize/__tests__/video-sequelize.repository.int-spec.ts` sem sobrescrever os testes existentes.

**Independent Test**: Garantir que novos testes complementares para paginação, ordenação e filtros combinados sejam adicionados com sucesso ao arquivo de teste de integração.

### Implementation for User Story 1

- [x] T003 [US1] Add complementary integration test for advanced pagination and per_page limits in `src/core/video/infra/db/sequelize/__tests__/video-sequelize.repository.int-spec.ts`
- [x] T004 [US1] Add complementary integration test for sorting combinations (sort and sort_dir) in `src/core/video/infra/db/sequelize/__tests__/video-sequelize.repository.int-spec.ts`
- [x] T005 [US1] Add complementary integration test for combined filters (title, categories, genres, cast members) in `src/core/video/infra/db/sequelize/__tests__/video-sequelize.repository.int-spec.ts`

**Checkpoint**: At this point, all complementary search test scenarios should be fully added and integrated.

---

## Phase 4: Polish & Cross-Cutting Concerns

**Purpose**: Final verification of scope and non-destructive additions

- [x] T006 Verify all changes are strictly limited to adding test cases in `src/core/video/infra/db/sequelize/__tests__/video-sequelize.repository.int-spec.ts` and that existing tests were preserved.

## Dependencies & Execution Order

- Phase 1 & 2 before Phase 3.
- Phase 3 tasks run sequentially or in parallel within the test file.
- Phase 4 after Phase 3.

---

## Phase 5: Convergence

**Purpose**: Close the gap between specified test coverage and actual implementation in the test file.

- [x] T007 Implementar os testes de integração para filtros por `categories_id` em `src/core/video/infra/db/sequelize/__tests__/video-sequelize.repository.int-spec.ts` per FR-002 (missing)
- [x] T008 Implementar os testes de integração para filtros por `genres_id` e `cast_members_id` em `src/core/video/infra/db/sequelize/__tests__/video-sequelize.repository.int-spec.ts` per FR-002 (missing)
- [x] T009 Implementar os testes de integração para ordenação combinada com filtros em `src/core/video/infra/db/sequelize/__tests__/video-sequelize.repository.int-spec.ts` per FR-002 (missing)
