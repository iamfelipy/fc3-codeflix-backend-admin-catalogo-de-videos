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
  UseInterceptors,
  BadRequestException
} from '@nestjs/common';
import { CreateVideoUseCase } from '../../core/video/application/use-cases/create-video/create-video.use-case';
import { UpdateVideoUseCase } from '../../core/video/application/use-cases/update-video/update-video.use-case';
import { UploadAudioVideoMediasUseCase } from '../../core/video/application/use-cases/upload-audio-video-medias/upload-audio-video-medias.use-case';
import { GetVideoUseCase } from '../../core/video/application/use-cases/get-video/get-video.use-case';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { UpdateVideoInput } from '../../core/video/application/use-cases/update-video/update-video.input';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { UploadAudioVideoMediaInput } from '../../core/video/application/use-cases/upload-audio-video-medias/upload-audio-video-media.input';
import { UploadImageMediasInput } from '@core/video/application/use-cases/upload-image-medias/upload-image-medias.input';
import { UploadImageMediasUseCase } from '@core/video/application/use-cases/upload-image-medias/upload-image-medias.use-case';

@Controller('videos')
export class VideosController {
  @Inject(CreateVideoUseCase)
  private createUseCase: CreateVideoUseCase;

  @Inject(UpdateVideoUseCase)
  private updateUseCase: UpdateVideoUseCase;

  @Inject(UploadAudioVideoMediasUseCase)
  private uploadAudioVideoMedia: UploadAudioVideoMediasUseCase;

