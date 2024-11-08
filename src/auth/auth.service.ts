import { BadRequestException, ForbiddenException, Inject, Injectable, Logger, NotFoundException, forwardRef } from '@nestjs/common';
import { UserService } from '@api/user/user.service';
import { UserEntity, UserMinified, UserSelectOptions } from '@api/user/addon/user.entity';
import { AuthResult } from './addon/auth.dto';
import { CreateUserDto } from '@api/user/addon/user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly jwt: JwtService,
  ) {}
  async signIn({ email, username, password }: CreateUserDto): Promise<AuthResult> {
    const options: UserSelectOptions = { password: true };

    const user = email
      ? await this.userService.findByEmail(email, options)
      : await this.userService.findByUsername(username, options);

    if (!user) throw new NotFoundException();

    const isPasswordValid = this.userService.validatePassword(user.password, password);
    if (!isPasswordValid) throw new ForbiddenException();

    return this.signJWT({ userId: user.userId, username, email });
  }

  async login(token?: AuthResult): Promise<UserEntity | void> {
    if (!token) return Logger.error(`Method ${AuthService.name}.${this.login.name} recived empty token`, AuthService.name);

    const { email, userId } = this.decodeJWT(token);

    if (userId) {
      return await this.userService.findById(userId) as UserEntity;
    }
    else if (email) {
      return await this.userService.findByEmail(email) as UserEntity;
    }
  }

  async register(payload: CreateUserDto): Promise<`Bearer ${string}`> {
    const { userId, email, username } = await this.userService.create(payload);

    return this.signJWT({ userId, email, username });
  }

  public signJWT = (
    payload: UserMinified
  ): AuthResult => `Bearer ${this.jwt.sign(payload, { secret: process.env.JWT_SECRET, expiresIn: '7d' })}`;

  public decodeJWT = (token: AuthResult): UserMinified => {
    if (!token || typeof token !== 'string') throw new BadRequestException();

    const user: UserMinified | null = this.jwt.decode(token.startsWith('Bearer ') ? token.substring(7) : token)

    if (!user) throw new ForbiddenException();

    return user;
  }
}
