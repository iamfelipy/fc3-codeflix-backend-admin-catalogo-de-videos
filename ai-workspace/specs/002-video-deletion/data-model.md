# Data Model: Exclusão de Vídeos

## Entities & Value Objects

- **VideoId**: Value Object representing the unique identifier of a Video (extends `Uuid`).
- **Video**: Aggregate Root representing a video entity in the system.
- **IVideoRepository**: Repository interface providing `delete(id: VideoId): Promise<void>` and other persistence operations.

## Input/Output DTOs

- **DeleteVideoInput**:
  - `id`: string (UUID format)
- **DeleteVideoOutput**:
  - `void`
