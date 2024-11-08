import { BadRequestException, Body, Controller, ForbiddenException, forwardRef, Get, Inject, NotFoundException, Param, Patch, Post, Query, Redirect, Req, Res, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@api/auth/addon/auth.guard';
import { User } from './addon/user.decorator';
import { UserEntity, UserMinified } from './addon/user.entity';
import { UpdateUserDto } from './addon/user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ApiResponseSuccess } from '@api/application/addon/responce.success.decorator';
import { ApiResponseConflict } from '@api/application/addon/response.conflict.decorator';
import { Response } from 'express';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Patch('edit')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiResponseSuccess(UserEntity)
  @ApiResponseConflict()
  setUsername(
    @Body() body: UpdateUserDto,
    @User() user: UserMinified
  ) {
    return this.userService.update(user.userId, body);
  }
}
