# Especificação de Funcionalidade: Exclusão de Vídeos

**Feature Branch**: `002-video-deletion`

**Created**: 2026-10-15

**Status**: Draft

**Input**: User description: "Tarefa 2 — Exclusão de vídeos Implementar a funcionalidade de exclusão de vídeos na camada `core`, respeitando a arquitetura e os padrões existentes no projeto. Utilizar como referência as implementações em: - `src/core/cast-member` - `src/core/category` - `src/core/genre` A exclusão deve seguir a modelagem existente, utilizando exclusão lógica (*Soft Delete*) ou exclusão física (*Hard Delete*), conforme aplicável. ## Testes Criar os testes unitários e de integração necessários para a funcionalidade de exclusão de vídeos, seguindo os padrões dos módulos de referência. **Restrições:** - Limitar as alterações à camada `core` e aos respectivos testes. - Não executar os testes criados nem outros testes do projeto. - Não implementar alterações fora do escopo da exclusão de vídeos."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Excluir Vídeo por ID na Camada Core (Priority: P1)

Como desenvolvedor utilizando a camada `core` da aplicação, quero poder excluir um vídeo existente informando seu identificador único (ID), para que registros indesejados ou obsoletos sejam removidos do sistema conforme a modelagem da entidade de vídeo.

**Why this priority**: É a funcionalidade principal da tarefa solicitada, permitindo o gerenciamento completo do ciclo de vida dos vídeos na camada `core`.

**Independent Test**: Pode ser totalmente testado instanciando o Caso de Uso de exclusão de vídeo com um repositório simulado (mock) ou em memória, executando a exclusão com um ID válido e verificando a remoção do registro, bem como a validação de erro ao tentar excluir um ID inexistente.

**Acceptance Scenarios**:

1. **Given** que existe um vídeo cadastrado com um ID válido, **When** o caso de uso de exclusão de vídeo é executado com esse ID, **Then** o vídeo é removido com sucesso do repositório.
2. **Given** que não existe nenhum vídeo cadastrado com o ID fornecido, **When** o caso de uso de exclusão de vídeo é executado com esse ID, **Then** um erro indicando que o vídeo não foi encontrado (`NotFoundException`) é lançado.

### Edge Cases

- O que acontece quando é fornecido um ID nulo, vazio ou em formato inválido? O sistema deve rejeitar a entrada com uma exceção de validação apropriada.
- O que acontece quando ocorre uma falha na infraestrutura de persistência durante a exclusão? O repositório ou caso de uso deve propagar o erro adequadamente.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema MUST disponibilizar um Caso de Uso (`DeleteVideoUseCase`) na camada de aplicação para exclusão de vídeos.
- **FR-002**: O Caso de Uso de exclusão MUST aceitar como entrada um objeto de requisição contendo o ID do vídeo a ser excluído.
- **FR-003**: O repositório de vídeos (`VideoRepository`) MUST prover método(s) adequado(s) para suportar a operação de exclusão conforme a modelagem definida para a entidade de vídeo.
- **FR-004**: O sistema MUST validar a existência do vídeo pelo ID antes de efetivar a exclusão, lançando uma exceção de não encontrado caso o registro não exista.
- **FR-005**: Testes unitários e de integração MUST ser implementados para cobrir o Caso de Uso de exclusão de vídeos, seguindo os padrões estabelecidos em `cast-member`, `category` e `genre`.

### Key Entities

- **Video**: Agregado raiz que representa o vídeo, contendo atributos como ID, título, descrição, ano de lançamento, duração, classificação, etc.
- **VideoRepository**: Interface de repositório responsável pelas operações de persistência e consulta da entidade Video.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% dos cenários de sucesso e falha (ID existente, ID inexistente, ID inválido) do Caso de Uso de exclusão possuem cobertura de testes unitários e de integração.
- **SC-002**: A implementação da exclusão de vídeos segue rigorosamente os padrões arquiteturais e estruturais dos módulos de referência (`cast-member`, `category`, `genre`).
- **SC-003**: As alterações limitam-se estritamente à camada `core` e aos respectivos arquivos de teste.

## Assumptions

- A modelagem atual da entidade Video define exclusão física ou lógica conforme implementado no repositório e aggregate de Video existentes.
- Os módulos de referência (`cast-member`, `category`, `genre`) servem como guia definitivo para a estrutura de pastas, classes, injeção de dependências e testes.
