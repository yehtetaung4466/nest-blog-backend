import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, SignupDto } from './dto/auto.dto';
import { DrizzleService } from 'src/drizzle/drizzle.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private drizzleService: DrizzleService,
  ) {}
  @Post('signup')
  async signup(@Body() dto: SignupDto) {
    return await this.authService.signup(dto.email, dto.password, dto.name);
  }

  @Post('login')
  async login(@Body() dto: AuthDto) {
    return this.authService.login(dto.email, dto.password);
  }
}
