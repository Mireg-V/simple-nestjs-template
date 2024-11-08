import { ApiProperty, PartialType } from "@nestjs/swagger";
import { Prisma } from "@prisma/client";
import { IsEmail, IsNotEmpty, IsOptional, IsString, IsStrongPassword, Matches, MaxLength, MinLength } from "class-validator";

export class CreateUserDto implements Prisma.UserCreateInput {
  @ApiProperty({
    description: 'Username of the user, must be unique and contain 4 to 32 characters.',
    example: 'john_doe',
    minLength: 4,
    maxLength: 32,
  })
  @IsString()
  @MinLength(4)
  @MaxLength(32)
  username: string;

  @ApiProperty({
    description: 'Email address of the user, must be a valid email format.',
    example: 'example@mail.com',
    required: true,
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Strong password for the user, must meet complexity requirements.',
    example: 'Str0ngP@ssw0rd!',
  })
  @IsStrongPassword()
  password: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({
    description: 'Optional username for updating the user',
    example: 'john_doe_updated',
    minLength: 4,
    maxLength: 32,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(4)
  @MaxLength(32)
  username?: string;

  @ApiProperty({
    description: 'Optional email for updating the user',
    example: 'updated_example@mail.com',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    description: 'Optional password for updating the user',
    example: 'NewStr0ngP@ssw0rd!',
    required: false,
  })
  @IsOptional()
  @IsStrongPassword()
  password?: string;
}
