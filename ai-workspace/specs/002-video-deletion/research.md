# Research: Exclusão de Vídeos

## Architecture & Pattern Analysis

Reference modules (`cast-member`, `category`, `genre`) implement delete functionality via:
1. **Use Case (`DeleteXUseCase`)**:
   - Implements `IUseCase<DeleteXInput, DeleteXOutput>`.
   - Injects repository interface (`IXRepository`).
   - Instantiates value object identifier (`XId(input.id)`).
   - Calls `repository.delete(id)`.
2. **Repository (`XRepository`)**:
   - Extends `IRepository` / `ISearchableRepository`, which provides `delete(id: XId)`.
   - In-memory repository removes the item from its internal array.
   - Sequelize repository performs physical/logical deletion in the database as mapped by the aggregate/model.
3. **Unit Tests (`delete-x.use-case.spec.ts`)**:
   - Tests invalid UUID / not found error handling (`InvalidUuidError`, `NotFoundError`).
   - Tests successful deletion of an entity.
4. **Integration Tests (`delete-x.use-case.int-spec.ts`)**:
   - Tests interaction with Sequelize repository against a real database / SQLite in-memory instance.

## Decisions

- **Decision**: Mirror the exact architectural pattern and test structure used in `delete-category`, `delete-genre`, and `delete-cast-member`.
- **Rationale**: Ensures consistency across all core aggregate modules, maintainability, and adherence to established project conventions.
- **Alternatives Considered**: Direct repository method calls without a use case; rejected because all other modules encapsulate business/application logic in dedicated use cases implementing `IUseCase`.
