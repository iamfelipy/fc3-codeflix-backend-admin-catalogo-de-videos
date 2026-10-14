# Modelo de dados: filtros da listagem de vídeos

## Vídeo

- **Identidade**: `VideoId`.
- **Campos da listagem**: título, data de criação, IDs de categorias, IDs de gêneros e IDs de membros do elenco.
- **Relacionamentos**: associações muitos-para-muitos com Categoria, Gênero e Membro do elenco.
- **Comportamento da busca**: uma lista de IDs ativa corresponde quando um vídeo tem pelo menos um ID dessa lista; todas as dimensões de relacionamento ativas são obrigatórias.
- **Validação**: `VideoSearchParams.create` converte IDs em string nos objetos de valor de ID correspondentes do domínio.

## Resultado da busca

- **Itens**: vídeos que atendem a todos os critérios de busca ativos.
- **Metadados de paginação**: página atual, tamanho da página e total de vídeos distintos correspondentes, todos calculados com os mesmos critérios.
