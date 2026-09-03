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
- backend para a gestão de conteúdos para a CodeFlix,

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
### DDD
  - entities, aggregates
    - category
      - Categoria: um conjunto de coisas agrupadas porque compartilham uma característica geral em comum.
      - Categoria = onde algo se encaixa pelo tipo geral.
      - Categoria olha para a classe/espécie da coisa.
      - Categoria agrupa pela natureza/tipo.
      - filme, documentário, infantil
    - cast-members
      - "membro do elenco", uma pessoa (ator, atriz, diretor, etc.) que faz parte da produção de um filme, série ou peça.
    - genre
      - Gênero: uma categoria mais específica usada para agrupar coisas que compartilham características de estilo, estrutura ou padrão.
      - Gênero = o estilo/padrão que algo segue dentro de uma categoria.
      - Gênero agrupa pela forma/estilo/padrão.
      - Filme → gênero: terror, comédia, ação, drama
      - Estilo é o modo particular de fazer, expressar ou apresentar algo, caracterizado por traços distintivos que diferenciam um autor, obra, período ou grupo.
    - video
      - video: significa registro ou exibição de imagens em movimento, geralmente acompanhado de som.
  - object value
    - uuid, search-params, search-result, cast-member-type, 
    - rating
        - classificação" é a categoria atribuída ao conteúdo, enquanto "faixa etária" é o intervalo ou limite de idades ao qual essa categoria se aplica.
    - imageMedia
      - banner, thumbnail-half, thumbnail
    - audiovideomedia
      - video principal, trailer
  - repository
    - category
    - cast-member
  - shared kernel
    - src/core/shared
---
### generico
- config, variaveis de ambiente
  - local
    - usado pelos testes
    - src/core/shared/infra/config.ts
    - dotenv
      - carregar variveis de ambiente
      - normalmente o dotenv é usado apenas em desenvolvimento para carregar variáveis de ambiente locais, não em produção, onde variáveis já devem estar definidas no ambiente do servidor/container.
  - nest, framework, infraestrutura
    - usado pelas serviços do container de injeção de dependencia e tambem pelos testes e2e
    - src/nest-modules/config-module/config.module.ts
    - criei suportando configurações alem do .env, assim respeitando twelve-factory - chapter 3
    - validação
      - lib typescript joi
- /core: contem as principais operações do dominio, com poucas influencia do nestjs

---
### principios de design de software
- cqs: Command Query Separation
  - um método deve ou alterar o estado (Command) ou retornar uma informação (Query), mas não fazer os dois ao mesmo tempo.
  - levar em conta consequencias que podem acontecer dado a complexidade do que estou construindo
  - src/core/video/infra/db/sequelize/video-sequelize.repository.ts (.insert)
  - cqrs
    -  leva essa separação para uma arquitetura, podendo ter modelos, handlers/use cases, bancos ou fluxos separados.
    - src/core/video/application/create-video/create-video.use-case.ts
    - src/core/video/application/get-video/get-video.use-case.ts
    - src/nest-modules/videos-module/videos.controller.ts
- ocp: Open Closed Principle (Princípio Aberto-Fechado)
  - aberto para extensão, mas fechado para modificação.
  - src/core/shared/domain/validators/validation.error.ts
    - herança
    - permite criar novos tipos de erros estendendo a base, sem modificar a classe base.
  - src/core/video/domain/banner.vo.ts
  - src/core/shared/domain/validators/validation.error.ts
- solid, poo
  - srp
    - usecase: execute, validação input
    - repository: mapper, helper
    - .validate dominio
  - open/closed principle (OCP):
    - class-validator: validação da entidade
    - IRepository, ISearchableRepository
      - filter
    - SearchParams
    - objeto de valor imageMedia abstract
      - banner, thumbnail
  - liskov substitution principle (LSP):
    - garantir que subclasses possam substituir as superclasses sem alterar a corretude do comportamento do sistema
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
### design patterns
- unit of work (design pattern)
  - Unit of Work coordena tudo que precisa acontecer junto para uma operação de domínio ser concluída de forma consistente. 
  - video aggregate
  - trasanction sequelize
  - events 
  - src/core/shared/infra/db/sequelize/unit-of-work-sequelize.ts
- mediator
  - src/core/shared/domain/events/domain-event-mediator.ts
- adapter
  - Ele serve para integrar interfaces incompatíveis, permitindo que classes com APIs diferentes trabalhem juntas.
  - storage
    - src/core/shared/infra/storage/google-cloud.storage.ts
       - Ele implementa a interface IStorage e adapta o SDK do Google Cloud Storage para o formato esperado pela aplicação.
