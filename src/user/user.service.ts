import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '@api/prisma/prisma.service';
import { UserEntity, UserSelectOptions } from './addon/user.entity';
import { CreateUserDto, UpdateUserDto } from './addon/user.dto';
import { createHash, createHmac } from 'crypto';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  findById = (
    userId: string,
    options: UserSelectOptions = {}
  ): Promise<UserEntity | null> => userId ? this._findBy({ userId }, options) : null;
  
  findByEmail = (
    email: string,
    options: UserSelectOptions = {}
  ): Promise<UserEntity | null> => email ? this._findBy({ email }, options) : null;

  findByUsername = (
    username: string,
    options: UserSelectOptions = {}
  ): Promise<UserEntity | null> => username ? this._findBy({ username }, options) : null;

  private _findBy(data: Prisma.UserFindUniqueArgs['where'], options: UserSelectOptions = {}) {
    return this.prisma.user.findUnique({
      where: data,
      ...UserEntity.select(options)
    });
  }

  async create(data: CreateUserDto): Promise<UserEntity> {
    data.password = this.hashPassword(data.password);

    const user = this.prisma.user.create({
      data
    }).catch((err) => {
      throw new ConflictException(err);
    });

    return user;
  }

  async update(userId: string, user: UpdateUserDto) {
    return this.prisma.user.update({
      where: { userId },
      data: { ...user },
      ...UserEntity.select()
    }).catch((err) => {
      throw new ConflictException(err)
    });
  }

  public validatePassword = (
    userPassword: UserEntity['password'],
    reqPassword: string
  ) => userPassword === this.hashPassword(reqPassword);

  public hashPassword = (
    password: string
  ) => createHmac('sha256', createHash('sha256').digest()).update(password + process.env.SALT).digest('hex');
}
