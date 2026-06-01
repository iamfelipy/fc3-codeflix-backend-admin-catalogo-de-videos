import { Config } from 'jest';

const config: Config = {
  
  // A opção clearMocks: true faz com que o Jest limpe automaticamente todas as simulações (mocks) entre cada teste. Isso garante que um teste não afete outro, evitando interferências e deixando os testes mais confiáveis e isolados.
  // É a cada it (cada teste individual), não por arquivo.
  clearMocks: true,

  //Define as extensões de arquivos que o Jest reconhece como módulos ao resolver imports nos testes.
  // Um módulo é um arquivo de código (como .js, .ts) que exporta funções, classes ou variáveis para serem usadas em outros arquivos via importação.
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testEnvironment: 'node',
  coverageProvider: 'v8',
  testRegex: '.e2e-spec.ts$',
  transform: {
    '^.+\\.(t|j)s$': '@swc/jest',
  },
  setupFilesAfterEnv: ['./jest-setup.ts'],
};

export default config;