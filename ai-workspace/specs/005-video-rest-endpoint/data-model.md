# Modelo de dados: Endpoint REST de listagem e busca de vídeos

**Branch**: `005-video-rest-endpoint`

## Entidades e DTOs
- `SearchVideosDto`: DTO de entrada para listagem e busca de vídeos na API.
- `VideoPresenter`, `VideoCollectionPresenter`: Apresentadores para serialização da resposta HTTP.
- `ListVideosUseCase`: Caso de uso existente no core que processa os parâmetros de busca e retorna `ListVideosOutput`.
