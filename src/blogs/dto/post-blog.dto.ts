import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Matches, MaxLength, MinLength } from 'class-validator';

export class PostBlogDto {
  @ApiProperty({
    description: 'title of Post',
    example: `What is Lorem Ipsum?`,
  })
  @MaxLength(255)
  @IsNotEmpty()
  readonly title: string;

  @ApiProperty({
    description: 'text of Post',
    example: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`,
  })
  @MaxLength(1000)
  @IsNotEmpty()
  readonly text: string;

  @ApiProperty({
    description: 'community id of Post',
    example: 1,
  })
  @IsNotEmpty()
  readonly communityId: number;
}
