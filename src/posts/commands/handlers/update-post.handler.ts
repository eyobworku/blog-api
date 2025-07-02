import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdatePostCommand } from '../impl/update-post.command';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '../../entities/post.entity';
import { Repository } from 'typeorm';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
@CommandHandler(UpdatePostCommand)
export class UpdatePostHandler implements ICommandHandler<UpdatePostCommand> {
  constructor(@InjectRepository(Post) private repository: Repository<Post>) {}

  async execute(command: UpdatePostCommand) {
    const post = await this.repository.findOne({
      where: { id: command.id },
      relations: ['author'],
    });

    if (!post) throw new NotFoundException('Post not found');
    if (post.author.id !== command.userId && !command.isAdmin) {
      throw new ForbiddenException('You can only update your own posts');
    }

    Object.assign(post, command.dto);
    return this.repository.save(post);
  }
}
