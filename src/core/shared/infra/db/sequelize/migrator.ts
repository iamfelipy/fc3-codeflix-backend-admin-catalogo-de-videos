import { join } from 'path';
import { Sequelize } from 'sequelize';
import { SequelizeStorage, Umzug, UmzugOptions } from 'umzug';

export function migrator(
  sequelize: Sequelize,
  options?: Partial<UmzugOptions>,
) {
  return new Umzug({
    migrations: {
      glob: [
        // é js pq tambem vai ser executado em produção
        '*/infra/db/sequelize/migrations/*.{js,ts}',
        {
          // local onde vai buscar
          cwd: join(__dirname, '..', '..', '..', '..'),
          // ignorar pra nao dar problema
          ignore: ['**/*.d.ts', '**/index.ts', '**/index.js'],
        },
      ],
    },
    // instancia passada para as migrações, para criar tabelas e tudo mais
    context: sequelize,
    // Esse storage define onde o Umzug vai salvar o histórico das migrações já aplicadas. SequelizeStorage faz com que Umzug registre as migrações numa tabela do banco gerenciado pelo Sequelize, garantindo que saiba quais migrações já rodaram.
    storage: new SequelizeStorage({ sequelize }),
    logger: console,
    ...(options || {}),
  });
}