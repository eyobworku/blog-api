import { PostResponseDto } from './post-response.dto';

export class PaginatedPostsDto {
  data: PostResponseDto[];
  meta: {
    total: number;
    page: number;
    limit: number;
    lastPage: number;
  };
}
