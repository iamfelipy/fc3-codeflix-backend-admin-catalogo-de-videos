import { IUseCase } from '../../../../shared/application/use-case.interface';
import { VideoId } from '../../../domain/video.aggregate';
import { IVideoRepository } from '../../../domain/video.repository';

export class DeleteVideoUseCase
  implements IUseCase<DeleteVideoInput, DeleteVideoOutput>
{
  constructor(private videoRepo: IVideoRepository) {}

  async execute(input: DeleteVideoInput): Promise<DeleteVideoOutput> {
    const videoId = new VideoId(input.id);
    await this.videoRepo.delete(videoId);
  }
}

export type DeleteVideoInput = {
  id: string;
};

type DeleteVideoOutput = void;
