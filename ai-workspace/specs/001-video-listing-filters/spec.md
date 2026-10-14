# Especificação da funcionalidade: filtros da listagem de vídeos

**Feature Branch**: `001-video-listing-filters`

**Criado em**: 2026-10-12

**Status**: Rascunho

// ---
// Termos-chave da especificação:
//
// - "História do usuário": objetivo final do usuário ao usar o sistema.
// - "Cenário": situação concreta que demonstra o funcionamento esperado da funcionalidade.
// - "Uso": exemplo prático mostrando como o sistema é usado na prática.
// - "Aceitação": critério ou teste claro para saber se a funcionalidade atende ao esperado.


**Entrada**: Descrição do usuário: "Implementar a listagem de vídeos com filtros simultâneos por categoria, gênero e membros do elenco em src/core/video."

## Cenários de uso e testes

### História de usuário 1 - Encontrar vídeos usando filtros combinados (Prioridade: P1)

Um administrador lista vídeos e restringe os resultados por uma ou mais categorias, gêneros e membros do elenco ao mesmo tempo, mantendo a busca existente por título e o comportamento da paginação.

**Motivo desta prioridade**: A filtragem combinada é a funcionalidade solicitada e torna a busca no catálogo de vídeos útil para encontrar conteúdo específico.

**Teste independente**: Pesquisar um conjunto conhecido de vídeos com cada filtro individualmente e em combinação; depois, verificar os itens retornados e os totais da paginação.

**Cenários de aceitação**:

1. **Dado** um conjunto de vídeos associados a diferentes categorias, gêneros e membros do elenco, **quando** uma solicitação de listagem informar um ou mais IDs de vários tipos de filtro, **então** cada vídeo retornado corresponderá a pelo menos um dos IDs informados em cada tipo de filtro ativo.
2. **Dado** que há vários IDs em um único tipo de filtro, **quando** a solicitação de listagem informar esses IDs, **então** poderá ser retornado um vídeo que corresponda a qualquer um dos IDs desse tipo de filtro.
3. **Dado** que um tipo de filtro foi omitido ou tem uma lista de IDs vazia, **quando** a listagem for realizada, **então** esse tipo de filtro não restringirá os resultados.
4. **Dadas** combinações de filtros e paginação, **quando** a listagem for realizada, **então** os itens da página e a contagem total refletirão os mesmos critérios combinados e preservarão as convenções existentes de paginação e ordenação.
5. **Dado** o comportamento da listagem coberto por testes unitários, **quando** os cenários forem executados com repositórios em memória, **então** os testes verificarão os filtros individuais e combinados, a semântica OR dentro de cada lista e AND entre tipos ativos, filtros omitidos ou vazios, busca sem resultados e a consistência dos itens e metadados de paginação.
6. **Dado** o fluxo de listagem coberto por testes de integração, **quando** os cenários forem executados com dados persistidos e repositórios SQL, **então** os testes verificarão os filtros individuais e combinados, a semântica OR/AND, a ausência de vídeos duplicados e a consistência entre os itens retornados e a contagem total paginada.

### Casos extremos

- Um ID de filtro válido sem vídeos correspondentes retorna uma página vazia e total igual a zero.
- Um objeto de filtros vazio equivale a não usar filtros; listas de IDs vazias não excluem todos os vídeos.
- A combinação de dois ou três tipos de filtro exige correspondência em cada tipo ativo; vários IDs de um mesmo tipo seguem a semântica de correspondência com qualquer um deles.

## Requisitos

### Requisitos funcionais

- **FR-001**: A listagem de vídeos DEVE estar disponível como um caso de uso do core e aceitar os parâmetros existentes de paginação da busca, ordenação, título e filtros.
- **FR-002**: A listagem DEVE permitir filtros simultâneos por IDs de categorias, gêneros e membros do elenco.
- **FR-003**: Um vídeo DEVE corresponder a pelo menos um ID informado em cada tipo de filtro ativo; os tipos de filtro ativos DEVEM ser combinados com semântica AND.
- **FR-004**: Filtros omitidos e listas de IDs vazias NÃO DEVEM restringir o conjunto de resultados.
- **FR-005**: Os itens retornados, a contagem total, a ordenação e a paginação DEVEM ser consistentes com os critérios aplicados.
- **FR-006**: A funcionalidade DEVE permanecer em `src/core/video` e NÃO DEVE exigir alterações em `src/nest-modules`.

### Requisitos de testes

- **TR-001**: A listagem DEVE ter testes unitários do caso de uso usando repositórios em memória, seguindo os padrões de teste da camada core.
- **TR-002**: Os testes unitários DEVEM cobrir a saída e os metadados de paginação, cada filtro de associação isoladamente, combinações de dois e três tipos de filtro, correspondência com qualquer ID de uma lista, critérios AND entre tipos ativos, título junto aos filtros, filtros omitidos ou vazios e resultados sem correspondência.
- **TR-003**: Os testes unitários do repositório em memória DEVEM verificar a aplicação simultânea dos filtros de associação e o tratamento de listas vazias, preservando as convenções de busca existentes.
- **TR-004**: A listagem DEVE ter testes de integração do caso de uso com repositórios respaldados por SQL e dados persistidos, seguindo os helpers e padrões de integração existentes na camada core.
- **TR-005**: Os testes de integração DEVEM verificar filtros individuais e combinados, correspondência OR dentro das listas e AND entre tipos ativos, listas vazias ou omitidas, ausência de duplicatas e consistência dos itens, ordenação, paginação e contagem total sob os mesmos critérios.
- **TR-006**: Os testes DEVEM permanecer em `src/core/video`, respeitar a separação entre testes unitários e de integração adotada pelos contextos de categoria, gênero e membros do elenco, e NÃO DEVEM exigir alterações em `src/nest-modules`.

### Entidades principais

- **Vídeo**: Item do catálogo com título e associações a categorias, gêneros e membros do elenco; os resultados da listagem incluem os metadados de paginação existentes.
- **Categoria, gênero e membro do elenco**: Entidades relacionadas do catálogo cujos IDs restringem os resultados da busca de vídeos.

## Critérios de sucesso

### Resultados mensuráveis

- **SC-001**: Uma listagem pode aplicar os três filtros de associação em uma solicitação e retorna somente vídeos que correspondam a todos os tipos de filtro ativos.
- **SC-002**: Em cada tipo de filtro, basta corresponder a qualquer um dos vários IDs informados; a combinação dos tipos ativos restringe o resultado por todos eles.
- **SC-003**: A contagem total e cada página contêm somente vídeos que correspondam aos mesmos critérios de filtro.
- **SC-004**: Os cenários unitários e de integração definidos nos requisitos de testes podem ser executados separadamente e verificam a mesma semântica de filtros e paginação nas implementações em memória e SQL.

## Premissas

- As convenções existentes de busca definem OR/correspondência com qualquer ID dentro de uma lista e AND entre tipos de filtro distintos; isso é confirmado pelo repositório em memória e pelas condições de busca SQL.
- A paginação existente, a correspondência de título, a ordenação padrão e o formato dos resultados permanecem como comportamento da listagem de vídeos.
- Esta tarefa implementa o fluxo de listagem no core e não adiciona nem altera controllers ou DTOs do Nest.
- Os testes seguem as convenções existentes: testes unitários isolam o fluxo com repositórios em memória e testes de integração exercitam o caso de uso com os repositórios persistentes e os helpers de banco usados pelo projeto.
- O escopo de testes desta especificação cobre as camadas core e de repositório; testes de controller, DTO ou end-to-end não fazem parte desta complementação.
