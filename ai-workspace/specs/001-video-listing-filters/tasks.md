# Tarefas: filtros da listagem de vídeos

**Entrada**: Documentos de design em `specs/001-video-listing-filters/`

**Pré-requisitos**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `quickstart.md`

**Testes**: Solicitados. Os testes do caso de uso usam repositórios em memória na unidade e repositórios Sequelize no fluxo integrado.

## Fase 1: Preparação

**Objetivo**: Reutilizar a infraestrutura de testes e os helpers existentes; não são necessárias dependências ou configurações novas.

## Fase 2: Fundação

**Objetivo**: `VideoSearchParams`, as abstrações de repositório, os mapeadores e os helpers Sequelize existentes são suficientes. Não são necessárias alterações nesta etapa.

## Fase 3: História de usuário 1 - Encontrar vídeos usando filtros combinados (Prioridade: P1)

**Meta**: Verificar a listagem já implementada com testes unitários e de integração, cobrindo filtros simultâneos e preservando o comportamento existente de busca, ordenação e paginação.

**Teste independente**: Executar os testes unitários com repositórios em memória e os testes de integração com SQL; confirmar filtros individuais e combinados, IDs correspondentes, ausência de duplicatas e consistência de itens, paginação e contagem.

- [X] T001 [US1] Adicionar `ListVideosInput` com os campos existentes de paginação, ordenação, título e filtros de associação em `../src/core/video/application/use-cases/list-videos/list-videos.input.ts`
- [X] T002 [US1] Implementar `ListVideosUseCase` usando `VideoSearchParams`, `IVideoRepository.search`, `VideoOutputMapper` e o mapeamento da saída de paginação em `../src/core/video/application/use-cases/list-videos/list-videos.use-case.ts`
- [X] T003 [US1] Corrigir joins de associação e garantir que IDs de página/contagem SQL filtrados usem as chaves corretas de vídeo e junção, preservando OR dentro das listas e AND entre tipos em `../src/core/video/infra/db/sequelize/video-sequelize.repository.ts`
- [X] T004 [US1] Alinhar o tratamento de listas vazias e filtros simultâneos do repositório em memória aos critérios documentados em `../src/core/video/infra/db/in-memory/video-in-memory.repository.ts`

### Testes da história de usuário 1

- [X] T006 [P] [US1] Criar testes unitários de `ListVideosUseCase` com repositórios em memória para saída, paginação, filtros individuais e combinados, semântica OR/AND, título, filtros vazios e resultados sem correspondência em `../src/core/video/application/use-cases/list-videos/__tests__/list-videos.use-case.spec.ts`
- [X] T007 [P] [US1] Ampliar os testes unitários do repositório em memória para verificar filtros simultâneos por categoria, gênero e membro do elenco e listas vazias em `../src/core/video/infra/db/in-memory/video-in-memory.repository.spec.ts`
- [X] T008 [P] [US1] Criar testes de integração de `ListVideosUseCase` com repositórios Sequelize e dados persistidos, verificando filtros individuais/combinados, OR/AND, listas vazias, associações enriquecidas, ausência de duplicatas e itens/ordenação/paginação/total consistentes em `../src/core/video/application/use-cases/list-videos/__tests__/list-videos.use-case.int-spec.ts`

## Fase 4: Acabamento e aspectos transversais

**Objetivo**: Executar as verificações direcionadas e confirmar que os testes permanecem na camada core solicitada.

- [X] T005 Revisar os arquivos da implementação em relação a `specs/001-video-listing-filters/spec.md` e `specs/001-video-listing-filters/quickstart.md`; manter o código da funcionalidade limitado a `src/core/video`
- [X] T009 Documentar os comandos para executar os testes direcionados e a verificação TypeScript em `specs/001-video-listing-filters/quickstart.md`

## Dependências e ordem de execução

### Dependências entre fases

- As fases de preparação e fundação não exigem alterações de código.
- As tarefas da história de usuário 1 dependem das abstrações existentes de repositório e saída, disponíveis antes da implementação.
- T001 a T005 já concluídas antes desta complementação.
- T006, T007 e T008 alteram arquivos diferentes e podem ser executadas independentemente.
- T009 foi concluída junto com a atualização do guia; a execução das verificações fica fora desta etapa.
- O acabamento depende de todas as tarefas de teste da história de usuário 1.

### Dependências da história de usuário

- **US1 (P1)**: Não depende de outras histórias de usuário; constitui o escopo completo.

### Oportunidades de paralelização

- T006, T007 e T008 podem ser executadas em paralelo porque cada tarefa altera um arquivo de teste diferente.

## Estratégia de implementação

### Priorizar o MVP (História de usuário 1)

1. Criar a cobertura unitária do caso de uso e do repositório em memória.
2. Criar a cobertura de integração do caso de uso com os repositórios SQL.
3. Executar os testes direcionados e a verificação TypeScript antes do commit.

## Observações

- Cada tarefa informa o caminho do arquivo-alvo.
- Alterações nos módulos Nest não fazem parte do escopo.
- Esta etapa complementa a implementação existente somente com testes; não altera os módulos Nest nem o código funcional. A suíte não foi executada nesta etapa.
