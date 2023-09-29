import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { eq } from 'drizzle-orm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { DrizzleModule } from 'src/drizzle/drizzle.module';
import { DrizzleService } from 'src/drizzle/drizzle.service';
import { users } from 'src/drizzle/schema';
import { JWT_PAYLOAD } from 'src/utils/types';

@Injectable()
export class jwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private configService: ConfigService,
    private drizzleService: DrizzleService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }
  validate(payload: JWT_PAYLOAD) {
    // console.log(payload);
    // const user = this.drizzleService.db.query.users.findFirst({
    //   where: eq(payload.sub, users.id),
    //   with: {
    //     blogs: true,
    //   },
    // });
    return payload ?? null;
  }
}
