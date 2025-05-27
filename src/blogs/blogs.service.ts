import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostBlogDto } from './dto/post-blog.dto';

import { Blog } from './entities/blog.entity';

@Injectable()
export class BlogsService {
  constructor(
    @InjectRepository(Blog)
    private readonly repo: Repository<Blog>,
  ) {}

  async list(userId: number): Promise<Blog> {
    const user = await this.repo.findOne({
      where: {
        id: userId,
      },
    });
    if (!user) {
      throw new BadRequestException('Blog not found');
    }
    return user;
  }

  async create(postBlogDto: PostBlogDto, userId: number): Promise<void> {
    const blog = new Blog();
    blog.title = postBlogDto.title;
    blog.text = postBlogDto.text;
    blog.communityId = postBlogDto.communityId;
    blog.userId = userId;
    await this.repo.save(blog);
  }
}
