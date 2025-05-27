import { Controller, Get, Post, Body } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { ActiveUser } from '../common/decorators/active-user.decorator';
import { Blog } from './entities/blog.entity';
import { BlogsService } from './blogs.service';
import { PostBlogDto } from './dto/post-blog.dto';

@ApiTags('blogs')
@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiOkResponse({ description: "Get logged in blog's details", type: Blog })
  @ApiBearerAuth()
  @Get('list')
  async list(@ActiveUser('id') userId: number): Promise<Blog> {
    return this.blogsService.list(userId);
  }

  @Get('list/me')
  async listMe(@ActiveUser('id') userId: number): Promise<Blog> {
    return this.blogsService.list(userId);
  }

  @Get('details/:id')
  async details(@ActiveUser('id') userId: number): Promise<Blog> {
    return this.blogsService.list(userId);
  }

  @Post('')
  async create(
    @ActiveUser('id') userId: number,
    @Body() postBlogDto: PostBlogDto,
  ): Promise<void> {
    this.blogsService.create(postBlogDto, userId);
  }
}
