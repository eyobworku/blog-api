import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { GetCommentsQuery } from './queries/impl/get-comments.query';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateCommentCommand } from './commands/impl/create-comment.command';
import { CreateCommentDto } from './dto/create-comment.dto';

// src/comments/comments.controller.ts
@Controller('posts/:postId/comments')
export class CommentsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Param('postId') postId: string,
    @Body(ValidationPipe) dto: CreateCommentDto,
    @Req() req,
  ) {
    return this.commandBus.execute(
      new CreateCommentCommand(+postId, dto.content, req.user.id),
    );
  }

  @Get()
  findAll(@Param('postId') postId: string) {
    return this.queryBus.execute(new GetCommentsQuery(+postId));
  }
}
