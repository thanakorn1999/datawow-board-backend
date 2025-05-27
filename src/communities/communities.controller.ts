import { Controller, Get } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { ActiveUser } from '../common/decorators/active-user.decorator';
import { Community } from './entities/community.entity';
import { CommunitysService } from './communities.service';

@ApiTags('communities')
@Controller('communities')
export class CommunitysController {
  constructor(private readonly communitiesService: CommunitysService) {}

  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiOkResponse({
    description: "Get logged in user's details",
    type: Community,
  })
  @ApiBearerAuth()
  @Get('list')
  async getMe(@ActiveUser('id') userId: number): Promise<Community> {
    return this.communitiesService.getMe(userId);
  }
}
