import { Module } from '@nestjs/common';
import {
  ConfigModuleOptions,
  ConfigModule as NestConfigModule,
} from '@nestjs/config';
import Joi from 'joi';
import { join } from 'path';

type DB_SCHEMA_TYPE = {
  DB_VENDOR: 'mysql' | 'sqlite';
  DB_HOST: string;
  DB_PORT: number;
  DB_USERNAME: string;
  DB_PASSWORD: string;
  DB_DATABASE: string;
  DB_LOGGING: boolean;
  DB_AUTO_LOAD_MODELS: boolean;
};

export const CONFIG_DB_SCHEMA: Joi.StrictSchemaMap<DB_SCHEMA_TYPE> = {
  DB_VENDOR: Joi.string().required().valid('mysql', 'sqlite'),
  DB_HOST: Joi.string().required(),
  DB_DATABASE: Joi.string().when('DB_VENDOR', {
    is: 'mysql',
    then: Joi.required(),
  }),
  DB_USERNAME: Joi.string().when('DB_VENDOR', {
    is: 'mysql',
    then: Joi.required(),
  }),
  DB_PASSWORD: Joi.string().when('DB_VENDOR', {
    is: 'mysql',
    then: Joi.required(),
  }),
  DB_PORT: Joi.number().integer().when('DB_VENDOR', {
    is: 'mysql',
    then: Joi.required(),
  }),
  DB_LOGGING: Joi.boolean().required(),
  /*
    autoLoadModels: true faz o Sequelize usar automaticamente os Models que foram registrados em outros módulos da aplicação. Assim, você não precisa informar esses Models novamente na configuração principal do Sequelize.
  */
  DB_AUTO_LOAD_MODELS: Joi.boolean().required(),
};

// usado no configService<>.get
export type CONFIG_SCHEMA_TYPE = DB_SCHEMA_TYPE;

//@ts-expect-error - the type is correct
const joiJson = Joi.extend((joi) => {
  return {
    type: 'object',
    base: joi.object(),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    coerce(value, _schema) {
      // credentials do google são um object json
      /*
        value[0] !== '{': retorna se o primeiro caractere não é {.
        !/^\s*\{/.test(value): retorna se a string não começa (mesmo ignorando espaços à esquerda) com {.
        Ou seja, só continua se a string começa com {, seja diretamente ou após espaços; caso contrário, sai da função.
      */
      if (value[0] !== '{' && !/^\s*\{/.test(value)) {
        return;
      }

      try {
        return { value: JSON.parse(value) };
      } catch (err) {
        console.error(err);
      }
    },
  };
});

type CONFIG_GOOGLE_SCHEMA_TYPE = {
  GOOGLE_CLOUD_CREDENTIALS: object;
  GOOGLE_CLOUD_STORAGE_BUCKET_NAME: string;
};

export const CONFIG_GOOGLE_SCHEMA: Joi.StrictSchemaMap<CONFIG_GOOGLE_SCHEMA_TYPE> =
  {
    GOOGLE_CLOUD_CREDENTIALS: joiJson.object().required(),
    GOOGLE_CLOUD_STORAGE_BUCKET_NAME: Joi.string().required(),
  };

@Module({})
export class ConfigModule extends NestConfigModule {
  static forRoot(options: ConfigModuleOptions = {}) {
    const { envFilePath, ...otherOptions } = options;
    
    return super.forRoot({
      isGlobal: true,
      // quem vem antes na lista envFilePath é quem prevalece em chaves duplicadas.
      // "As variáveis de ambiente definidas nos arquivos mais à esquerda do array sobrescrevem as à direita."
      envFilePath: [
        ...(Array.isArray(envFilePath) ? envFilePath! : [envFilePath!]),
        join(process.cwd(), 'envs', `.env.${process.env.NODE_ENV}`),
        join(process.cwd(), 'envs', `.env`),
      ],
      validationSchema: Joi.object({
        ...CONFIG_DB_SCHEMA,
        ...CONFIG_GOOGLE_SCHEMA,
      }),
      ...otherOptions,
    });
  }
}