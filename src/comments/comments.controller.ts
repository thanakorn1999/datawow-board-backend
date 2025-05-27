import { Controller, Get } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { ActiveUser } from '../common/decorators/active-user.decorator';
import { Comment } from './entities/comment.entity';
import { CommentsService } from './comments.service';

@ApiTags('comments')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiOkResponse({
    description: "Get logged in comment's details",
    type: Comment,
  })
  @ApiBearerAuth()
  @Get('list')
  async getMe(@ActiveUser('id') userId: number): Promise<Comment> {
    return this.commentsService.getMe(userId);
  }
}
