import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreatePostCommand } from '../impl/create-post.command';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '../../entities/post.entity';
import { Repository } from 'typeorm';

@CommandHandler(CreatePostCommand)
export class CreatePostHandler implements ICommandHandler<CreatePostCommand> {
  constructor(@InjectRepository(Post) private repository: Repository<Post>) {}

  async execute(command: CreatePostCommand) {
    const post = this.repository.create(command);
    return this.repository.save(post);
  }
}
