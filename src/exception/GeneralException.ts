import {
  Catch,
  HttpException,
  ExceptionFilter,
  ArgumentsHost,
  HttpStatus,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class GeneralException implements ExceptionFilter {
  catch(exception: HttpException | any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    switch (true) {
      case exception.response &&
        exception.response.message &&
        Array.isArray(exception.response.message) &&
        exception.response.message.every(
          (element) => typeof element === 'string',
        ):
        response.status(status).json({
          msg: exception.response.message[0] || 'unknown error',
        });
        break;
      case exception.response &&
        exception.response.message &&
        exception.response.message[0]:
        response.status(status).json({
          msg: exception.response.message || 'unknown error',
        });
        break;
      default:
        response.status(status).json({
          msg: exception.message || 'unknown error',
        });
        break;
    }
  }
}
