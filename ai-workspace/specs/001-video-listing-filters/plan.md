# Plano de implementação: filtros da listagem de vídeos e testes

**Branch**: `001-video-listing-filters` | **Date**: 2026-10-12 | **Spec**: [spec.md](spec.md)

## Resumo

Complementar a listagem de vídeos já implementada com testes unitários e de integração para o caso de uso e o comportamento de busca dos repositórios. Reutilizar a infraestrutura existente de vídeo, manter a cobertura unitária isolada em memória e validar o fluxo persistente com Sequelize, incluindo filtros simultâneos, paginação e contagem. Esta etapa não altera a funcionalidade de produção.

## Contexto técnico

**Linguagem/versão**: TypeScript 5.1
**Dependências principais**: Repositório pesquisável compartilhado existente, Sequelize 6 e convenções de class-validator/class-transformer
**Armazenamento**: Banco de dados SQL com Sequelize; repositório em memória para o comportamento do core
**Testes**: Jest; testes unitários do caso de uso com repositórios em memória e testes de integração com os repositórios Sequelize/helpers de banco existentes em `src/core/video`
**Plataforma-alvo**: Core do backend Node.js
**Tipo de projeto**: Aplicação backend em camadas, com arquitetura limpa e core baseado em DDD
**Metas de desempenho**: Não introduzir mudanças de desempenho; os testes devem detectar itens duplicados e divergências entre resultados paginados e contagem
**Restrições**: Alterar somente arquivos de teste em `src/core/video`; não modificar `src/nest-modules` nem a implementação funcional já existente
**Escala/escopo**: Testes do caso de uso de listagem e dos repositórios em memória e Sequelize para os filtros de categorias, gêneros e membros do elenco

## Verificação da constituição

A constituição versionada contém marcadores de modelo ainda não preenchidos, em vez de critérios definidos. Aplicar a arquitetura e a pirâmide de testes documentadas no README: manter os testes do core em `src/core/video`, usar repositórios em memória para a cobertura unitária e repositórios persistentes para integração. Não é necessária nenhuma exceção arquitetural.

## Estrutura do projeto

```text
specs/001-video-listing-filters/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
└── tasks.md

../src/core/video/
├── application/use-cases/list-videos/
│   ├── list-videos.input.ts
│   ├── list-videos.use-case.ts
│   └── __tests__/
│       ├── list-videos.use-case.spec.ts
│       └── list-videos.use-case.int-spec.ts
├── domain/video.repository.ts
└── infra/db/
    ├── in-memory/
    │   ├── video-in-memory.repository.ts
    │   └── video-in-memory.repository.spec.ts
    └── sequelize/
        ├── video-sequelize.repository.ts
        └── __tests__/video-sequelize.repository.int-spec.ts
```

**Decisão de estrutura**: Manter os testes do caso de uso junto ao caso de uso e ampliar os arquivos de teste dos repositórios existentes. Os testes unitários usam repositórios em memória; os testes de integração usam os modelos e helpers de banco já existentes. Não serão criadas interfaces externas nem alterado código de produção.

## Acompanhamento da complexidade

Não há violações da constituição nem complexidade arquitetural adicional.
