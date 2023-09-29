import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { DrizzleService } from 'src/drizzle/drizzle.service';
import { DrizzleModule } from 'src/drizzle/drizzle.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtStrategy } from './strategy/jwt.strategy';

@Global()
@Module({
  imports: [DrizzleModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, DrizzleService, jwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
