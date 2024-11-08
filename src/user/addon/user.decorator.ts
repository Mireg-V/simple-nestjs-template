import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserMinified } from './user.entity';


export const User = createParamDecorator(
  async (_, context: ExecutionContext): Promise<UserMinified> => {
    return context.switchToHttp().getRequest().user;
  },
);