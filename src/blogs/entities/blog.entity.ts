import { BaseEntity } from '../../shared/base.entity';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Column, Entity } from 'typeorm';

@Entity({
  name: 'blogs',
})
export class Blog extends BaseEntity {
  @ApiProperty({ description: 'title of Blog', example: 'title-blog' })
  @Column()
  title: string;

  @ApiProperty({ description: 'text of Blog', example: 'text-blog' })
  @Column()
  text: string;

  @ApiProperty({
    description: 'community id of Blog',
    example: 1,
  })
  @Column({
    name: 'community_id',
  })
  communityId: number;

  @ApiProperty({
    description: 'id of User',
    example: 1,
  })
  @Column({
    name: 'user_id',
  })
  userId: number;
}
