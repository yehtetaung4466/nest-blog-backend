import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DrizzleService } from 'src/drizzle/drizzle.service';
import { users } from 'src/drizzle/schema';

@Injectable()
export class UserService {
  constructor(private drizzleService: DrizzleService) {}

  async getCurrentUser(id: number) {
    const user = await this.drizzleService.db.query.users.findFirst({
      where: eq(users.id, id),
      with: {
        blogs: true,
      },
    });
    if (!user) throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    delete user.password;
    return user;
  }
}
