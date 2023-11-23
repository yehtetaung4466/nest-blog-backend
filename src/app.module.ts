import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { DrizzleModule } from './drizzle/drizzle.module';
import { AuthModule } from './auth/auth.module';
import { PaginateCheckMiddleware } from './middlewares/PaginateCheck.middleware';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserModule } from './user/user.module';
import { BlogModule } from './blog/blog.module';
import { FileModule } from './file/file.module';
import { MulterModule } from '@nestjs/platform-express';
import { CommentModule } from './comment/comment.module';
import { ReactionModule } from './reaction/reaction.module';

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
    CommentModule,
    ReactionModule,
  ],
  providers: [JwtService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(PaginateCheckMiddleware).forRoutes({
      path: '/blogs',
      method: RequestMethod.GET,
    });
  }
}
