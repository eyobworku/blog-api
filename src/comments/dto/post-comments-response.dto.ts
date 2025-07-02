import { Expose, Type } from 'class-transformer';
import { PostResponseDto } from '../../posts/dto/post-response.dto';
import { CommentResponseDto } from './comment-response.dto';

export class PostCommentsResponseDto {
  @Expose()
  @Type(() => PostResponseDto)
  post: PostResponseDto;

  @Expose()
  @Type(() => CommentResponseDto)
  comments: CommentResponseDto[];
}
