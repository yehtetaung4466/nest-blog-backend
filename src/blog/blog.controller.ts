import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { AuthGuard } from '@nestjs/passport';
import { blogDto } from './blogDto';
import { Request } from 'express';
import { JWT_PAYLOAD } from 'src/utils/types';
import { UserGuard } from 'src/guards/user.guard';


@Controller('blogs')
export class BlogController {
  constructor(private blogService: BlogService) {}

  @UseGuards(UserGuard)
  @Post()
  async createPost(@Body() dto: blogDto, @Req() req: Request) {
    const user = req.user as JWT_PAYLOAD;
    return await this.blogService.createBlog(dto.title, dto.content, user.id);
  }

  @Get()
  async getBlogs(@Query('paginate') paginate: number) {
    return await this.blogService.getTenBlogs(paginate);
  }

  @Get('/count')
  @UseGuards(AuthGuard('jwt'))
  async getCount() {
    return await this.blogService.getBlogCount();
  }
}