- observable
  - permite que um objeto observe um fluxo de valores ao longo do tempo e reaja quando novos valores acontecem.
  - src/nest-modules/event-module/event.module.ts

--- 
### upload, storage, gcp
- o caso de uso de video cria sem upload
- src/core/video/application/upload-audio-video-medias
- src/core/video/application/upload-image-medias
- src/core/video/application/process-audio-video-medias/process-audio-video-medias.use-case.ts
  - caso de uso usado pelo microserviço de encoded, ele usa para informar o resultado do encoded
  - Processo de Upload e Publicação de Vídeos
    1. Um funcionário ou administrador faz o upload do arquivo de áudio ou vídeo no microserviço de gestão de conteúdo.
    2. O arquivo é armazenado em um bucket (armazenamento na nuvem).
    3. O sistema dispara um evento indicando que o arquivo de áudio/vídeo foi modificado e publica esse evento no RabbitMQ.
    4. O microserviço em Go responsável pelo encoding consome esse evento, faz o download do arquivo no GCP, realiza o processo de encoding e, ao finalizar, publica um novo evento no RabbitMQ.
    5. O microserviço administrativo possui um consumidor do RabbitMQ que lê esse evento, e então atualiza o vídeo correspondente:
        - Atualiza o status e o caminho do arquivo já encodado no value-object: vídeo ou trailer no agregado vídeo.
    6. Se o vídeo atender a todos os critérios necessários (ex: ter os arquivos de vídeo/trailer processados), ele é atualizado para o status de "published" (publicado).

---
### eventos
- lidando com eventos de dominio de forma local, propagando dentro do agregado
  1. para tornar o video visivel no catalogo(frontend), trailer e video precisam ter o status completed
  2. os handlers locais são registrados ao instanciar o agregado video
  3. criar o video ou mudar o anexo(video, trailer) dispacha eventos locais ouvidos apenas dentro do agregado pelos handlers locais
    - handlers locais do agregado
      - onVideoCreated
      - onAudioVideoMediaReplaced
    - eventos
      - VideoCreatedEvent
      - VideoAudioMediaReplaced
      - ps: esses eventos são ouvidos tambem camada de aplicação
  4. quando os eventos são disparados os handlers tentam executar .tryPublished()
  - src/core/video/domain/video.aggregate.ts
  - src/core/shared/domain/events/domain-event.interface.ts
  - src/core/shared/domain/aggregate-root.ts
    - mediator local
      - eventEmitter2
    - events
    - applyEvents()
- lidando com eventos de dominio na camada de aplicação, propagando para outras partes ou outras aplicações
  - src/core/video/application/upload-audio-video-medias/upload-audio-video-medias.use-case.ts
  1. o usecase manipula o agregado, o agregado gera eventos
  2. o repository é executado como closure dentro do appService, que está dentro do usecase
    - um insert do repository adiciona o agregado ao unit of work
      - src/core/video/infra/db/sequelize/video-sequelize.repository.ts
  3. o usecase recebe o appService e o appService recebe o unit of work e o domain-eventmediator
  4. o appService abre a transação, executa a closure com repository, dispara os eventos dos agregados e faz o commit 
    - mediator
      - serviço de orquestração de eventos
      - registra handler para um evento
      - publica os eventos do agregado 
      - src/core/shared/domain/events/domain-event-mediator.ts
    - appService
      - é um auxiliar para consolidação das regras de negocio na camada de aplicação
      - start, run, finish, fail
      - src/core/shared/application/application.service.ts
- framework, nest, observable, eventEmitter2
  - gerencia os eventos, listeners, eventEmitter2
  - src/nest-modules/event-module/event.module.ts
  - src/nest-modules/use-case-module/use-case.module.ts

----
### persistence layer
- camada de infraestrutura de persistência.
  - É responsável por armazenar, recuperar e gerenciar dados persistentes da aplicação, independentemente do tipo de tecnologia utilizada (bancos, arquivos, filas, caches, buscadores).
  - Database: Armazena dados estruturados ou semi-estruturados para consulta e manipulação (ex: MySQL, PostgreSQL, MongoDB).
  - Storage: Guarda arquivos binários como imagens, vídeos e documentos (ex: Amazon S3, Google Cloud Storage).
  - Cache: Memória temporária para acelerar leituras rápidas (ex: Redis, Memcached).
  - Fila/Mensageria: Gerencia comunicação assíncrona entre sistemas (ex: RabbitMQ, Kafka).
  - Buscador (Search Engine): Permite busca e indexação eficiente de grandes volumes de texto (ex: Elasticsearch).
- repository 
  - search(filter, sort, paginate), crud
  - testes
  - inmemoryRepository
