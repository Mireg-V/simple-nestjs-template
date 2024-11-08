import { ApiProperty } from '@nestjs/swagger';
import { Prisma, User } from '@prisma/client';
import { PostEntity } from 'src/post/addon/post.entity';

export class UserEntity implements User {
  @ApiProperty({ example: crypto.randomUUID(), description: 'User ID from database' })
  userId!: string;

  @ApiProperty({ example: 'user@impactium.fun', description: 'Email address of the user', nullable: true })
  email!: string | null;

  @ApiProperty({ example: 'username', description: 'Username of the user', nullable: true })
  username!: string | null;

  // @ApiProperty({ example: 'password', description: 'Hashed user`s password', nullable: true })
  password!: string | null;

  @ApiProperty({ type: [PostEntity], description: 'User`s post as `owner` relation', nullable: true })
  posts?: PostEntity[];

  constructor(user: UserEntity) {
    return Object.assign(this, user);
  }

  public static select = ({ password = false }: UserSelectOptions = {}): Prisma.UserDefaultArgs => ({
    select: {
      password,
      userId: true,
      email: true,
      username: true,
      posts: PostEntity.select()
    }
  });
}

export interface UserMinified {
  userId: string;
  email?: string;
  username?: string;
}

export interface UserSelectOptions {
  password?: boolean;
}
