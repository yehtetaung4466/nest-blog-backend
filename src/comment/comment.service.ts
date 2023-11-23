import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { and, desc, eq, sql } from 'drizzle-orm';
import { DrizzleService } from 'src/drizzle/drizzle.service';
import { comments } from 'src/drizzle/schema';

@Injectable()
export class CommentService {
  constructor(
    private drizzleService: DrizzleService,
    private configService: ConfigService,
  ) {}
  async createComment(authorId: number, blogId: number, context: string) {
    try {
      await this.drizzleService.db
        .insert(comments)
        .values({ author_id: authorId, blog_id: blogId, context });
      await this.drizzleService.db.execute(
        sql`UPDATE blogs SET blogs.comment_count = (SELECT COUNT(*) FROM comments WHERE comments.blog_id = ${blogId}) WHERE blogs.id = ${blogId} ;`,
      );
      return { msg: 'comment created' };
    } catch (err) {
      throw new HttpException(
        err.message || err,
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async editCommentById(id: number, context: string, authorId: number) {
    try {
      const res = await this.drizzleService.db
        .update(comments)
        .set({ context })
        .where(and(eq(comments.id, id), eq(comments.author_id, authorId)));
      if (res[0].affectedRows === 0) {
        throw new BadRequestException('no comment is edited');
      }
      return { msg: 'comment is successfully edited' };
    } catch (err) {
      throw new HttpException(
        err.message || err,
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getCommentByParentBlogId(blogId: number) {
    try {
      const result = await this.drizzleService.db.query.comments.findMany({
        where: eq(comments.blog_id, blogId),
        orderBy: desc(comments.createdAt),
      });
      return result;
    } catch (err) {
      throw new HttpException(
        err.message || err,
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteCommentById(id: number, authorId: number) {
    try {
      const { blog_id } = await this.drizzleService.db.query.comments.findFirst(
        {
          columns: { blog_id: true },
          where: eq(comments.id, id),
        },
      );
      const res = await this.drizzleService.db
        .delete(comments)
        .where(and(eq(comments.id, id), eq(comments.author_id, authorId)));
      if (res[0].affectedRows === 0) {
        throw new BadRequestException('no comment is deleted');
      }

      await this.drizzleService.db.execute(
        sql`UPDATE blogs SET blogs.comment_count = blogs.comment_count - 1 WHERE blogs.id = ${blog_id} ;`,
      );
      return { msg: 'comment is successfully deleted' };
    } catch (err) {
      throw new HttpException(
        err.message || err,
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
