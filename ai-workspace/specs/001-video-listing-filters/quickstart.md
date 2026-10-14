# Guia de início rápido: filtros da listagem de vídeos

## Cenários de validação

1. Preparar vídeos de teste com associações sobrepostas e distintas de categorias, gêneros e membros do elenco.
2. Chamar o caso de uso de listagem de vídeos do core sem filtros e confirmar a saída padrão da paginação.
3. Chamá-lo separadamente com cada filtro de associação e verificar os IDs correspondentes.
4. Chamá-lo com dois e, em seguida, com os três filtros de associação; confirmar que basta corresponder a qualquer ID informado em cada lista e que todas as dimensões de filtro ativas entre as listas são respeitadas.
5. Informar uma lista vazia e confirmar que ela não restringe os resultados.
6. Solicitar várias páginas e verificar se os itens retornados, a ordem de classificação e a contagem total permanecem consistentes com os filtros.
7. Executar os testes unitários da listagem e do repositório em memória para validar o comportamento do core sem banco de dados.
8. Executar os testes de integração da listagem com os repositórios SQL para validar os joins, a ausência de duplicatas e a consistência de itens e contagem.

## Comandos do projeto

Na raiz do repositório da aplicação, o projeto documenta `npm run tsc:check` para verificação do TypeScript e `npm test -- --runInBand` para o Jest. Execute os testes direcionados com:

```sh
npm test -- --runInBand --runTestsByPath \
  src/core/video/application/use-cases/list-videos/__tests__/list-videos.use-case.spec.ts \
  src/core/video/application/use-cases/list-videos/__tests__/list-videos.use-case.int-spec.ts \
  src/core/video/infra/db/in-memory/video-in-memory.repository.spec.ts \
  src/core/video/infra/db/sequelize/__tests__/video-sequelize.repository.int-spec.ts
```

Depois, execute `npm run tsc:check` para verificar os tipos.

Consulte [spec.md](spec.md) para o comportamento de aceitação e [data-model.md](data-model.md) para a semântica de busca.
