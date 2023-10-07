import { Module } from '@nestjs/common';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { UserGuard } from 'src/guards/user.guard';
import { DrizzleService } from 'src/drizzle/drizzle.service';

@Module({
  controllers: [FileController],
  providers: [FileService,DrizzleService],
})
export class FileModule {}
