import { Module } from '@nestjs/common';
import { CastMembersController } from './cast-members.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { CastMemberModel } from '../../core/cast-member/infra/db/sequelize/cast-member-sequelize';
import { CAST_MEMBERS_PROVIDERS } from './cast-members.providers';
@Module({

  // se você registrar globalmente CastMemberModel via SequelizeModule.forRoot({ models: [...] })/forRootAsync e usar autoLoadModels: true, não é obrigatório usar forFeature no módulo; porém, forFeature é útil para escopo correto de injeção do model via DI e boas práticas de modularização no NestJS.
  imports: [SequelizeModule.forFeature([CastMemberModel])],
  controllers: [CastMembersController],
  providers: [
    ...Object.values(CAST_MEMBERS_PROVIDERS.REPOSITORIES),
    ...Object.values(CAST_MEMBERS_PROVIDERS.USE_CASES),
  ],
  exports: [CAST_MEMBERS_PROVIDERS.REPOSITORIES.CAST_MEMBER_REPOSITORY.provide],
})
export class CastMembersModule {}
