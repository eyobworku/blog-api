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

    const queryRunner = this.repository.manager.connection.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      // First delete comments (if cascade isn't working)
      await queryRunner.manager.delete(Comment, { post: { id: command.id } });

      // Then delete the post
      await queryRunner.manager.delete(Post, command.id);

      await queryRunner.commitTransaction();
      return { message: 'Post deleted successfully' };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
