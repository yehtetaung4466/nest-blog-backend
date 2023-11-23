import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { desc, eq, sql } from 'drizzle-orm';
import { DrizzleService } from 'src/drizzle/drizzle.service';
import { blogs } from 'src/drizzle/schema';
@Injectable()
export class BlogService {
  constructor(private drizzleService: DrizzleService) {}

  async createBlog(
    title: string,
    content: string,
    author_id: number,
    file?: Express.Multer.File,
  ) {
    try {
      if (file) {
        await this.drizzleService.db.insert(blogs).values({
          title,
          content,
          author_id,
          image: file.originalname,
        });
      } else {
        await this.drizzleService.db.insert(blogs).values({
          title,
          content,
          author_id,
        });
      }
      return { msg: 'Blog created' };
    } catch (err) {
      throw new HttpException(
        err.message || 'error',
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getTenBlogs(paginate: number) {
    try {
      const result = await this.drizzleService.db.query.blogs.findMany({
        offset: 10 * paginate - 10,
        limit: 10,
        with: {
          comments: true,
          reactions: true,
        },
        orderBy: [desc(blogs.createdAt)],
      });
      if (result.length === 0) {
        throw new HttpException('no blog', HttpStatus.NO_CONTENT);
      }
      return result;
    } catch (err) {
      throw new HttpException(
        err.message || err,
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getBlogById(id: number) {
    try {
      const result = await this.drizzleService.db.query.blogs.findFirst({
        where: eq(blogs.id, id),
        with: {
          comments: true,
          reactions: true,
        },
      });
      if (!result) throw new NotFoundException('blog not found');
      return result;
    } catch (err) {
      throw new HttpException(
        err.message || err,
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async getBlogCount() {
    try {
      const result = (
        await this.drizzleService.db
          .select({ count: sql`count(*)` })
          .from(blogs)
      ).at(0);
      return result;
    } catch (err) {
      throw new HttpException(
        err.message || err,
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllBlogsByUserId(userId: number) {
    try {
      const res = await this.drizzleService.db.query.blogs.findMany({
        where: eq(blogs.author_id, userId),
        with: {
          reactions: true,
          comments: true,
        },
      });
      return res;
    } catch (err) {
      throw new HttpException(
        err.message || err,
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
