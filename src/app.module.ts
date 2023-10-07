import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { DrizzleModule } from './drizzle/drizzle.module';
import { AuthModule } from './auth/auth.module';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { DrizzleService } from './drizzle/drizzle.service';
import { PaginateCheckMiddleware } from './middlewares/PaginateCheck.middleware';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';
import { BlogModule } from './blog/blog.module';
import { UserService } from './user/user.service';
import { FileModule } from './file/file.module';
import { MulterModule } from '@nestjs/platform-express';
import { FileService } from './file/file.service';

@Module({
  imports: [
    MulterModule.register({
      dest: './files/profiles',
    }),
    DrizzleModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserModule,
    BlogModule,
    FileModule,
  ],
  controllers: [AuthController, UserController],
  providers: [AuthService, DrizzleService, JwtService, UserService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(PaginateCheckMiddleware).forRoutes({
      path: '/blog',
      method: RequestMethod.GET,
    });
  }
}
