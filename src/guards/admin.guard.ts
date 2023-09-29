import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { GeneralGuard } from './general.guard';
import { DrizzleService } from 'src/drizzle/drizzle.service';

@Injectable()
export class AdminGuard extends GeneralGuard {
  constructor(drizzleService: DrizzleService) {
    super(drizzleService);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const role = await this.getRole(context);
    const canActivate = (await super.canActivate(context)) && role >= 2;
    if (!canActivate) {
      throw new UnauthorizedException(
        'Your are not authorized for this action',
      );
    }
    return true;
  }
}
