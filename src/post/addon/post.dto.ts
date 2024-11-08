import { NoProfanity } from "@api/application/addon/no-profanity.validator";
import { ApiProperty, PartialType } from "@nestjs/swagger";
import { Prisma } from "@prisma/client";
import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class CreatePostDto implements Prisma.PostCreateWithoutOwnerInput {
  @ApiProperty({
    description: 'Required title for post',
    example: 'Example Title',
    minLength: 4,
    maxLength: 32,
    required: true,
  })
  @IsString()
  @NoProfanity()
  @MinLength(4)
  @MaxLength(32)
  title: string;
  
  
  @ApiProperty({
    description: 'Required content for post',
    example: 'some content without profanity w0rds from @api/application/addon/profanity.data.ts (w + o + r + d is banned)',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @NoProfanity()
  content: string;
}

export class UpdatePostDto extends PartialType(CreatePostDto) {}