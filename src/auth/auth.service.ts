import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { DrizzleService } from 'src/drizzle/drizzle.service';
import { users } from 'src/drizzle/schema';
import * as argon from 'argon2';
import { eq } from 'drizzle-orm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JWT_PAYLOAD } from 'src/utils/types';

@Injectable()
export class AuthService {
  constructor(
    private drizzleService: DrizzleService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  async signup(email: string, password: string, name: string) {
    try {
      const hash = await argon.hash(password);
      await this.drizzleService.db
        .insert(users)
        .values({ email, password: hash, name });
      return { msg: 'signup success' };
    } catch (err) {
      switch (true) {
        case err.sqlMessage.includes('users.users_email_unique'):
          throw new ConflictException('Email is already used');
        case err.sqlMessage.includes('users.users_name_unique'):
          throw new ConflictException('Username is unavailable');
        default:
          throw new HttpException(
            'unknown database error',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
      }
    }
  }

  async login(email: string, password: string) {
    const user = (
      await this.drizzleService.db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .prepare()
        .execute()
    ).at(0);
    if (!user) {
      throw new HttpException('user does not exit', HttpStatus.NOT_FOUND);
    }
    const isValid = await argon.verify(user.password, password);
    if (!isValid) {
      throw new HttpException('incorrect password', HttpStatus.UNAUTHORIZED);
    }
    delete user.password;
    const token = this.signToken(user);
    return {
      access_token: await token,
    };
  }

  private signToken(payload: JWT_PAYLOAD) {
    return this.jwtService.signAsync(payload, {
      expiresIn: '1d',
      secret: this.configService.get('JWT_SECRET'),
    });
  }
}
