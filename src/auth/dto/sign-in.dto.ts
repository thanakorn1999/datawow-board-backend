import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Matches, MaxLength, MinLength } from 'class-validator';

export class SignInDto {
  @ApiProperty({
    description: 'Username of user',
    example: 'username',
  })
  @MaxLength(255)
  @IsNotEmpty()
  readonly username: string;
}
