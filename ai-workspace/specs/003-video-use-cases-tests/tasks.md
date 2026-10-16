# Tasks: Testes dos Casos de Uso de Vídeo

**Input**: Design documents from `/specs/003-video-use-cases-tests/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Inspect reference modules for test patterns and setup helpers

- [ ] T001 Inspect test patterns in `../src/core/category`, `../src/core/genre`, and `../src/core/cast-member`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure verification

- [ ] T002 Verify test helpers and repository mocks availability for video use case testing

---

## Phase 3: User Story 1 - Criar Testes Unitários e de Integração para os Casos de Uso de Vídeo (Priority: P1) 🎯 MVP

**Goal**: Criar testes unitários e de integração para todos os casos de uso de vídeo em `../src/core/video/application/use-cases/`.

**Independent Test**: Garantir que os arquivos `.spec.ts` e `.int-spec.ts` estejam criados para cada caso de uso cobrindo sucesso e falha (ex: NotFoundError).

### Tests for Create Video Use Case

- [ ] T003 [P] [US1] Create unit test for CreateVideoUseCase in `../src/core/video/application/use-cases/create-video/__tests__/create-video.use-case.spec.ts`
- [ ] T004 [P] [US1] Create integration test for CreateVideoUseCase in `../src/core/video/application/use-cases/create-video/__tests__/create-video.use-case.int-spec.ts`

### Tests for Update Video Use Case

- [ ] T005 [P] [US1] Create unit test for UpdateVideoUseCase in `../src/core/video/application/use-cases/update-video/__tests__/update-video.use-case.spec.ts`
- [ ] T006 [P] [US1] Create integration test for UpdateVideoUseCase in `../src/core/video/application/use-cases/update-video/__tests__/update-video.use-case.int-spec.ts`

### Tests for Get Video Use Case

- [ ] T007 [P] [US1] Create unit test for GetVideoUseCase in `../src/core/video/application/use-cases/get-video/__tests__/get-video.use-case.spec.ts`
- [ ] T008 [P] [US1] Create integration test for GetVideoUseCase in `../src/core/video/application/use-cases/get-video/__tests__/get-video.use-case.int-spec.ts`

### Tests for Process Audio Video Medias Use Case

- [ ] T009 [P] [US1] Create unit test for ProcessAudioVideoMediasUseCase in `../src/core/video/application/use-cases/process-audio-video-medias/__tests__/process-audio-video-medias.use-case.spec.ts`
- [ ] T010 [P] [US1] Create integration test for ProcessAudioVideoMediasUseCase in `../src/core/video/application/use-cases/process-audio-video-medias/__tests__/process-audio-video-medias.use-case.int-spec.ts`

### Tests for Upload Image Medias Use Case

- [ ] T011 [P] [US1] Create unit test for UploadImageMediasUseCase in `../src/core/video/application/use-cases/upload-image-medias/__tests__/upload-image-medias.use-case.spec.ts`
- [ ] T012 [P] [US1] Create integration test for UploadImageMediasUseCase in `../src/core/video/application/use-cases/upload-image-medias/__tests__/upload-image-medias.use-case.int-spec.ts`

### Tests for Upload Audio Video Medias Use Case

- [ ] T013 [P] [US1] Create unit test for UploadAudioVideoMediasUseCase in `../src/core/video/application/use-cases/upload-audio-video-medias/__tests__/upload-audio-video-medias.use-case.spec.ts`
- [ ] T014 [P] [US1] Create integration test for UploadAudioVideoMediasUseCase in `../src/core/video/application/use-cases/upload-audio-video-medias/__tests__/upload-audio-video-medias.use-case.int-spec.ts`

**Checkpoint**: At this point, all video use case test suites should be fully implemented.

---

## Phase 4: Polish & Cross-Cutting Concerns

**Purpose**: Final verification of scope and constraints

- [ ] T015 Verify all changes are strictly limited to test files under `../src/core/video/application/use-cases/` and that no tests were executed.

## Dependencies & Execution Order

- Phase 1 & 2 before Phase 3.
- Phase 3 tasks marked [P] can run in parallel.
- Phase 4 after Phase 3.
