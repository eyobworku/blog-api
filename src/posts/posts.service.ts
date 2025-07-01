import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreatePostCommand } from './commands/impl/create-post.command';
import { PaginatePostsDto } from './dto/paginate-posts.dto';
import { GetAllPostsQuery } from './queries/impl/get-all-posts.query';
import { GetUserPostsQuery } from './queries/impl/get-user-posts.query';
import { GetPostQuery } from './queries/impl/get-post.query';
import { UpdatePostCommand } from './commands/impl/update-post.command';
import { DeletePostCommand } from './commands/impl/delete-post.command';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  async createPost(dto: CreatePostDto, userId: number) {
    return this.commandBus.execute(
      new CreatePostCommand(dto.title, dto.content, userId),
    );
  }

  async findAllPosts(pagination: PaginatePostsDto) {
    return this.queryBus.execute(new GetAllPostsQuery(pagination));
  }

  async findUserPosts(userId: number, pagination: PaginatePostsDto) {
    return this.queryBus.execute(new GetUserPostsQuery(userId, pagination));
  }

  async findPostById(id: number) {
    return this.queryBus.execute(new GetPostQuery(id));
  }

  async updatePost(
    id: number,
    dto: UpdatePostDto,
    userId: number,
    isAdmin: boolean,
  ) {
    return this.commandBus.execute(
      new UpdatePostCommand(id, dto, userId, isAdmin),
    );
  }

  async deletePost(id: number, userId: number, isAdmin: boolean) {
    return this.commandBus.execute(new DeletePostCommand(id, userId, isAdmin));
  }
}
