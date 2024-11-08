import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from './addon/auth.guard';
import { PrismaModule } from '@api/prisma/prisma.module';
import { UserModule } from '@api/user/user.module';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    PrismaModule,
    JwtModule,
    forwardRef(() => UserModule),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthGuard
  ],
  exports: [AuthService, AuthGuard],
})
export class AuthModule {}
