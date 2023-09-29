import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { DrizzleService } from 'src/drizzle/drizzle.service';

@Module({
  controllers: [UserController],
  providers: [UserService, DrizzleService],
})
export class UserModule {}
