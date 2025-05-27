import { BaseEntity } from '../../shared/base.entity';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Column, Entity } from 'typeorm';

@Entity({
  name: 'comments',
})
export class Comment extends BaseEntity {
  @Column()
  text: string;

  @Column({
    name: 'blog_id',
  })
  blogId: number;

  @Column({
    name: 'user_id',
  })
  userId: number;
}
