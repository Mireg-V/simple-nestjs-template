import { Injectable, CanActivate, ExecutionContext, BadRequestException } from '@nestjs/common';
import { PostService } from '../post.service';
import { UserEntity } from '@api/user/addon/user.entity';
import { AuthGuard } from '@api/auth/addon/auth.guard';
import { PostEntity } from './post.entity';

/**
 * Для проверки, существует ли post по id через базу данных
 * 
 * По желанию - сделаем через Redis
 * 
 * Проходит без юзера
*/
@Injectable()
export class PostExistanseGuard implements CanActivate {
  constructor(
    private readonly postService: PostService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    if (!request.params.id) throw new BadRequestException();

    request.post = await this.postService.findById(request.params.id);

    return !!request.post;
  }
}


/**
 * Для проверки, является ли пользователь сделавший реквест владельцем поста
 * 
 * Если пользователя нет, сначала проверит и добавит в реквест
 * 
 * Проверяет по id где id.includes(user.userId)
 * 
 * Добавляет request.post которое доступно по @Post(): PostEntity
*/
@Injectable()
export class PostOwnerGuard implements CanActivate {
  constructor(
    private readonly postExistanseGuard: PostExistanseGuard,
    private readonly authGuard: AuthGuard,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    if (!request.user) await this.authGuard.canActivate(context);

    if (!request.post) await this.postExistanseGuard.canActivate(context);

    const { userId }: UserEntity = request.user
    const { ownerId }: PostEntity = request.post

    return userId === ownerId;
  }
}
