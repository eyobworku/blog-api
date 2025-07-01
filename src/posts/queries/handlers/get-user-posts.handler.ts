import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '../../entities/post.entity';
import { GetUserPostsQuery } from '../impl/get-user-posts.query';
import { PaginatedPostsDto } from '../../dto/paginated-posts.dto';
import { PostResponseDto } from '../../dto/post-response.dto';
import { plainToInstance } from 'class-transformer';

@QueryHandler(GetUserPostsQuery)
export class GetUserPostsHandler implements IQueryHandler<GetUserPostsQuery> {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async execute(query: GetUserPostsQuery): Promise<PaginatedPostsDto> {
    const { page = 1, limit = 10 } = query.pagination;
    const skip = (page - 1) * limit;

    const [posts, total] = await this.postRepository.findAndCount({
      where: { authorId: query.userId },
      // relations: ['author'],
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
