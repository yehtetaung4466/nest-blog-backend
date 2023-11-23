import { Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { DrizzleService } from 'src/drizzle/drizzle.service';

@Module({
  exports: [CommentService],
  controllers: [CommentController],
  providers: [CommentService, DrizzleService],
})
export class CommentModule {}
