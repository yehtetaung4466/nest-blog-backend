import { Global, Module } from '@nestjs/common';
import { DrizzleService } from './drizzle.service';
@Global()
@Module({
  providers: [DrizzleService],
})
export class DrizzleModule {}
