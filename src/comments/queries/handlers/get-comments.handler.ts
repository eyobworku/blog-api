import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsOrder, Repository } from 'typeorm';
import { GetCommentsQuery } from '../impl/get-comments.query';
import { PostCommentsResponseDto } from '../../dto/post-comments-response.dto';
import { Post } from '../../../posts/entities/post.entity';
import { Comment } from '../../entities/comment.entity';
import { NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { PostResponseDto } from '../../../posts/dto/post-response.dto';
import { CommentResponseDto } from 'src/comments/dto/comment-response.dto';

@QueryHandler(GetCommentsQuery)
export class GetCommentsHandler implements IQueryHandler<GetCommentsQuery> {
  constructor(
    @InjectRepository(Comment) private commentRepo: Repository<Comment>,
    @InjectRepository(Post) private postRepo: Repository<Post>,
  ) {}

  async execute(query: GetCommentsQuery): Promise<PostCommentsResponseDto> {
    const [post, comments] = await Promise.all([
      this.postRepo.findOne({
        where: { id: query.postId },
        relations: ['author'],
      }),
      this.commentRepo.find({
        where: { post: { id: query.postId } },
        relations: ['author'],
        order: { createdAt: 'DESC' },
      }),
    ]);

    if (!post) throw new NotFoundException('Post not found');

    return {
      post: plainToInstance(PostResponseDto, post, {
        excludeExtraneousValues: true,
      }),
      comments: plainToInstance(CommentResponseDto, comments, {
        excludeExtraneousValues: true,
      }),
    };
  }
}
