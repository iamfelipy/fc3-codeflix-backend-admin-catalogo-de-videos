# Implementation Plan: Testes dos Casos de Uso de Vídeo

**Branch**: `003-video-use-cases-tests` | **Date**: 2026-10-15 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/003-video-use-cases-tests/spec.md`

## Summary

Criar testes unitários e de integração para os casos de uso existentes em `src/core/video/application/use-cases`, utilizando os módulos de referência (`cast-member`, `category`, `genre`), limitando as alterações estritamente à camada `core` e sem executar os testes no ambiente.

## Technical Context

**Language/Version**: TypeScript / Node.js

**Primary Dependencies**: Jest, Sequelize, Domain-driven design primitives (`@core/shared`)

**Storage**: In-Memory & SQLite (Sequelize)

**Testing**: Jest (Unit & Integration tests)

**Target Platform**: Node.js / Linux server

**Project Type**: Domain-Driven Design Clean Architecture Core Library (`src/core`)

**Performance Goals**: Standard test execution performance

**Constraints**: Limit changes strictly to test files under `src/core/video/application/use-cases/`; do not execute tests; do not modify `nest-modules`.

**Scale/Scope**: All use cases in `src/core/video/application/use-cases/`.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Architecture Compliance: Follows Clean Architecture / DDD patterns established in reference modules. (Pass)
- Scope Limitation: Strictly limited to `core` layer tests. (Pass)

## Project Structure

### Documentation (this feature)

```text
specs/003-video-use-cases-tests/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
└── quickstart.md        # Phase 1 output
```

### Source Code (repository root)

```text
src/core/video/application/use-cases/
├── create-video/__tests__/
├── update-video/__tests__/
├── get-video/__tests__/
├── list-videos/__tests__/
├── process-audio-video-medias/__tests__/
├── upload-image-medias/__tests__/
└── upload-audio-video-medias/__tests__/
```
