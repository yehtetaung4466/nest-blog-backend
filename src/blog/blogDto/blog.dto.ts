import { IsNotEmpty, IsString } from 'class-validator';

export class blogDto {
  @IsString()
  @IsNotEmpty()
  title: string;
  @IsString()
  @IsNotEmpty()
  content: string;
}
