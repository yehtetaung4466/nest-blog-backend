import {
  Catch,
  HttpException,
  ExceptionFilter,
  ArgumentsHost,
  HttpStatus,
  BadRequestException,
  NotFoundException,
  MethodNotAllowedException,
} from '@nestjs/common';
import { Response, Request } from 'express';

@Catch(NotFoundException)
export class PostOnlyException
  implements ExceptionFilter
{
  catch(
    exception: HttpException,
    host: ArgumentsHost,
  ) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    console.log('Post exception run');
    switch (request.method) {
      case 'POST':
        console.log(request.method);
        console.log(typeof request.method);
        response.status(status).json({
          msg: exception.message,
          method: request.method,
        });
        break;
      default:
        console.log(request.method);
        response
          .status(HttpStatus.METHOD_NOT_ALLOWED)
          .json({
            message: 'Method Not Allowed',
          });
        break;
    }
  }
}
function next() {
  throw new Error('Function not implemented.');
}