- cardinalidade
  - oneToMany
    - video 
      - video, trailer
      - banner
  - manyToMany
    - genres with categories
    - video
      - castmember
      - genres
      - categories
- orm
  - sequelize: design pattern - active record
    - mysql, sqlite
- mapper
  - toDomain
  - toModel
- unit of work
  - start, rollback, commit
- transaction
  - acid
  - src/nest-modules/videos-module/videos.providers.ts
  - src/nest-modules/genres-module/genres.providers.ts
- migration
  - umzug
    - configuração
      - src/core/shared/infra/db/sequelize/migrator.ts
        - cli no core
      - src/migrate.ts
        - no nestjs usando a cli
    - migrations
      - src/core/*/infra/db/sequelize/migrations
    - model vs migration
      - model:  o ORM cria/altera o banco com base nos Models.
        - usado pelos testes
      - migration: você cria arquivos que descrevem cada alteração no 
      banco.
        - usadas em produção e desenvolvimento
    - comando
      - mostra as funcionalidades disponiveis do umzug
        - dev
          - npm run migrate:ts:with-paths
        - produção
          - npm run migrate:js
      - comandos de exemplo na seção mais abaixo

----
### clean architecture
  - interface adapters
    - presenters
      - categoryOuput, collection, pagination, data, metadata
      - class-transform
    - controllers
      - category, cast-member
      - class-validator dto
    - gateways
      - repository
      - storage gcp
  - application business rules
    - usecases
      - category
        - Create: Criação de uma nova categoria.
        - Update: Atualização de uma categoria existente.
        - Delete: Remoção de uma categoria.
        - Get: Recuperação de uma categoria específica.
        - Search/List: Listagem e busca de categorias.
      - castmembers
  - enterprise business rules
    - category, castmembers
  - dependencias apontam para o centro
    - camada interna não conhece a camada mais externa
    - a camada interage com a camada diretamente ao lado
  - tipos de duplicação
    - essencial, acidental
    - src/core/video/application/upload-audio-video-medias/upload-audio-video-medias.use-case.ts

---
### hexagonal - ports and adapters
- repository
  - port: ICategoryRepository, repository-interface.ts
  - adapter: CategorySequelizeRepository, CategoryInMemoryRepository
  - usado no usecase
- controller
  - port/adapter: api rest, controller, nest
- validação
  - port: validator-fields-interface.ts
  - validate domain
- storage
  - port: src/core/shared/application/storage.interface.ts
  - adapter: src/core/shared/infra/storage/google-cloud.storage.ts

---

### validações, tratamento de erros
  - validações
    - separação das validações de dominio(regras de dominio) vs validações de sintaxe
    - class-validator
      - categoryRules
      - CastMemberRules
    - joy validator
      - configModule - variaveis de ambiente
    - nest - pipe
  - tratamento de erros, lançamento de exceções
    - either - tratar de forma explicita, alternativa ao throw
    - erros na entidade com notification pattern(acumular erros e no final fazer algo no usecase)
    - nest - filters
    - exceptions especificas inves de new Error generic
  
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
- helpers
  - src/core/shared/infra/testing/helpers.ts
    - teste de unidade e integração
  - src/nest-modules/shared-module/testing/helpers.ts
   - teste de integração e e2e
- fixtures (configuração para teste, arranges)
  - teste de integração, e2e
- inmemory
- tecnologia
  - jest
    - arquivo de configuracao diferente para unit, integration e e2e
- quantidade de testes:
  - unidade: 500
  - integração: 50
  - e2e: 97
----

### nestjs

- versão da cli: @nestjs/cli@10.1.17

- inicializa um novo projeto
  - nest new nest
    - select: npm
- novo modulo
  - npx nest g module shared
- controllers
  - api rest
    - recursos
      - categories
      - genres
      - cast members
      - videos
      - src/nest-modules
    - teste manual com client rest
      - api.http
  - class-transformer
    - usado na serialização do output do controller
  - class-validator
    - usado no core e no controller para validar entradas
- pipe
  - validação com class-validator
- interceptor
  - class-transform para transformar a data para toIsoString
  - envolver saida do category get com a propriedade data
- filter
  - tratar execeções do dominio
    - o campo name não pode ter mais de 255 caracters, criar entidade e notification
    - not found id no usecase, repository update
- helper
  - test
    - startApp - inicia modulo, banco para o teste e2e
- variaveis de ambiente
  - src/nest-modules/config-module/config.module.ts
- nest-modules/shared-module
  - agrupar logica e serviços reutilizaveis
  - global
  - serviços
    - storage
    - domainEventMediator
    - appService
  - presenter
    - paginacao
    - collection
  - filters, interceptors, testing
- injeção de dependencia
  - scope.request
    - appService
    - unit of work
    - src/nest-modules/shared-module/shared.module.ts
- upload de arquivos com multer, express, interceptor, multipart/data-form
  - src/nest-modules/videos-module/videos.controller.ts
- eventos
  - integrar os eventos do dominio com nest
  - nest tem decorator pra registrar evento e handler
  - nest implementa o pattern observer com eventEmitter2
  - ao carregar o eventEmitter2 do pacote nest, ele registra o servico de forma global no container de servicos

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
  - O padrão é usar o docker-compose.yml. O docker-compose.dev.yml só é usado se você especificar explicitamente com a flag -f ou configurar no devcontainer.json.
- docker-compose.overvire.yaml
  - usaria isso com docker-compose.yml se o devcontainer reconhece-se !reset
- devcontainer
  - devcontainer.json.example
    - por padrão está configurando para usar docker-compose.yml
----
### como rodar o projeto

- instalar o docker
- executando o projeto
  - como executar como dev container?
    - criar devcontainer.json baseado no ./devcontainer/devcontainer.json.example
      - posso escolher a opção dockercomposefile dentro do arquivo devcontainer.json para apontar para:
        - docker-compose.yaml: tmpfs mysql - modo test
          - por padrão está em modo test
        - docker-compose.dev.yaml: volume mysql -> modo dev
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
- escolhendo entre modo test ou desenvolvimento
  - executar em modo test
    - tecnologia: jest
    - teste de unidade, integração
      - jest, arquivo de configuracao
        - jest.config.ts
      - criar /envs/.env.test com base no .env.test.example
        - sqlite inmemory
      - npm run test
        - se NODE_ENV estiver undefined ou null, o Jest define como 'test'.
    - teste end-to-end(e2e)
      - jest, arquivo de configuracao
        - test/jest-e2e.config.ts
      - criar /envs/.env.e2e com base no .env.e2e.example
      - usar docker-compose.yaml
        - mysql em memoria
      - npm run test:e2e:runInBand
        - os testes foram projetos para funcionar só de forma sequencial para não dar conflito ao mudar o mesmo schema
        - Para npm run test:e2e:runInBand, o test/jest-setup.ts sobrescreve o valor de NODE_ENV para e2e
  - executar em modo dev
    - criar /envs/.env com base no .env.example
      - sqlite inmemory
    - usar docker-compose.dev.yaml
      - mysql com volume mapeado
    - executar em modo dev
      - npm run start:dev
    - banco de dados
      - migrations
        - executar as migrations 
          - migrate:ts:with-paths up
        - comandos de exemplo na seção mais abaixo
- extra
  - env
    - usou .env com mysql e DB_AUTO_LOAD_MODELS=false e sem sequelize.sync, evita conflito entre migrations e com o array de models carregados na inicialização nest
  - eu posso mudar o banco via .env* ou nos tests via config-module
    - alguns testes usam a configuração do banco direto, sem env
  - testando a api com rest client extension + ./api.http
    - npm run start:dev
    - executar chamadas do ./api.http
  - exemplo de credenciais estão no githubgist

### comandos
```bash
# tests
npm run test
npm run test — — watch

# coverage html - resultado do teste de unitade e integração
npm run test:cov

# rebuild se alterar manifesto/dockerfile/docker-compose
docker compose -f docker/docker-compose.yml up --build

# analise estatica do typescript sem gerar build
 npm run tsc:check

# migration umzug
- mostra as funcionalidades disponiveis do umzug
  - dev
    - npm run migrate:ts:with-paths
  - produção
    - npm run migrate:js
- ver funcionalidades disponiveis do create
  npm run migrate:ts:with-paths create -- --help

- cria migration
  - dar um nome sugestivo, do que está sendo feito
  - mover para a pasta do modulo correspondente
  npm run migrate:ts:with-paths create -- --name create-categories-table.ts --folder ./src

- mostra migrations pendentes
  - npm run migrate:ts:with-paths pending
- aplica migrations pendentes
  - npm run migrate:ts:with-paths up
- desfaz migrations
  - npm run migrate:ts:with-paths down               # desfaz apenas a última migration
  - npm run migrate:ts:with-paths down -- --step 2   # desfaz as 2 últimas migrations
  - npm run migrate:ts:with-paths down -- --to 0   # desfaz todas as migrations, volta ao estado inicial

# container mysql, comandos uteis
mysql -uroot -proot
show databases;
drop database micro_videos;
create database micro_videos;
use micro_videos;
show tables;
drop table categories;
describe categories;
select * from SequelizeMeta;

```

---
projeto pai:
[Link para o projeto pai](https://github.com/iamfelipy/fc3-codeflix-netflix)