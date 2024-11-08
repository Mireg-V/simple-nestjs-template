import { Injectable, CanActivate, ExecutionContext, BadRequestException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const token = request.cookies.Authorization || request.headers.token

    request.user = token ? this.authService.decodeJWT(token) : undefined;

    return !!request.user;
  }
}
