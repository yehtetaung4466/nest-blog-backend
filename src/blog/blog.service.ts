import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { desc, eq, sql } from 'drizzle-orm';
import { DrizzleService } from 'src/drizzle/drizzle.service';
import { blog_reactions, blogs, comments } from 'src/drizzle/schema';

@Injectable()
export class BlogService {
  constructor(private drizzleService: DrizzleService) {}

  async createBlog(title: string, content: string, author_id: number) {
    try {
      await this.drizzleService.db.insert(blogs).values({
        title,
        content,
        author_id,
      });
      return { msg: 'Blog created' };
    } catch (err) {
      throw new HttpException(
        err.message || 'error',
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getTenBlogs(paginate: number) {
    const result = await this.drizzleService.db.query.blogs.findMany({
      offset: 10 * paginate - 10,
      limit: 10,
      with: {
        comments: true,
        reactions: true,
      },
      orderBy: [desc(blogs.createdAt)],
    });
    // const result = await this.drizzleService.db
    //   .select({
    //     id: blogs.id,
    //     createdAt: blogs.createdAt,
    //     title: blogs.title,
    //     content: blogs.content,
    //     image: blogs.image,
    //     author_id: blogs.author_id,
    //     likes: blogs.likes,
    //     dislikes: blogs.dislikes,
    //     comment_count: blogs.comment_count,
    //     reaction: blog_reactions,
    //   })
    //   .from(blogs)
    //   .innerJoin(comments, eq(blogs.id, comments.blog_id))
    //   .innerJoin(blog_reactions, eq(blogs.id, blog_reactions.blog_id))
    //   .offset(10 * paginate - 10)
    //   .limit(10);
    if (result.length === 0) {
      throw new HttpException('no blog', HttpStatus.NO_CONTENT);
    }
    return result;
  }
  async getBlogCount() {
    const result = (
      await this.drizzleService.db.select({ count: sql`count(*)` }).from(blogs)
    ).at(0);
    return result;
  }
}
