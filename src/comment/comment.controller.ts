import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentDto, CommentEditDto } from './dto';
import { UserGuard } from 'src/guards/user.guard';
import { Request } from 'express';
import { JWT_PAYLOAD } from 'src/utils/types';

@Controller('comments')
export class CommentController {
  constructor(private commentService: CommentService) {}
  @Post()
  @UseGuards(UserGuard)
  async createComment(@Body() dto: CommentDto, @Req() req: Request) {
    const user = req.user as JWT_PAYLOAD;
    return await this.commentService.createComment(
      user.id,
      dto.blogId,
      dto.context,
    );
  }

  @Patch('/:commentId')
  @UseGuards(UserGuard)
  async editComment(
    @Body() dto: CommentEditDto,
    @Req() req: Request,
    @Param('commentId', ParseIntPipe) commentId: number,
  ) {
    const user = req.user as JWT_PAYLOAD;
    return this.commentService.editCommentById(commentId, dto.context, user.id);
  }

  @Delete('/:commentId')
  @UseGuards(UserGuard)
  async deleteComment(
    @Req() req: Request,
    @Param('commentId', ParseIntPipe) commentId: number,
  ) {
    const user = req.user as JWT_PAYLOAD;
    return this.commentService.deleteCommentById(commentId, user.id);
  }

  @Get('/:blogId')
  async getCommentsForCurrentBlog(
    @Param('blogId', ParseIntPipe) blogId: number,
  ) {
    return await this.commentService.getCommentByParentBlogId(blogId);
  }
}
