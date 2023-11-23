import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
  CanActivate,
} from '@nestjs/common';
import { GeneralGuard } from './general.guard';
import { DrizzleService } from 'src/drizzle/drizzle.service';

@Injectable()
export class UserGuard extends GeneralGuard implements CanActivate {
  constructor(drizzleService: DrizzleService) {
    super(drizzleService);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const user = await this.getUser(context);
    const canActivate = (await super.canActivate(context)) && user.role >= 0;
    if (!canActivate) {
      throw new UnauthorizedException(
        'Your are not authorized for this action',
      );
    }
    return true;
  }
}
