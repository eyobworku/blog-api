import { IQuery } from '@nestjs/cqrs';
import { PaginatePostsDto } from 'src/posts/dto/paginate-posts.dto';

export class GetUserPostsQuery implements IQuery {
  constructor(
    public readonly userId: number,
    public readonly pagination: PaginatePostsDto,
  ) {}
}