  @Inject(UploadImageMediasUseCase)
  private uploadImageMedias: UploadImageMediasUseCase;

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

  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'banner', maxCount: 1 },
      { name: 'thumbnail', maxCount: 1 },
      { name: 'thumbnail_half', maxCount: 1 },
      { name: 'trailer', maxCount: 1 },
      { name: 'video', maxCount: 1 },
    ]),
  )
  @Patch(':id')
  async update(
    @Param('id', new ParseUUIDPipe({ errorHttpStatusCode: 422 })) id: string,
    /*
      - esse patch vai ser usado tanto para o update comum quanto para o upload dos arquivos.
      - se o body fosse a classe iria dar erro, quando fosse feito o upload, pois o pipe do nest tentaria validar
      - vai validar no corpo do metodo
    */
    @Body() updateVideoDto: any,
    @UploadedFiles()
    files: {
      banner?: Express.Multer.File[];
      thumbnail?: Express.Multer.File[];
      thumbnail_half?: Express.Multer.File[];
      trailer?: Express.Multer.File[];
      video?: Express.Multer.File[];
    } | undefined,
  ) {
    /*
      tem 3 usecase mudando o estado, ë executado apenas um deles
      updateUseCase
      uploadAudioVideoMedia
      uploadImageMedias
      o unit for work esta scope.request os 3 usecase recebem a mesma instancia injetada com usefactory
      cada usecase abre uma transacao e depois fecha ela


      implementar usecase de update de imagem
      provider dele
      testar se esta funcionando
    */
    console.log('files', files);
    console.log('updateVideoDto', updateVideoDto);
    files = files ?? {}
    const hasFiles = files ? Object.keys(files).length : false;
    const hasData = Object.keys(updateVideoDto).length > 0;

    if (hasFiles && hasData) {
      throw new BadRequestException('Files and data cannot be sent together');
    }

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
      await this.updateUseCase.execute(input);
    }
   
    const hasMoreThanOneFile = Object.keys(files).length > 1;
    if (hasMoreThanOneFile) {
      throw new BadRequestException('Only one file can be sent');
    }

    /*

      Os campos principais de Express.Multer.File são:

      fieldname
      originalname
      encoding
      mimetype
      buffer (ou path, dependendo da configuração)
      size
    */

    const audioVideoFields = ['trailer', 'video'];
    const imageFields = ['banner', 'thumbnail', 'thumbnail_half'];

    const hasAudioVideoMedia = audioVideoFields.some(field => files[field]?.length);
    const hasImageMedia = imageFields.some(field => files[field]?.length);

    
    if (hasAudioVideoMedia) {
      const fileField = Object.keys(files)[0];
      const file = files[fileField][0];
      const dto: UploadAudioVideoMediaInput = {
        video_id: id,
        field: fileField as 'trailer' | 'video',
        file: {
          raw_name: file.originalname,
          data: file.buffer,
          mime_type: file.mimetype,
          size: file.size,
        },
      };

      const input = await new ValidationPipe({
        errorHttpStatusCode: 422,
      }).transform(dto, {
        metatype: UploadAudioVideoMediaInput,
        type: 'body',
      });

      await this.uploadAudioVideoMedia.execute(input);
    } else if (
      hasImageMedia
    ) {
      const fileField = Object.keys(files)[0];
      const file = files[fileField][0];
      const dto = new UploadImageMediasInput({
        video_id: id,
        field: fileField as 'banner' | 'thumbnail' | 'thumbnail_half',
        file: {
          raw_name: file.originalname,
          data: file.buffer,
          mime_type: file.mimetype,
          size: file.size,
        },
      });

      const input = await new ValidationPipe({
        errorHttpStatusCode: 422,
      }).transform(dto, {
        metatype: UploadImageMediasInput,
        type: 'body',
      });

      await this.uploadImageMedias.execute(input);
    }

    //- usecase de get video nao esta retornando os anexos
      // - banner, trailer, video, thumbnail, thumbnail_half
    // faltou usar presenter
    // CQS se aplica a métodos individuais (um comando ou uma query por vez). Já CQRS (Command Query Responsibility Segregation) separa componentes inteiros (por exemplo, casos de uso, serviços, ou até bancos) para comandos e queries. Seu exemplo usa CQS, mas o padrão dos casos de uso separados sugere CQRS numa escala maior do sistema.
    return await this.getUseCase.execute({ id });
  }

  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'banner', maxCount: 1 },
      { name: 'thumbnail', maxCount: 1 },
      { name: 'thumbnail_half', maxCount: 1 },
      { name: 'trailer', maxCount: 1 },
      { name: 'video', maxCount: 1 },
    ]),
  )
  // poderia ter usado esse inves de juntar o upload na atualizacao
  @Patch(':id/upload')
  async uploadFile(
    @Param('id', new ParseUUIDPipe({ errorHttpStatusCode: 422 })) id: string,
    @UploadedFiles()
    files: {
      banner?: Express.Multer.File[];
      thumbnail?: Express.Multer.File[];
      thumbnail_half?: Express.Multer.File[];
      trailer?: Express.Multer.File[];
      video?: Express.Multer.File[];
    },
  ) {
    const hasMoreThanOneFile = Object.keys(files).length > 1;
    if (hasMoreThanOneFile) {
      throw new BadRequestException('Only one file can be sent');
    }

    /*

      Os campos principais de Express.Multer.File são:

      fieldname
      originalname
      encoding
      mimetype
      buffer (ou path, dependendo da configuração)
      size
    */

    const audioVideoFields = ['trailer', 'video'];
    const imageFields = ['banner', 'thumbnail', 'thumbnail_half'];

    const hasAudioVideoMedia = audioVideoFields.some(field => files[field]?.length);
    const hasImageMedia = imageFields.some(field => files[field]?.length);

    
    if (hasAudioVideoMedia) {
      const fileField = Object.keys(files)[0];
      const file = files[fileField][0];
      const dto: UploadAudioVideoMediaInput = {
        video_id: id,
        field: fileField as 'trailer' | 'video',
        file: {
          raw_name: file.originalname,
          data: file.buffer,
          mime_type: file.mimetype,
          size: file.size,
        },
      };

      const input = await new ValidationPipe({
        errorHttpStatusCode: 422,
      }).transform(dto, {
        metatype: UploadAudioVideoMediaInput,
        type: 'body',
      });

      await this.uploadAudioVideoMedia.execute(input);
    } else if (
      hasImageMedia
    ) {
      const fileField = Object.keys(files)[0];
      const file = files[fileField][0];
      const dto = new UploadImageMediasInput({
        video_id: id,
        field: fileField as 'banner' | 'thumbnail' | 'thumbnail_half',
        file: {
          raw_name: file.originalname,
          data: file.buffer,
          mime_type: file.mimetype,
          size: file.size,
        },
      });

      const input = await new ValidationPipe({
        errorHttpStatusCode: 422,
      }).transform(dto, {
        metatype: UploadImageMediasInput,
        type: 'body',
      });

      await this.uploadImageMedias.execute(input);
    }
    
    return await this.getUseCase.execute({ id });
  }
}
