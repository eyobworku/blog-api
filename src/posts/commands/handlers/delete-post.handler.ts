import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeletePostCommand } from '../impl/delete-post.command';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '../../entities/post.entity';
import { Comment } from '../../../comments/entities/comment.entity';
import { Repository } from 'typeorm';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
@CommandHandler(DeletePostCommand)
export class DeletePostHandler implements ICommandHandler<DeletePostCommand> {
  constructor(@InjectRepository(Post) private repository: Repository<Post>) {}

  async execute(command: DeletePostCommand) {
    const post = await this.repository.findOne({
      where: { id: command.id },
      relations: { author: true },
    });

    if (!post) throw new NotFoundException('Post not found');
    if (post.author.id !== command.userId && !command.isAdmin) {
      throw new ForbiddenException('You can only delete your own posts');
    }
    await this.repository.delete(command.id);
    return { message: 'Post deleted successfully' };
  }
}
