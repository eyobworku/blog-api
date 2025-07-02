import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { Post } from 'src/posts/entities/post.entity';
import { Comment } from './entities/comment.entity';
import { CommentsController } from './comments.controller';
import { GetCommentsHandler } from './queries/handlers/get-comments.handler';
import { CreateCommentHandler } from './commands/handlers/create-comment.handler';
@Module({
  imports: [TypeOrmModule.forFeature([Comment, Post]), CqrsModule],
  controllers: [CommentsController],
  providers: [GetCommentsHandler, CreateCommentHandler],
})
export class CommentsModule {}
