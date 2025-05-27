import { BaseEntity } from '../../shared/base.entity';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Column, Entity } from 'typeorm';

@Entity({
  name: 'communities',
})
export class Community extends BaseEntity {
  @Column()
  text: number;
}
