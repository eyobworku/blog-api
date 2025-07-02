import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '../../entities/post.entity';
import { GetAllPostsQuery } from '../impl/get-all-posts.query';
import { PaginatedPostsDto } from '../../dto/paginated-posts.dto';
import { PostResponseDto } from '../../dto/post-response.dto';
import { plainToInstance } from 'class-transformer';

@QueryHandler(GetAllPostsQuery)
export class GetAllPostsHandler implements IQueryHandler<GetAllPostsQuery> {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async execute(query: GetAllPostsQuery): Promise<PaginatedPostsDto> {
    const { page, limit } = query.pagination;

    const skip = (page - 1) * limit;
    const [posts, total] = await this.postRepository.findAndCount({
      relations: ['author'],
      take: limit,
      skip,
      order: { createdAt: 'DESC' },
    });

    return {
      data: plainToInstance(PostResponseDto, posts, {
        excludeExtraneousValues: true,
      }),
      meta: {
        total,
        page,
        limit,
        lastPage: Math.ceil(total / limit),
      },
    };
  }
}
