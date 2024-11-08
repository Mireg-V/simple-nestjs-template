import { InternalServerErrorException, Logger } from "@nestjs/common";
import { Post, Prisma } from "@prisma/client";
import { UserEntity } from "src/user/addon/user.entity";

export class PostEntity implements Post {
  id: string;
  ownerId: string;
  title: string;
  content: string;
  createdAt: Date;

  public static select = ({ owner }: Prisma.PostSelect = {}): Prisma.PostDefaultArgs => ({
    select: {
      id: true,
      ownerId: true,
      title: true,
      content: true,
      owner: owner && UserEntity.select()
    }
  });

  public static generateId(relation: UserEntity['userId']) {
    if (!relation) {
      Logger.error(`Method ${this.name}.${this.generateId.name} recived empty relation`);
      throw new InternalServerErrorException()
    }

    return `${relation}-${crypto.randomUUID()}`
  }
}

export interface PostSelectOptions {
  owner?: boolean;
}