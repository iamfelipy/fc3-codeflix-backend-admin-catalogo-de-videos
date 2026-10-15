# Tarefas: Exclusão de Vídeos

**Entrada**: Documentos de design em `/specs/002-video-deletion/`

**Pré-requisitos**: plan.md (obrigatório), spec.md (obrigatório para histórias de usuário), research.md, data-model.md

**Organização**: As tarefas são agrupadas por história de usuário para possibilitar implementação e testes independentes de cada história.

## Formato: `[ID] [P?] [Story] Descrição`

- **[P]**: Pode rodar em paralelo (arquivos diferentes, sem dependências)
- **[Story]**: A que história de usuário esta tarefa pertence (ex: US1)
- Inclua caminhos exatos de arquivos nas descrições

## Fase 1: Preparação (Infraestrutura Compartilhada)

**Propósito**: Verificar estrutura do projeto e implementações de referência

- [ ] T001 Inspecionar implementações de delete de referência em `../src/core/category`, `../src/core/genre` e `../src/core/cast-member`

---

## Fase 2: Fundacional (Pré-requisitos Bloqueadores)

**Propósito**: Infraestrutura core que DEVE estar pronta antes de QUALQUER história de usuário ser implementada

**⚠️ CRÍTICO**: Estruturas de repositório e agregado já existem em `../src/core/video`.

- [ ] T002 Verificar se a interface `IVideoRepository` em `../src/core/video/domain/video.repository.ts` inclui o método `delete` via `IRepository` / `ISearchableRepository`

---

## Fase 3: História de Usuário 1 - Excluir Vídeo por ID na Camada Core (Prioridade: P1) 🎯 MVP

**Objetivo**: Implementar o caso de uso `DeleteVideoUseCase` com testes unitários e de integração na camada `core` (`../src/core/video`).

**Teste Independente**: Testar a exclusão via repositório in-memory (sucesso e erro de não encontrado) e via repositório Sequelize.

### Testes para História de Usuário 1

- [ ] T003 [P] [US1] Criar teste unitário para `DeleteVideoUseCase` em `../src/core/video/application/use-cases/delete-video/__tests__/delete-video.use-case.spec.ts`
- [ ] T004 [P] [US1] Criar teste de integração para `DeleteVideoUseCase` com repositório Sequelize em `../src/core/video/application/use-cases/delete-video/__tests__/delete-video.use-case.int-spec.ts`

### Implementação para História de Usuário 1

- [ ] T005 [US1] Implementar `DeleteVideoUseCase` em `../src/core/video/application/use-cases/delete-video/delete-video.use-case.ts`

**Checkpoint**: Neste ponto, a História de Usuário 1 deve estar totalmente funcional e testável de forma independente

---

## Fase 4: Refinamento & Questões Transversais

**Propósito**: Revisão final da estrutura do código e aderência às restrições de arquitetura

- [ ] T006 Verificar se todas as alterações estão estritamente limitadas a `../src/core/video` e aos arquivos de teste correspondentes

## Dependências & Ordem de Execução

- **Fases 1 e 2** devem ser concluídas primeiro.
- **Fase 3 (História de Usuário 1)** depende da Fase 2.
- **Fase 4 (Refino)** depende da Fase 3.

## Exemplos de Execução Paralela

- T003 e T004 podem ser criados em paralelo.
