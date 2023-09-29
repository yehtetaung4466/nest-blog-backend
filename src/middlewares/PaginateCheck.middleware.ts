import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class PaginateCheckMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (typeof req.query.paginate === 'undefined') {
      throw new BadRequestException('need query parameter paginate=number');
    }
    if (Number(req.query.paginate) <= 0 || isNaN(Number(req.query.paginate))) {
      throw new BadRequestException('paginate must be number greater than 0');
    }
    next();
  }
}
