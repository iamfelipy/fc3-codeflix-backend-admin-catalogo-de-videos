const crypto = require('crypto');

const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 2048,
  // formato de serialização (estrutura/padrão) usado ao exportar a chave
  publicKeyEncoding: {
    type: 'spki',
    format: 'pem',
  },
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'pem',
  },
});

// Ele troca quebras de linha (\n) por \\n para deixar a chave num formato de string única (inline), facilitando salvar em arquivos .env ou variáveis de ambiente, já que essas não suportam múltiplas linhas.
// no env
// A chave precisa das quebras de linha (\n) em formato string para ser lida corretamente pelo JWT/funções criptográficas. Sem elas, a chave ficará toda em uma linha e dará erro ao importar/parsing.
const privateKeyInline = privateKey.replace(/\n/g, '\\n');
console.log(privateKeyInline);

const publicKeyInline = publicKey.replace(/\n/g, '\\n');
console.log(publicKeyInline);