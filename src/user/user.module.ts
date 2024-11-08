import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaModule } from '@api/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from '@api/auth/auth.module';

@Module({
  controllers: [UserController],
  imports: [
    JwtModule,
    PrismaModule,
    forwardRef(() => AuthModule)
  ],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
