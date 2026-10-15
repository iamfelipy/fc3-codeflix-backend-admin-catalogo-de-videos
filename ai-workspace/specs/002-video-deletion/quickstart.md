# Quickstart: Exclusão de Vídeos

## Overview

This guide outlines how to validate the video deletion functionality in the `core` layer (`src/core/video`).

## Prerequisites

- TypeScript / Node.js development environment
- Access to `src/core/video` and test suites

## Validation Scenarios

1. **Unit Testing (`delete-video.use-case.spec.ts`)**:
   - Verify throwing `InvalidUuidError` when an invalid ID format is provided.
   - Verify throwing `NotFoundError` when attempting to delete a video ID that does not exist.
   - Verify successful removal of a video entity from the in-memory repository when a valid existing ID is provided.

2. **Integration Testing (`delete-video.use-case.int-spec.ts`)**:
   - Verify interaction between `DeleteVideoUseCase` and `VideoSequelizeRepository` using an in-memory test database (SQLite).
   - Verify database record deletion when executing the use case with a valid video ID stored in Sequelize.
