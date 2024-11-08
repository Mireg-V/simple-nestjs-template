import { PrismaModule } from '@api/prisma/prisma.module';
import { UserModule } from '@api/user/user.module';
import { AuthModule } from '@api/auth/auth.module';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { PostModule } from '@api/post/post.module';
import { RequestMiddleware } from './addon/request.middleware';
import { ResponseMiddleware } from './addon/response.middleware';

@Module({
  imports: [
    AuthModule,
    UserModule,
    PrismaModule,
    PostModule
  ]
})
export class ApplicationModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestMiddleware, ResponseMiddleware).forRoutes('*');
  }
}
