import { Body, Controller, HttpException, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { diskStorage } from 'multer';
import { UserGuard } from 'src/guards/user.guard';
import { JWT_PAYLOAD } from 'src/utils/types';

@Controller('file')
export class FileController {
  @UseGuards(UserGuard)
  @Post('profile')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './files/profiles',
        filename: (req, file, callback) => {
          const user = req.user as JWT_PAYLOAD;
          const extension = file.originalname.split('.').pop();
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);    
          const newFileName = `user_profile_${user.id}_${uniqueSuffix}.${extension}`;
          callback(null, newFileName);
        },
      }),
      fileFilter:(req, file, callback)=> {
        
      },
    }),
  )
  async uploadProfile(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {  
    return { msg: 'profile uploaded' };
  }
}
