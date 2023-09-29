import { Injectable } from '@nestjs/common';
import { createConnection } from 'mysql2';
import { drizzle } from 'drizzle-orm/mysql2';
import * as schema from './schema';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DrizzleService {
  constructor(private configService: ConfigService) {}
  private readonly connection = createConnection({
    host: this.configService.get('DB_HOST'),
    user: this.configService.get('DB_USER'),
    password: this.configService.get('DB_PASSWORD'),
    port: this.configService.get('DB_PORT'),
    database: this.configService.get('DB_NAME'),
  });
  public db = drizzle(this.connection, { schema, mode: 'default' });
}
