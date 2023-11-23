import { Module } from '@nestjs/common';
import { ReactionService } from './reaction.service';
import { ReactionController } from './reaction.controller';
import { DrizzleService } from 'src/drizzle/drizzle.service';

@Module({
  controllers: [ReactionController],
  providers: [ReactionService, DrizzleService],
})
export class ReactionModule {}
