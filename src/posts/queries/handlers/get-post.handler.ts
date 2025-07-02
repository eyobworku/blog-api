import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '../../entities/post.entity';
import { GetPostQuery } from '../impl/get-post.query';
import { PostResponseDto } from '../../dto/post-response.dto';
import { plainToInstance } from 'class-transformer';
import { NotFoundException } from '@nestjs/common';

@QueryHandler(GetPostQuery)
export class GetPostHandler implements IQueryHandler<GetPostQuery> {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async execute(query: GetPostQuery): Promise<PostResponseDto> {
    const post = await this.postRepository.findOne({
      where: { id: query.id },
      relations: ['author'],
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${query.id} not found`);
    }

    return plainToInstance(PostResponseDto, post, {
      excludeExtraneousValues: true,
    });
  }
}
