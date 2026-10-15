# Implementation Plan: Exclusão de Vídeos

**Branch**: `002-video-deletion` | **Date**: 2026-10-15 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/002-video-deletion/spec.md`

## Summary

Implementar a funcionalidade de exclusão de vídeos (`DeleteVideoUseCase`) na camada `core` (`src/core/video`), respeitando a arquitetura e os padrões existentes nos módulos de referência (`cast-member`, `category`, `genre`), incluindo testes unitários e de integração.

## Technical Context

**Language/Version**: TypeScript / Node.js

**Primary Dependencies**: Domain-driven design primitives, `@core/shared`, Sequelize / In-Memory repository implementations

**Storage**: In-Memory & Sequelize (Relational database mapping)

**Testing**: Jest (Unit & Integration tests)

**Target Platform**: Node.js / Linux server

**Project Type**: Domain-Driven Design Clean Architecture Core Library (`src/core`)

**Performance Goals**: Standard in-memory / database query performance (<50ms per deletion)

**Constraints**: Limit changes strictly to `src/core/video` and corresponding test files; do not run tests as per constraints.

**Scale/Scope**: Single aggregate core module feature extension.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Architecture Compliance: Follows Clean Architecture / DDD patterns established in `cast-member`, `category`, and `genre`. (Pass)
- Scope Limitation: Strictly limited to `core` layer and tests. (Pass)

## Project Structure

### Documentation (this feature)

```text
specs/002-video-deletion/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
src/core/video/
├── application/
│   └── use-cases/
│       └── delete-video/
│           ├── delete-video.use-case.ts
│           └── __tests__/
│               ├── delete-video.use-case.spec.ts
│               └── delete-video.use-case.int-spec.ts
```

**Structure Decision**: Add `delete-video` use case under `src/core/video/application/use-cases/` with unit and integration tests mirroring `delete-category`, `delete-genre`, and `delete-cast-member`.
