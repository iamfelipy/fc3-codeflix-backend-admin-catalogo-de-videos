import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { BadRequestException, Injectable, UseFilters,ValidationPipe } from '@nestjs/common';
import { ProcessAudioVideoMediasInput } from '../../core/video/application/use-cases/process-audio-video-medias/process-audio-video-medias.input';
import { AudioVideoMediaStatus } from '../../core/shared/domain/value-objects/audio-video-media.vo';
import { ModuleRef } from '@nestjs/core';
import { ProcessAudioVideoMediasUseCase } from '@core/video/application/use-cases/process-audio-video-medias/process-audio-video-medias.use-case';
import { RabbitmqConsumeErrorFilter } from '../rabbitmq-module/rabbitmq-consume-error/rabbitmq-consume-error.filter';

// @UseFilters() aceita uma instância do filtro ou a classe. Aqui você passa a classe:
// O Nest usa essa classe como token para localizar o provider e obter uma instância, permitindo injetar AmqpConnection no construtor.
@UseFilters(RabbitmqConsumeErrorFilter)
@Injectable()
export class VideosConsumers {
  constructor(private moduleRef: ModuleRef) {}
  
  @RabbitSubscribe({
    exchange: 'direct.delayed',
    routingKey: 'videos.convert',
    queue: 'micro-videos/admin',
    allowNonJsonMessages: true,
    queueOptions: {
      deadLetterExchange: 'dlx.exchange',
      deadLetterRoutingKey: 'videos.convert',
      //messageTtl: 5000 - tempo de vida da mensagem na fila para ser republicada
    },
  })
  async onProcessVideo(msg: {
    video: {
      resource_id: string; //video_id.field
      encoded_video_folder: string;
      status: 'COMPLETED' | 'FAILED';
    };
  }) {
    const resource_id = `${msg.video?.resource_id}`;
    const [video_id, field] = resource_id.split('.');
    const input = new ProcessAudioVideoMediasInput({
      video_id,
      field: field as 'trailer' | 'video',
      encoded_location: msg.video?.encoded_video_folder,
      status: msg.video?.status as AudioVideoMediaStatus,
    });
    // try {
      await new ValidationPipe({
        errorHttpStatusCode: 422,
      }).transform(input, {
        metatype: ProcessAudioVideoMediasInput,
        // indica a origem dos dados a serem validados.
        type: 'body',
      });
      // ModuleRef.resolve() permite buscar/criar providers em tempo de execução;
      const useCase = await this.moduleRef.resolve(
        ProcessAudioVideoMediasUseCase,
      );
      await useCase.execute(input);
    // } catch (e) {
    //   console.error(e);
    // }
  }
}

// pra simular erro no consumidor
// class FakeError extends Error {
//   constructor() {
//     super('Fake error');
//   }
// }