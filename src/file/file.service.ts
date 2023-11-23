import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DrizzleService } from 'src/drizzle/drizzle.service';
import { blogs, users } from 'src/drizzle/schema';

@Injectable()
export class FileService {
  constructor(private drizzle: DrizzleService) {}
  async setProfile(id: number, extension: string) {
    try {
      await this.drizzle.db
        .update(users)
        .set({
          profile: `user_profile_${id}.${extension}`,
        })
        .where(eq(users.id, id));
      return { msg: 'profile uploaded' };
    } catch (err) {
      throw new HttpException(
        err.message || err,
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async getBlogImage(id: number) {
    try {
      const { image } = await this.drizzle.db.query.blogs.findFirst({
        columns: {
          image: true,
        },
        where: eq(blogs.id, id),
      });
      return image;
    } catch (err) {
      throw new HttpException(
        err.message || err,
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async getProfile(id: number) {
    try {
      const { profile } = await this.drizzle.db.query.users.findFirst({
        where: eq(users.id, id),
        columns: {
          profile: true,
        },
      });
      if (!profile) throw new NotFoundException('profile not found');
      return profile;
    } catch (err) {
      throw new HttpException(
        err.message || err,
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
