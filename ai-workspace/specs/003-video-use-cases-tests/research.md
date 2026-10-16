# Pesquisa: Testes dos Casos de Uso de Vídeo

## Análise de Arquitetura e Padrões

Os módulos de referência (`cast-member`, `category`, `genre`) estruturam suas suítes de testes em:
1. **Testes Unitários (`__tests__/x.use-case.spec.ts`)**:
   - Testam a lógica de negócios utilizando repositórios em memória.
   - Verificam erros de validação, `NotFoundError` e fluxos de execução de sucesso.
2. **Testes de Integração (`__tests__/x.use-case.int-spec.ts`)**:
   - Testam a interação com repositórios Sequelize usando um banco SQLite em memória (`setupSequelize`).

## Decisões

- **Decisão**: Implementar arquivos de testes unitários (`.spec.ts`) e de integração (`.int-spec.ts`) para cada caso de uso de vídeo que não possua cobertura completa (`create-video`, `update-video`, `get-video`, `process-audio-video-medias`, `upload-image-medias`, `upload-audio-video-medias`), seguindo o modelo de `list-videos` e dos módulos de referência.
- **Justificativa**: Garante a cobertura completa dos testes da camada de aplicação de vídeos, mantendo a consistência arquitetural.
