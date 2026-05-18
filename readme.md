# microserviço, backend: Admin catalogo de vídeo - Codeflix 

### c4 model
![Imagem 2](docs/c4-model-baixa-amplitude.png)
![Imagem 1](docs/c4-model-ampla.png)

---

### caracteristica do projeto
- microserviço da parte administrativa do catalogo de video
- typescript, javascript
- clean architecture, domain driven design, solid, conceitos da arquitetura de microserviços, design patterns
- piramide de testes, tdd
- framework backend: nestjs
- spa: frontend conversa com o backend de administração de video
- api rest
- storage - google cloude storage - assets(imagens, videos)
- sincronizando dados usando kafka connect
- comunicação assincrona com rabbitmq
- construir o nucleo primeiro e deixar o mais puro possivel
    - manter livre de tecnologia
    - mantivel ao longo do tempo e independente de tecnologia
    - consigo trocar os frameworks com essa estrategia, ex: nestjs, express, banco
    - uncle bob - framework é detalhe
- utlizando conceitos de uma modelagem mais rica, facilita o entendimento da arquitetura em camadas do software de forma mais madura
- ddd: domain driven design
  - design tatico
    - entidade, objeto de valor, repository

----
### etapas de construção da aplicação backend
- Montagem do ambiente de desenvolvimento (Docker e IDE)
- modelar o core(regras de negocio, ...) antes de ir para o framework nestjs, usando ddd e clean archtecture
- criar uma pasta shared(logica compartilhavel)
- Criar uma aplicação TypeScript (core)
  - Criar entidade de Categoria
  - Criar testes (pirâmide de testes)
    - unitario, integração
  - Criar Casos de Uso e Repositório
  - Nest.js - Criação de API Rest
  - Criar testes e2e (end-to-end)
  - Repetir para as outras entidades, cast member, genre, video
- Integração com RabbitMQ e Encoder de vídeo
- keycloak
- logs
  - rastrear comportamento
- CI
  - esteira no github actions
  - docker file para produção
      - imagem menor, otimizada
      - vai ser usada no cd

---
### generico
- config: carregar variveis de ambiente com dotenv
  - normalmente o dotenv é usado apenas em desenvolvimento para carregar variáveis de ambiente locais, não em produção, onde variáveis já devem estar definidas no ambiente do servidor/container.
- /core: contem as principais operações do dominio, com poucas influencia do nestjs

----
### usecases
  - category
    - Create: Criação de uma nova categoria.
    - Update: Atualização de uma categoria existente.
    - Delete: Remoção de uma categoria.
    - Get: Recuperação de uma categoria específica.
    - Search/List: Listagem e busca de categorias.
----

### database, persistence
  - repository 
    - search(filter, sort, paginate), crud
  - inmemory
  - mysql, sqlite
  - orm: sequelize
  - mapper
  - design pattern - active record

---

### api rest
- recursos
  - categories
  - genres
  - cast members
  - videos
---
### hexagonal - ports and adapters
- usecase
  - port: ICategoryRepository
  - adapter: CategorySequelizeRepository, CategoryInMemoryRepository
---
### solid
- srp
  - usecase: execute, validação input
  - repository: mapper, helper
- open/closed principle (OCP):
  - class-validator: validação da entidade
- liskov substitution principle (LSP):
  - garantir que subclasses de repositórios, use cases ou entidades possam substituir as superclasses sem alterar a corretude do comportamento do sistema
- interface segregation
  - IRepository e ISearchableRepository separados
- d: dependecy inversion
  - usecase
    - constructor
      - repository
  - repository
    - constructor
      - sequelize
---
### DDD
  - entities
    - category
      - é qualquer agrupamento de elementos com características em comum, usado para classificar, organizar ou estruturar informações, objetos ou conceitos.
  - object value
    - uuid, search-params, search-result
  - repository
    - category
  - commit sem nestjs: 73137dbf9f8a561f3be342723fb982a4cdd73ec3

---

### validações e lançamento de exceções
  - separação das validações de dominio(regras de dominio) vs validações de sintaxe
  - class-validator
    - categoryRules
  - mudando de lançar exceções de cada erro para notification pattern(acumular erros e no final fazer algo no usecase), isso depende do caso

---

### configurações de qualidade
- Configuração de Qualidade (QA)
  - ferramentas de qualidade para garantir a integridade do código, assegurando cobertura de testes e tipagem correta.
    - jest, typescript
    - eslint, prettier
  - cobertura de testes
    - Configurado o Jest para que a execução falhe caso a cobertura de código (code coverage) seja inferior a 80%.
  - Verificação de Tipagem:
    - Criado um script NPM chamado tsc:check que execute o compilador do TypeScript apenas para verificação (sem gerar build), garantindo que não existam erros de tipagem no projeto.

---
### testes
- tdd(test driven development), triple aaa(arrange, act, assert), piramidade de testes
- fluent pattern, Test Data Builder(Gof - criacional)
  - CategoryFakeBuilder
  - ValidatorRules
- helpers/setup test sequelize
- fixtures
- quantidade de testes:
  - unidade: 76
  - integração: 1
----

### nestjs

- versão da cli: @nestjs/cli@10.1.17

- inicializa um novo projeto
  - nest new nest
    - select: npm


----
### rodar o projeto

- instalar o docker
- extensoes vscode
  - devcontainer
  - eslint
    - regra de codigo
  - pretty
    - formatar
  - jest
    - botão no codigo
    - icones de quimica - arvore de testes
    - executa apenas o teste isolado
    - jest
      - orta.vscode-jest
    - jest runner
      - firsttris.vscode-jest-runner
- definir variveis de ambiente no envs, usar *.example como base

----
### comandos
```bash
# executar o projeto com devcontainer
instalar extensão dev container
ctrl + shift + p 
> dev container: reopen in container

---
tests
npm run test
npm run test — — watch

---
# executando o projeto sem devcontainer
  # Executar docker compose na raiz do projeto, para os caminhos funcionarem
docker compose -f docker/docker-compose.yml up
docker compose -f docker/docker-compose.yml up --build

# acessar container
docker exec -it fc3-codeflix-backend-admin-catalogo bash

---
# --noEmit = verifica erros sem gerar arquivos .js
 "tsc:check": "tsc --noEmit"

```

---
projeto pai:
[Link para o projeto pai](https://github.com/iamfelipy/fc3-codeflix-netflix)