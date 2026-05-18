FROM node:20.5.1-slim

RUN npm install -g @nestjs/cli@10.1.17

# mais seguro e evita problema de permissão com arquivos, do que usar o usuario root
USER node
WORKDIR /home/node/app
CMD ["tail", "-f", "/dev/null"]