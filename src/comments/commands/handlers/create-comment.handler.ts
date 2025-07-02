import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateCommentCommand } from '../impl/create-comment.command';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../../../posts/entities/post.entity';
import { Comment } from '../../entities/comment.entity';
import { NotFoundException } from '@nestjs/common';
import { CommentResponseDto } from '../../dto/comment-response.dto';
import { plainToInstance } from 'class-transformer';

@CommandHandler(CreateCommentCommand)
export class CreateCommentHandler
  implements ICommandHandler<CreateCommentCommand>
{
  constructor(
    @InjectRepository(Comment) private commentsRepo: Repository<Comment>,
    @InjectRepository(Post) private postsRepo: Repository<Post>,
  ) {}

  async execute(command: CreateCommentCommand) {
    const post = await this.postsRepo.findOneBy({ id: command.postId });
    if (!post) throw new NotFoundException('Post not found');

    const comment = this.commentsRepo.create({
      content: command.content,
      post: { id: command.postId },
      authorId: command.authorId,
    });

    const savedComment = await this.commentsRepo.save(comment);
    return plainToInstance(CommentResponseDto, savedComment, {
      excludeExtraneousValues: true,
    });
  }
}
