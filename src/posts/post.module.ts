// src/posts/posts.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { Post } from './entities/post.entity';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { CreatePostHandler } from './commands/handlers/create-post.handler';
import { UpdatePostHandler } from './commands/handlers/update-post.handler';
import { DeletePostHandler } from './commands/handlers/delete-post.handler';
import { GetPostHandler } from './queries/handlers/get-post.handler';
import { GetUserPostsHandler } from './queries/handlers/get-user-posts.handler';
import { GetAllPostsHandler } from './queries/handlers/get-all-posts.handler';

const CommandHandlers = [
  CreatePostHandler,
  UpdatePostHandler,
  DeletePostHandler,
];
const QueryHandlers = [GetPostHandler, GetUserPostsHandler, GetAllPostsHandler];

@Module({
  imports: [TypeOrmModule.forFeature([Post]), CqrsModule],
  controllers: [PostsController],
  providers: [PostsService, ...CommandHandlers, ...QueryHandlers],
})
export class PostsModule {}
