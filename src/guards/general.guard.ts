import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { DrizzleService } from 'src/drizzle/drizzle.service';
import { users } from 'src/drizzle/schema';
import { JWT_PAYLOAD } from 'src/utils/types';

@Injectable()
export class GeneralGuard implements CanActivate {
  constructor(protected drizzleService: DrizzleService) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const user = await this.getUser(ctx);
    const request = ctx.switchToHttp().getRequest() as Request;
    
    if (!user) {
      throw new UnauthorizedException('unauthorized');
    }
    request.user=user;
    return true;
    
  }

  protected async getUser(ctx: ExecutionContext) {
    const request = ctx.switchToHttp().getRequest() as Request;
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('need token');
    }
    const token = authHeader.substring(7);
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET) as JWT_PAYLOAD;
      const userId = decoded.id;
      const user = await this.drizzleService.db
        .select()
        .from(users)
        .where(eq(users.id, userId));
      if (!user) {
        throw new UnauthorizedException('user not found');
      }
      return user[0];
    } catch (err) {
      throw new Error(err);
    }
  }
}
