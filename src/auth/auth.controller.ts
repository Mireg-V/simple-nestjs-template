import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from '@api/user/addon/user.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) {}

  @Post('sign-in')
  async getUrl(
    @Res({ passthrough: true }) response: Response,
    @Body() createUserDto: CreateUserDto
  ) {
    const Authorization = this.authService.signIn(createUserDto);

    response.cookie('Authorization', Authorization);

    return Authorization;
  }

  @Post('register')
  async register(
    @Body() createUserDto: CreateUserDto,
  ) {
    return this.authService.register(createUserDto)
  }
}
