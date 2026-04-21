# microserviço, backend: Admin catalogo de vídeo - Codeflix 

### c4 model
![Imagem 2](docs/c4-model-baixa-amplitude.png)
![Imagem 1](docs/c4-model-ampla.png)

---

### caracteristica do projeto
- microserviço da parte administrativa do catalogo de video
- typescript, javascript
- clean architecture, domain driven design, solid, conceitos da arquitetura de microserviços
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

---

### api rest
- recursos
  - categories
  - genres
  - cast members
  - videos

---

### etapas de construção da aplicação backend
- Montagem do ambiente de desenvolvimento (Docker e IDE)
- modelar o core antes de ir para o framework nestjs, usando ddd e clean archtecture
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