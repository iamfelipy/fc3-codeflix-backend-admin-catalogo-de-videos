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
  - criei suportando configurações alem do .env, assim respeitando twelve-factory - chapter 3
  - normalmente o dotenv é usado apenas em desenvolvimento para carregar variáveis de ambiente locais, não em produção, onde variáveis já devem estar definidas no ambiente do servidor/container.
- /core: contem as principais operações do dominio, com poucas influencia do nestjs
- class-transformer
  - usado na serialização
- class-validator
  - usado no core e no controller para validar entradas

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
  - orm: sequelize
    - mysql, sqlite
    - design pattern - active record
  - mapper
  - migration
    - umzug
      - src/core/shared/infra/db/sequelize/migrator.ts
---

### api rest
- recursos
  - categories
  - genres
  - cast members
  - videos
---
### hexagonal - ports and adapters
- gateway no usecase
  - port: ICategoryRepository
  - adapter: CategorySequelizeRepository, CategoryInMemoryRepository
- controller
  - api rest
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

### validações, lançamento de exceções
  - separação das validações de dominio(regras de dominio) vs validações de sintaxe
  - class-validator
    - categoryRules
  - mudando de lançar exceções de cada erro para notification pattern(acumular erros e no final fazer algo no usecase), isso depende do caso
  - joy validator
    - configModule - variaveis de ambiente
  - nest - pipe
---

### configurações de qualidade
- Configuração de Qualidade (QA)
  - ferramentas de qualidade para garantir a integridade do código, assegurando cobertura de testes e tipagem correta.
- typescript (tipagem)
  - Criado um script NPM chamado tsc:check que execute o compilador do TypeScript apenas para verificação (sem gerar build), garantindo que não existam erros de tipagem no projeto.
- jest (teste)
  - cobertura de testes
    - Configurado o Jest para que a execução falhe caso a cobertura de código (code coverage) seja inferior a 80%.
    - foi usado apenas para o teste de integração e unidade
    - npm run test:cov
- eslint (regras de código)
- prettier (formatação automatica baseada nas regras)

---
### testes
- tdd(test driven development), triple aaa(arrange, act, assert), piramidade de testes
- Test Data Builder(Gof - criacional)
  - CategoryFakeBuilder
- fluent pattern
  - ValidatorRules
- helpers/setup test sequelize
- fixtures (configuração para teste, arranges)
  - teste de integração, e2e
- quantidade de testes:
  - unidade: 76
  - integração: 1
----

### nestjs

- versão da cli: @nestjs/cli@10.1.17

- inicializa um novo projeto
  - nest new nest
    - select: npm
- novo modulo
  - npx nest g module shared
- pipe
  - validação com class-validator
- interceptor
  - class-transform para transformar a data para toIsoString
  - envolver saida do category get com a propriedade data
- filter
  - tratar execeções do dominio
    - o campo name não pode ter mais de 255 caracters, criar entidade e notification
    - not found id no usecase, repository update

----
### docker
- como está organizado a config do docker?
- docker-compose.yml
  - usa tmpfs
  - tmpfs
    - util para teste
    - carrega pasta do mysql na memoria ram
- docker-compose.dev.yml
  - util para desenvolvimento
  - usa volumes inves de tmpfs, quando reiniciar o container não perde a pasta
  - foi usado pq devcontainer não esta reconhecendo !reset do tmpfs do docker-compose.override.yaml, se reconhece-se era só descomentar .example do override para poder mudar de ambiente.
- docker-compose.overvire.yaml
  - usaria isso com docker-compose.yml se o devcontainer reconhece-se !reset
- devcontainer.json.example
  - por padrão está configurando para usar docker-compose.yml
----
### como rodar o projeto

- instalar o docker
- escolhendo entre modo test ou desenvolvimento
  - executar em modo test
    - teste de unidade, integração
      - criar /envs/.env.test com base no .env.test.example
        - sqlite inmemory
      - usar docker-compose.yaml
        - mysql em memoria
    - teste end-to-end(e2e)
      - criar /envs/.env.e2e com base no .env.e2e.example
  - executar em modo dev
    - criar /envs/.env com base no .env.example
      - sqlite inmemory
    - usar docker-compose.dev.yaml
      - mysql com volume mapeado
  - eu posso mudar o banco via .env* ou nos tests via config-module
- como executar como dev container?
  - criar devcontainer.json baseado no ./devcontainer/devcontainer.json.example
    - mudar a opção dockercomposefile dentro do arquivo devcontainer.json para apontar para o modo test ou modo dev
      - por padrão está em modo test
  - instalar extensão dev container
    - abrir command pallete: ctrl + shift + p 
    - digitar > dev container
    - escolher: reopen in container
- como executar o projeto sem dev container?
  - instalar extensoes vscode
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
    - rest client
      - testar api com o arquivo api.http e com npm run start:dev
  - comandos
    - iniciar ambiente
      - docker compose -f docker/docker-compose.yml up
    - acessar container
      - docker exec -it fc3-codeflix-backend-admin-catalogo bash
- executando nest
  - executar em modo test
    - teste de unidade, integração
      - npm run test
    - teste end-to-end(e2e)
      - npm run test:e2e:runInBand
        - os testes foram projetos para funcionar só de forma sequencial para não dar conflito ao mudar o mesmo schema
  - executar em modo dev
    - npm run start:dev
- testando a api com rest client extension + /api.http
  - npm run start:dev
  - executar chamadas do /api.http

### comandos
```bash
# tests
npm run test
npm run test — — watch

# rebuild se alterar manifesto
docker compose -f docker/docker-compose.yml up --build

# analise estatica do typescript sem gerar build
 npm run tsc:check

```

---
projeto pai:
[Link para o projeto pai](https://github.com/iamfelipy/fc3-codeflix-netflix)