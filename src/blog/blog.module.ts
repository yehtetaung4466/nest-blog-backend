import { Module } from '@nestjs/common';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';
import { DrizzleService } from 'src/drizzle/drizzle.service';

@Module({
  exports: [BlogService],
  controllers: [BlogController],
  providers: [BlogService, DrizzleService],
})
export class BlogModule {}
