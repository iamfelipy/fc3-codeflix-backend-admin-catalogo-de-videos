# microserviço, backend: Admin catalogo de vídeo - Codeflix 

### c4 model
![Imagem 2](docs/c4-model-baixa-amplitude.png)
![Imagem 1](docs/c4-model-ampla.png)

---

### caracteristica do projeto
- microserviço da parte administrativa do catalogo de video
- typescript, javascript
- clean architecture, domain driven design, solid, conceitos da arquitetura de microserviços, piramide de testes, tdd
- nestjs
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
### solid
- srp
  - usecases
- open extension / close change
  - category entity
    - class-validator: validação da entidade
- l
- interface segregation
  - repository inmemory 
    - crud comum e search separados
- d: dependecy inversion
  - inmemory repository
---
### DDD
  - category

---
### testes
- tdd(test driven development), triple aaa(arrange, act, assert)
- fluent pattern, Test Data Builder(Gof - criacional)
  - CategoryFakeBuilder
  - ValidatorRules
- helpers/setup test sequelize
- quantidade de testes:
  - unidade: 76
  - integração: 1
---

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
# recomendação
executar o projeto com devcontainer
instalar extensão dev container
ctrl + shift + p 
> dev container: reopen in container

---
tests
npm run test
npm run test — — watch

---
# Executar docker compose na raiz do projeto, para os caminhos funcionarem
docker compose -f docker/docker-compose.yml up
docker compose -f docker/docker-compose.yml up --build

# acessar container
docker exec -it fc3-codeflix-backend-admin-catalogo bash
```

---
projeto pai:
[Link para o projeto pai](https://github.com/iamfelipy/fc3-codeflix-netflix)