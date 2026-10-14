# Pesquisa: filtros da listagem de vídeos

## Decisão: reutilizar o contrato existente do repositório pesquisável

**Justificativa**: `VideoSearchParams`, `VideoSearchResult` e `IVideoRepository` já modelam a busca por título, a paginação, a ordenação e três listas de IDs de associação. Os casos de uso de listagem de categorias e membros do elenco criam parâmetros de busca, chamam `search`, mapeiam a saída e retornam metadados de paginação.

**Alternativas consideradas**: Adicionar uma nova abstração de consulta/repositório para listagem; rejeitada por duplicar o contrato de busca estabelecido.

## Decisão: manter OR dentro de uma lista de filtros e AND entre tipos de filtro

**Justificativa**: `VideoInMemoryRepository.applyFilter` usa `.some()` para cada lista de associações e, em seguida, exige todos os critérios ativos. A consulta de contagem do Sequelize também combina cada condição de associação com `Op.and` e verifica IDs usando `Op.in`.

**Alternativas consideradas**: Exigir todos os IDs de uma lista; rejeitada porque o código existente usa explicitamente a semântica de correspondência com qualquer ID.

## Decisão: corrigir os joins SQL e manter o caso de uso de listagem no core

**Justificativa**: O fluxo de busca SQL bruto atualmente faz joins com tabelas de associação usando referências incompatíveis de tabela/coluna, incluindo a tabela de gêneros para membros do elenco. Os joins corretos devem conectar `video_id` de cada tabela de junção à chave primária do vídeo e manter a condição do ID da associação na cláusula WHERE. A solicitação da funcionalidade atribui explicitamente a implementação a `src/core/video`.

**Alternativas consideradas**: Implementar ou ajustar controller/DTO do Nest; rejeitada por violar o limite de camada solicitado, já que a interface de busca do core já oferece suporte a filtros.

## Decisão: separar testes unitários em memória dos testes de integração SQL

**Justificativa**: Os casos de uso de listagem de Categoria, Gênero e Membros do elenco usam repositórios em memória nos testes unitários e repositórios Sequelize com helpers de banco nos testes de integração. Os testes atuais do repositório de vídeo também mantêm testes unitários do repositório em memória e testes de integração SQL. Reutilizar essa separação valida o comportamento do core sem banco e a composição persistente sem envolver controllers do Nest.

**Alternativas consideradas**: Testar apenas o repositório ou apenas o caso de uso; rejeitada porque deixaria sem cobertura uma das fronteiras usadas pela listagem. Adicionar testes de controller/end-to-end; rejeitada por estar fora da camada e do escopo desta funcionalidade.

## Decisão: cobrir a busca combinada e metadados em ambos os caminhos

**Justificativa**: A busca precisa preservar OR dentro de cada lista de IDs e AND entre dimensões de filtro, além de aplicar os mesmos critérios aos itens paginados e ao total. Os testes de integração devem usar associações sobrepostas para verificar também que joins não duplicam vídeos.

**Alternativas consideradas**: Verificar somente filtros isolados; rejeitada porque não detecta regressões na combinação simultânea solicitada.
