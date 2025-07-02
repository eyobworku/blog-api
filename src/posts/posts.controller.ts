import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Delete,
  Param,
  Req,
  Query,
  Patch,
  ForbiddenException,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { CreatePostDto } from './dto/create-post.dto';
import { PaginatePostsDto } from './dto/paginate-posts.dto';
import { UserRole } from 'src/users/interfaces/user.role.enum';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body(ValidationPipe) dto: CreatePostDto, @Req() req) {
    return this.postsService.createPost(dto, req.user.id);
  }

  @Get()
  async findAll(
    @Query(ValidationPipe)
    pagination: PaginatePostsDto,
  ) {
    return this.postsService.findAllPosts(pagination);
  }

  @Get('user/:userId')
  @UseGuards(JwtAuthGuard)
  findUserPosts(
    @Param('userId') userId: number,
    @Query(ValidationPipe) pagination: PaginatePostsDto,
    @Req() req,
  ) {
    const requestedUserId = Number(userId);
    if (req.user.id !== requestedUserId && req.user.role !== UserRole.ADMIN) {
      throw new ForbiddenException();
    }
    return this.postsService.findUserPosts(requestedUserId, pagination);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findPostById(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body(ValidationPipe) dto: UpdatePostDto,
    @Req() req,
  ) {
    return this.postsService.updatePost(
      +id,
      dto,
      req.user.id,
      req.user.role === UserRole.ADMIN,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @Req() req) {
    return this.postsService.deletePost(
      +id,
      req.user.id,
      req.user.role === UserRole.ADMIN,
    );
  }
}
