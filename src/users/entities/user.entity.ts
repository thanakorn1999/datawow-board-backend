import { BaseEntity } from '../../shared/base.entity';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Column, Entity } from 'typeorm';

@Entity({
  name: 'users',
})
export class User extends BaseEntity {
  @ApiProperty({ description: 'Username of user', example: 'username' })
  @Column({ unique: true })
  username: string;
}
