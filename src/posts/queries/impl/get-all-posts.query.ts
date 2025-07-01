import { IQuery } from '@nestjs/cqrs';
import { PaginatePostsDto } from 'src/posts/dto/paginate-posts.dto';

export class GetAllPostsQuery implements IQuery {
  constructor(public readonly pagination: PaginatePostsDto) {}
}
