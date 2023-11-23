import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
export class CommentDto {
  @IsNumber()
  @IsNotEmpty()
  blogId: number;
  @IsNotEmpty()
  @IsString()
  context: string;
}

export class CommentEditDto {
  @IsNotEmpty()
  @IsString()
  context: string;
}
