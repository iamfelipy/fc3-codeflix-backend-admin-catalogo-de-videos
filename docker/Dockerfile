FROM node:20.5.1-slim

USER root

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
       ca-certificates \
       curl \
    && rm -rf /var/lib/apt/lists/*

RUN npm install -g @nestjs/cli@10.1.17

USER node
WORKDIR /home/node/app

# Adiciona o diretório de executáveis locais do usuário node ao PATH,
# permitindo executar ferramentas instaladas nesse diretório pelo nome.
ENV PATH="/home/node/.local/bin:${PATH}"

# Instala o Codex CLI sem usar npm global.
RUN curl -fsSL https://chatgpt.com/codex/install.sh | sh

# Instala o uv, o Python 3.11 e o Spec Kit.
RUN curl -LsSf https://astral.sh/uv/install.sh | sh \
    && uv python install 3.11 \
    && uv tool install specify-cli --python 3.11

# Valida as instalações durante a construção da imagem.
RUN codex --version \
    && specify version \
    && uv --version

CMD ["tail", "-f", "/dev/null"]