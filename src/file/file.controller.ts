import {
  Controller,
  Get,
  HttpException,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  Res,
  UnauthorizedException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import { createReadStream } from 'fs';
import { diskStorage } from 'multer';
import { join } from 'path';
import { UserGuard } from 'src/guards/user.guard';
import { JWT_PAYLOAD } from 'src/utils/types';
import { FileService } from './file.service';
@Controller('files')
export class FileController {
  constructor(private fileService: FileService) {}
  @UseGuards(UserGuard)
  @Post('profiles')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './files/profiles',
        filename: (req, file, callback) => {
          const user = req.user as JWT_PAYLOAD;
          const extension = file.originalname.split('.').pop();
          const newFileName = `user_profile_${user.id}.${extension}`;
          callback(null, newFileName);
        },
      }),
    }),
  )
  async uploadProfile(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
    @Query('id') id: string | undefined,
  ) {
    const user = req.user as JWT_PAYLOAD;
    console.log(id);
    if (id) {
      if (user.id !== Number(id)) {
        throw new UnauthorizedException('unauthorized');
      }
    }
    const extension = file.originalname.split('.').pop();
    return await this.fileService.setProfile(user.id, extension);
  }

  @Get('profiles/:fileId')
  async getProfile(
    @Param('fileId', ParseIntPipe) fileId: number,
    @Res() res: Response,
  ) {
    const profile = await this.fileService.getProfile(fileId);
    const filePath = join(process.cwd(), 'files', 'profiles', profile);
    const stream = createReadStream(filePath);
    stream.pipe(res);
  }

  @Get('blogimages/:blogId')
  async getBlogImage(
    @Param('blogId', ParseIntPipe) blogId: number,
    @Res() res: Response,
  ) {
    const image = await this.fileService.getBlogImage(blogId);
    const filePath = join(process.cwd(), 'files', 'blogImages', image);
    const stream = createReadStream(filePath);
    stream.pipe(res);
  }
}

//
