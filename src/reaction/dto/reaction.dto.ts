import { IsIn, IsNotEmpty, IsNumber } from 'class-validator';

export class ReactionDto {
  @IsNotEmpty()
  @IsNumber()
  blogId: number;
}

export class ReactionDtoX extends ReactionDto {
  @IsNotEmpty()
  @IsIn(['like', 'dislike'], {
    message: 'Reaction must be "like" or "dislike"',
  })
  reaction: 'like' | 'dislike';
}
