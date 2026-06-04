import { DynamicModule, Module } from '@nestjs/common';
import {
  ConfigModuleOptions,
} from '@nestjs/config';

import { ConfigModule } from '../config-module/config.module';
import { DatabaseModule } from './database.module';

@Module({
  imports: [ConfigModule.forRoot(), DatabaseModule],
})
export class MigrationsModule {
  // isso nao foi feito na aula, fiz por causa do desafio de teste de migrations
  static forRoot(
    configOptions?: ConfigModuleOptions,
  ): DynamicModule {
    return {
      module: MigrationsModule,
      imports: [
        ConfigModule.forRoot(configOptions),
        DatabaseModule,
      ],
    };
  }
}