import {
  Body,
  Controller,
  Delete,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ReactionService } from './reaction.service';
import { ReactionDto, ReactionDtoX } from './dto';
import { UserGuard } from 'src/guards/user.guard';
import { Request } from 'express';
import { JWT_PAYLOAD } from 'src/utils/types';

@Controller('reactions')
export class ReactionController {
  constructor(private readonly reactionService: ReactionService) {}
  @UseGuards(UserGuard)
  @Post()
  async createReaction(@Body() dto: ReactionDtoX, @Req() req: Request) {
    const user = req.user as JWT_PAYLOAD;
    return await this.reactionService.createReactionByParentBlogId(
      dto.blogId,
      user.id,
      dto.reaction,
    );
  }

  @UseGuards(UserGuard)
  @Delete()
  async removeReaction(@Body() dto: ReactionDto, @Req() req: Request) {
    const user = req.user as JWT_PAYLOAD;
    return await this.reactionService.deleteReactionByParentBlogId(
      dto.blogId,
      user.id,
    );
  }
}
