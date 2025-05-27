import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Community } from './entities/community.entity';
import { CommunitysController } from './communities.controller';
import { CommunitysService } from './communities.service';

@Module({
  imports: [TypeOrmModule.forFeature([Community])],
  controllers: [CommunitysController],
  providers: [CommunitysService],
})
export class CommunitysModule {}
