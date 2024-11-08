import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { PrismaModule } from '@api/prisma/prisma.module';
import { AuthModule } from '@api/auth/auth.module';
import { PostExistanseGuard, PostOwnerGuard } from './addon/post.guard';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [PostController],
  providers: [
    PostService,
    PostExistanseGuard,
    PostOwnerGuard
  ],
})
export class PostModule {}
