import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { DrizzleService } from 'src/drizzle/drizzle.service';
import { BlogService } from 'src/blog/blog.service';

@Module({
  exports: [UserService],
  controllers: [UserController],
  providers: [UserService, DrizzleService, BlogService],
})
export class UserModule {}
