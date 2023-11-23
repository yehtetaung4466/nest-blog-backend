import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { and, eq, sql } from 'drizzle-orm';
import { DrizzleService } from 'src/drizzle/drizzle.service';
import { blog_reactions } from 'src/drizzle/schema';

@Injectable()
export class ReactionService {
  constructor(private readonly drizzleService: DrizzleService) {}
  async deleteReactionByParentBlogId(parentBlogId: number, authorId: number) {
    try {
      const res = await this.drizzleService.db
        .delete(blog_reactions)
        .where(
          and(
            eq(blog_reactions.blog_id, parentBlogId),
            eq(blog_reactions.author_id, authorId),
          ),
        );
      if (res[0].affectedRows === 0) {
        throw new BadRequestException('no reaction is deleted');
      }
      await this.drizzleService.db.execute(
        sql`UPDATE blogs SET blogs.likes = (SELECT COUNT(*) FROM reactions WHERE reactions.blog_id=${parentBlogId} AND reactions.reaction = "like"),blogs.dislikes = (SELECT COUNT(*) FROM reactions WHERE reactions.blog_id=${parentBlogId} AND reactions.reaction = "dislike") WHERE blogs.id =${parentBlogId} `,
      );
      return { msg: 'successfully removed the reaction' };
    } catch (err) {
      throw new HttpException(
        err.message || err,
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async createReactionByParentBlogId(
    parentBlogId: number,
    authorId: number,
    reaction: 'like' | 'dislike',
  ) {
    try {
      await this.drizzleService.db.insert(blog_reactions).values({
        blog_id: parentBlogId,
        author_id: authorId,
        reaction,
        createdAt: new Date(Date.now()),
      });
      await this.drizzleService.db.execute(
        sql`UPDATE blogs SET blogs.likes = (SELECT COUNT(*) FROM reactions WHERE reactions.blog_id=${parentBlogId} AND reactions.reaction = "like"),blogs.dislikes = (SELECT COUNT(*) FROM reactions WHERE reactions.blog_id=${parentBlogId} AND reactions.reaction = "dislike") WHERE blogs.id =${parentBlogId} `,
      );
      return { msg: 'reaction successfully created' };
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        await this.drizzleService.db
          .update(blog_reactions)
          .set({ reaction, createdAt: new Date(Date.now()) })
          .where(
            and(
              eq(blog_reactions.blog_id, parentBlogId),
              eq(blog_reactions.author_id, authorId),
            ),
          )
          .catch((err) => {
            throw new HttpException(
              err.message || err,
              err.status || HttpStatus.INTERNAL_SERVER_ERROR,
            );
          });
        await this.drizzleService.db.execute(
          sql`UPDATE blogs SET blogs.likes = (SELECT COUNT(*) FROM reactions WHERE reactions.blog_id=${parentBlogId} AND reactions.reaction = "like"),blogs.dislikes = (SELECT COUNT(*) FROM reactions WHERE reactions.blog_id=${parentBlogId} AND reactions.reaction = "dislike") WHERE blogs.id =${parentBlogId} `,
        );
        return {
          msg: 'did not create a new reaction but changed the exiting one',
        };
      }
      throw new HttpException(
        err.message || err,
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
