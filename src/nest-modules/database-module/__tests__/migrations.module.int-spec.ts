import { Test, TestingModule } from '@nestjs/testing';
import { MigrationsModule } from '../migrations.module';
import { getConnectionToken } from '@nestjs/sequelize';
import { migrator } from '../../../core/shared/infra/db/sequelize/migrator';
import { Sequelize } from 'sequelize-typescript';

// isso nao foi feito na aula, fiz por causa do desafio de teste de migrations
describe('Migration Integration Tests', () => {
  let moduleRef: TestingModule;
  let sequelize: Sequelize;
  
  const connOptions = {
    DB_VENDOR: 'mysql',
    DB_HOST: 'db-fc3-codeflix-backend-admin-catalogo-de-videos',
    DB_DATABASE: `micro_videos_test_${Math.random().toString(36).substring(2, 10)}`,
    DB_USERNAME: 'root',
    DB_PASSWORD: 'root',
    DB_PORT: 3306,
    DB_LOGGING: false,
    DB_AUTO_LOAD_MODELS: false,
  };
  
  beforeAll(async () => {
    
    // criar banco de dado para teste

    const adminConnection = new Sequelize({
      dialect: 'mysql',
      host: connOptions.DB_HOST,
      username: connOptions.DB_USERNAME,
      password: connOptions.DB_PASSWORD,
      port: connOptions.DB_PORT,
      logging: false,
    });

    await adminConnection.query(`
      DROP DATABASE IF EXISTS ${connOptions.DB_DATABASE}
    `);

    await adminConnection.query(`
      CREATE DATABASE ${connOptions.DB_DATABASE}
    `);

    await adminConnection.close();

    // pegar conexao sequelize para aplicar migrations
    
    const module = await Test.createTestingModule({
      imports: [
        MigrationsModule.forRoot({
          isGlobal: true,
          ignoreEnvFile: true,
          ignoreEnvVars: true,
          validationSchema: null,
          load: [() => connOptions],
        }),
      ],
    }).compile();

    moduleRef = module
    // O TestingModule herda de NestApplicationContext, então ele já possui:
    sequelize = module.get<Sequelize>(getConnectionToken());
  });

  afterAll(async () => {

    // if (sequelize) {
    //   await sequelize.close();
    // }
    if (moduleRef) {
      await moduleRef?.close();
    }
    
    const adminConnection = new Sequelize({
      dialect: 'mysql',
      host: connOptions.DB_HOST,
      username: connOptions.DB_USERNAME,
      password: connOptions.DB_PASSWORD,
      port: connOptions.DB_PORT,
      logging: false,
    });
    
    await adminConnection.query(`
      DROP DATABASE IF EXISTS ${connOptions.DB_DATABASE}
      `);
      
    await adminConnection.close();
    
  });

  it('should apply all pending migrations (up) and then revert them (down) successfully', async () => {
    try {
      const migratorInstance = migrator(sequelize);

      const upResult = await migratorInstance.up();
      expect(Array.isArray(upResult)).toBe(true);

      // Check SequelizeMeta table has migrations
      const [resultsUp] = await sequelize.query("SELECT name FROM SequelizeMeta");
      expect(Array.isArray(resultsUp)).toBe(true);
      expect(resultsUp.length).toBeGreaterThan(0);

      // Run migrations down (undo all)
      const downResult = await migratorInstance.down({step: upResult.length});
      expect(Array.isArray(downResult)).toBe(true);

      // Check SequelizeMeta table is empty
      const [resultsDown] = await sequelize.query("SELECT name FROM SequelizeMeta");
      expect(Array.isArray(resultsDown)).toBe(true);
      expect(resultsDown.length).toBe(0);
    } catch (e) {
      console.error(e);
      throw e;
    }
  });});