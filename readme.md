Olá, o objetivo deste repositório é ser utilizado em entrevistas.

Sobre o sistema:  
Vou comentar decisões de arquitetura, design e requisitos sobre uma aplicação backend para gestão de conteúdo construída no curso Full Cycle. Ela faz parte de um sistema maior de streaming de vídeo (como a Netflix) e ainda não está completa.

---
- c4 model
- Abaixo, há duas imagens do modelo C4: uma visão geral do sistema e outra com um escopo reduzido, para facilitar o entendimento das partes, relações e funções.
- Rótulo da aplicação: Backend - Admin do catálogo de vídeo
![Imagem 2](docs/c4-model-baixa-amplitude.png)
![Imagem 1](docs/c4-model-ampla.png)

---

- domain driven design
  - utilizei ddd para modelar a complexidade essencial:
    - conceitos, regras de negócio, agregados, objetos de valor, repositórios e linguagem ubíqua.
  - subdomínio/bounded context: gestão de conteúdo
    - cast-member: membros do elenco
    - categoria: filme, documentário
    - gênero: ação, terror
    - eles compõem o agregado vídeo, que ainda não foi implementado.
    - src/core/cast-member/domain
---

- clean architecture
![clean-architecture](docs/clean-architecture.jpg)
  - utilizei clean architecture para separar responsabilidades
  - entities: 
    - src/core/cast-member/domain
  - application: 
    - intenções do usuário
    - orquestração
    - src/core/cast-member/application
  - higher layers: 
    - gateways:
      - src/core/category/infra/db/sequelize/category-sequelize.repository.ts
    - controllers:
      - src/nest-modules/cast-members-module/cast-members.controller.ts
    - presenters:
      - src/nest-modules/cast-members-module/cast-members.presenter.ts
    - src/nest-modules

---

- testes
  - triple aaa
  - unitário
    - src/core/cast-member/application/use-cases/create-cast-member/__tests__/create-cast-member.use-case.spec.ts
  - integração
    - src/core/cast-member/application/use-cases/create-cast-member/__tests__/create-cast-member.use-case.int-spec.ts
  - e2e
    - test/cast-members
  - repositórios em memória
    - reduzir a quantidade de mocks inline
    - src/core/shared/infra/db/in-memory/in-memory.repository.ts
  - test data builder
    - src/core/genre/domain/genre-fake.builder.ts
  - fixtures
    - lógica reutilizável para testes
    - src/nest-modules/genres-module/testing/genre-fixture.ts

---

- solid, poo
  - srp
    - faz apenas uma coisa
    - usecase apenas com execute e composição
      - src/core/cast-member/application/use-cases/create-cast-member/create-cast-member.use-case.ts
  - ocp
    - permite mudar o comportamento
    - validação
      - class-validator para cast-member-validator
        - src/core/cast-member/domain/cast-member.validator.ts
    - repository
      - GenreSearchParams, GenreSearchResult
        - src/core/category/infra/db/sequelize/category-sequelize.repository.ts
      - inmemory, search, applyFilter, applyPaginate, applySort
        - src/core/shared/infra/db/in-memory/in-memory.repository.ts
  - lsp
    - garantir que subclasses possam substituir as superclasses sem alterar o comportamento correto do sistema
  - isp
    - não herdar algo que não utiliza
    - separar crud e search
      - src/core/shared/domain/repository/repository-interface.ts
  - dip
    - depender de abstrações e não de implementações concretas
    - src/nest-modules/cast-members-module/cast-members.providers.ts
---

- persistence
  - database
    - model
      - src/core/genre/infra/db/sequelize/genre-model.ts
    - mapper
      - src/core/genre/infra/db/sequelize/genre-model-mapper.ts
    - repository
      - src/core/genre/infra/db/sequelize/genre-sequelize.repository.ts
    - transaction (acid)
      - src/core/shared/infra/db/sequelize/unit-of-work-sequelize.ts
    - orm
      - sequelize
        - active record
      - vendor lock-in, decouple
    - cardinality
      - quantidade de associações nessas relações
      - hasMany, many-to-many
        - src/core/genre/infra/db/sequelize/genre-model.ts
    - mysql
      - banco de dados relacional
      - index
      - integridade referencial
      - constrains
   
---
- communication
  - http
    - rest api
      - nouns, verbs
      - src/nest-modules/cast-members-module/cast-members.controller.ts
 
---
- error handling
  - exception
    - src/core/shared/domain/errors
  - throw
  - either
    - src/core/genre/domain/genre.repository.ts
  - nestjs
    - filter
---
- tecnologias usadas no projeto
  - typescript
  - nest
  - sequelize
---
- framework
  - nest
    - class-validator
    - class-transform
    - interceptor
    - pipe
    - handlers
    - filters
    - test
    - injeção de dependência
---
- outros
  - shared kernel
    - compartilhar logica
    - src/core/shared
    - src/nest-modules/shared-module
  - ports and adapters
    - desacoplar, atualizar componentes, separar complexidades
    - src/core/shared/domain/repository/repository-interface.ts
  - unit of work
  - modulos
    - coesão, desacoplar
  - validação
    - separação validação de sintaxe e regras de negocio
---
- melhorias futuras
  - migrations
  - docker
  - events
  - autenticação e autorização
  - observabilidade
    - logs
  - ci/cd
  - config
    - environments
  - cache
  - mensageria
  - devcontainer
  - como executar o projeto
