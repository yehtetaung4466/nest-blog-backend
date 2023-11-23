import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { JWT_PAYLOAD } from 'src/utils/types';
import { UserService } from './user.service';
import { UserGuard } from 'src/guards/user.guard';
import { BlogService } from 'src/blog/blog.service';

@Controller('users')
export class UserController {
  constructor(
    private userService: UserService,
    private blogService: BlogService,
  ) {}
  @UseGuards(UserGuard)
  @Get('me')
  async getMe(@Req() req: Request) {
    const user = req.user as JWT_PAYLOAD;
    return await this.userService.getUserById(user.id);
  }

  @UseGuards(UserGuard)
  @Patch('/:userId')
  async chaneUserName(
    @Param('userId', ParseIntPipe) userIdToUpdate: number,
    @Body('name') name: string,
    @Req() req: Request,
  ) {
    const userFromJwt = req.user as JWT_PAYLOAD;
    if (!name) {
      throw new BadRequestException('name of body must not be empty');
    }
    if (userFromJwt.id !== userIdToUpdate) {
      throw new UnauthorizedException('you are unauthorized for this action');
    }
    return await this.userService.changeUserNameById(name, userIdToUpdate);
  }
  @Get('/:userId')
  async getUser(@Param('userId', ParseIntPipe) userId: number) {
    return await this.userService.getUserById(userId);
  }
  @Get('/:userId/activities')
  async getActivities(@Param('userId', ParseIntPipe) userId: number) {
    return this.userService.getActivitiesById(userId);
  }
  @Get('/:userId/blogs')
  async getBlogsByUserId(
    @Param('userId', ParseIntPipe) userId: number,
    @Res() res: Response,
  ) {
    const posts = await this.blogService.getAllBlogsByUserId(userId);
    if (posts.length > 0) {
      res.json(posts).status(200);
    } else {
      res.status(204).send();
    }
  }
}
