import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Community } from './entities/community.entity';

@Injectable()
export class CommunitysService {
  constructor(
    @InjectRepository(Community)
    private readonly userRepository: Repository<Community>,
  ) {}

  async getMe(userId: number): Promise<Community> {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });
    if (!user) {
      throw new BadRequestException('Community not found');
    }

    return user;
  }
}
