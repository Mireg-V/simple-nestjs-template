import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto, UpdatePostDto } from './addon/post.dto';
import { AuthGuard } from '@api/auth/addon/auth.guard';
import { PostOwnerGuard } from './addon/post.guard';
import { PostEntity } from './addon/post.entity';
import { UserMinified } from '@api/user/addon/user.entity';
import { User } from '@api/user/addon/user.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Post')
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post('create')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  create(
    @Body() createPostDto: CreatePostDto,
    @User() user: UserMinified
  ) {
    return this.postService.create(user.userId, createPostDto);
  }

  @Get('all')
  findAll() {
    return this.postService.findAll();
  }

  @Get('find/:id')
  findOne(@Param('id') id: string) {
    return this.postService.findOne(id);
  }

  @Patch('edit/:id')
  @ApiBearerAuth()
  @UseGuards(PostOwnerGuard)
  update(
    @Param('id') id: PostEntity['id'],
    @Body() updatePostDto: UpdatePostDto,
    @User() user: UserMinified
  ) {
    return this.postService.update(id, user.userId, updatePostDto);
  }

  @Delete('delete/:id')
  @ApiBearerAuth()
  @UseGuards(PostOwnerGuard)
  delete(
    @Param('id') id: PostEntity['id'],
    @User() user: UserMinified
  ) {
    return this.postService.delete(id, user.userId);
  }
}
