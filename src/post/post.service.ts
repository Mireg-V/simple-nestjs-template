import { Injectable, Logger } from '@nestjs/common';
import { CreatePostDto, UpdatePostDto } from './addon/post.dto';
import { PrismaService } from '@api/prisma/prisma.service';
import { UserEntity } from '@api/user/addon/user.entity';
import { PostEntity } from './addon/post.entity';

@Injectable()
export class PostService {
  constructor(
    private readonly prisma: PrismaService
  ) {}
  
  findById(id: string) {
    if (!id) return Logger.log(`Method ${PostService.name}.${this.findById.name} param \`id\` is missing`, PostService.name);

    return this.prisma.post.findUnique({
      where: { id }
    });
  }

  create = (userId: UserEntity['userId'], createPostDto: CreatePostDto) => this.prisma.post.create({
    data: {
      ...createPostDto,
      owner: {
        connect: { userId }
      }
    },
  });

  findAll = () => this.prisma.post.findMany();

  findOne = (id: PostEntity['id']) => this.prisma.post.findUnique({ where: { id }});

  update = (id: PostEntity['id'], ownerId: PostEntity['ownerId'], updatePostDto: UpdatePostDto) => this.prisma.post.update({
    where: { id, ownerId },
    data: updatePostDto
  });

  delete = (id: PostEntity['id'], ownerId: PostEntity['ownerId']) => this.prisma.post.delete({ where: { id, ownerId }});
}
