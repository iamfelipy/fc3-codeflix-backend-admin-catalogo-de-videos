import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Inject,
  ParseUUIDPipe,
  UploadedFiles,
  ValidationPipe,
} from '@nestjs/common';
import { CreateVideoUseCase } from '../../core/video/application/create-video/create-video.use-case';
import { UpdateVideoUseCase } from '../../core/video/application/update-video/update-video.use-case';
import { UploadAudioVideoMediasUseCase } from '../../core/video/application/upload-audio-video-medias/upload-audio-video-medias.use-case';
import { GetVideoUseCase } from '../../core/video/application/get-video/get-video.use-case';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { UpdateVideoInput } from '../../core/video/application/update-video/update-video.input';

@Controller('videos')
export class VideosController {
  @Inject(CreateVideoUseCase)
  private createUseCase: CreateVideoUseCase;

  @Inject(UpdateVideoUseCase)
  private updateUseCase: UpdateVideoUseCase;

  @Inject(UploadAudioVideoMediasUseCase)
  private uploadAudioVideoMedia: UploadAudioVideoMediasUseCase;

  @Inject(GetVideoUseCase)
  private getUseCase: GetVideoUseCase;

  @Post()
  async create(@Body() createVideoDto: CreateVideoDto) {
    const { id } = await this.createUseCase.execute(createVideoDto);
    // videoPresenter ficou pendente
    return await this.getUseCase.execute({ id });
  }

  @Get(':id')
  async findOne(
    @Param('id', new ParseUUIDPipe({ errorHttpStatusCode: 422 })) id: string,
  ) {
    //VideoPresenter
    // ainda nao retorna url das medias, que pode ser util no frontend
    return await this.getUseCase.execute({ id });
  }

  @Patch(':id')
  async update(
    @Param('id', new ParseUUIDPipe({ errorHttpStatusCode: 422 })) id: string,
    /*
      - esse patch vai ser usado tanto para o update comum quanto para o upload dos arquivos.
      - se o body fosse a classe iria dar erro, quando fosse feito o upload, pois o pipe do nest tentaria validar
      - vai validar no corpo do metodo
    */
    @Body() updateVideoDto: any,
  ) {
    const hasData = Object.keys(updateVideoDto).length > 0;
    /*
      body ou file
      - nesse projeto foi decidido nao receber os dois ao mesmo tempo, entao retorna um erro
      - vai ser um ou outro e um caso de uso para cada, o frontend vai ter que atender essa restricao
    */
    if (hasData) {
      // se ocorrer um erro de validação, o ValidationPipe irá lançar uma exceção automaticamente. Isso resulta em uma resposta HTTP com o status 422 (ou o código definido).
      const data = await new ValidationPipe({
        errorHttpStatusCode: 422,
      }).transform(updateVideoDto, {
        metatype: UpdateVideoDto,
        type: 'body',
      });
      const input = new UpdateVideoInput({ id, ...data });
      const { id: newId } = await this.updateUseCase.execute(input);
      // CQS se aplica a métodos individuais (um comando ou uma query por vez). Já CQRS (Command Query Responsibility Segregation) separa componentes inteiros (por exemplo, casos de uso, serviços, ou até bancos) para comandos e queries. Seu exemplo usa CQS, mas o padrão dos casos de uso separados sugere CQRS numa escala maior do sistema.
      return await this.getUseCase.execute({ id: newId });
    }
  }

  // poderia ter usado esse inves de juntar o upload na atualizacao
  @Patch(':id/upload')
  uploadFile(
    @Body()
    data,
  ) {}
}
