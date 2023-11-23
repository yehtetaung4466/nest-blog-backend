import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { eq, sql } from 'drizzle-orm';
import { DrizzleService } from 'src/drizzle/drizzle.service';
import { blog_reactions, comments, users } from 'src/drizzle/schema';

@Injectable()
export class UserService {
  constructor(private drizzleService: DrizzleService) {}

  async getUserById(id: number) {
    try {
      const user = await this.drizzleService.db.query.users.findFirst({
        where: eq(users.id, id),
      });
      if (!user)
        throw new HttpException('user not found', HttpStatus.NOT_FOUND);
      delete user.password;
      delete user.email;
      return user;
    } catch (err) {
      throw new HttpException(
        err.message || err,
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async getActivitiesById(userId: number) {
    try {
      const atvs = await this.drizzleService.db.execute(sql`
      SELECT 'comment' AS type, users.name AS authorNameOfActivityMakedBlog, comments.createdAt AS createdAt, blogs.author_id AS authorIdOfActivityMakedBlog
      FROM users
      JOIN blogs ON users.id = blogs.author_id
      JOIN comments ON blogs.id = comments.blog_id
      WHERE comments.author_id = ${userId} AND comments.createdAt >= DATE_SUB(NOW(), INTERVAL 3 DAY)
      UNION
      SELECT reactions.reaction AS type, users.name AS authorNameOfActivityMakedBlog, reactions.createdAt AS createdAt, blogs.author_id AS authorIdOfActivityMakedBlog
      FROM users
      JOIN blogs ON users.id = blogs.author_id
      JOIN reactions ON blogs.id = reactions.blog_id
      WHERE reactions.author_id = ${userId} AND reactions.createdAt >= DATE_SUB(NOW(), INTERVAL 3 DAY)
      ORDER BY createdAt DESC;

      `)
      return atvs[0];
    } catch (err) {
      throw new HttpException(
        err.message || err,
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async changeUserNameById(newName: string, userId: number) {
    try {
      const { name: oldName } =
        await this.drizzleService.db.query.users.findFirst({
          where: eq(users.id, userId),
          columns: { name: true },
        });
      if (newName === oldName) {
        throw new BadRequestException(
          'newName must not be the same as the old one',
        );
      }
      await this.drizzleService.db
        .update(users)
        .set({ name: newName })
        .where(eq(users.id, userId));

      return { msg: 'successfully changed username' };
    } catch (err) {
      throw new HttpException(
        err.message || err,
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
