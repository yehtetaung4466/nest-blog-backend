import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { blogDto } from './blogDto';
import { Request } from 'express';
import { JWT_PAYLOAD } from 'src/utils/types';
import { UserGuard } from 'src/guards/user.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as uuid from 'uuid';
@Controller('blogs')
export class BlogController {
  constructor(private blogService: BlogService) {}
  newFileName;
  @UseGuards(UserGuard)
  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './files/blogImages',
        filename: (req, file, callback) => {
          const extention = file.originalname.split('.').pop();
          const newFileName = `${uuid.v4()}.${extention}`;
          file.originalname = newFileName;
          callback(null, newFileName);
        },
      }),
    }),
  )
  async createPost(
    @Body() dto: blogDto,
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File | undefined,
  ) {
    const user = req.user as JWT_PAYLOAD;
    return await this.blogService.createBlog(
      dto.title,
      dto.content,
      user.id,
      file,
    );
  }

  @Get()
  async getBlogs(@Query('paginate', ParseIntPipe) paginate: number) {
    return await this.blogService.getTenBlogs(paginate);
  }
  @Get('/:id')
  async getBlogById(@Param('id', ParseIntPipe) id: number) {
    return this.blogService.getBlogById(id);
  }

  @Get('/count')
  async getCount() {
    return await this.blogService.getBlogCount();
  }
}
