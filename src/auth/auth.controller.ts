import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

type AuthPayload = {
  email?: string;
  password?: string;
  fullName?: string;
};

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() body: AuthPayload) {
    return this.authService.register(
      body.email?.trim() ?? '',
      body.password ?? '',
      body.fullName?.trim() ?? '',
    );
  }

  @Post('login')
  async login(@Body() body: AuthPayload) {
    return this.authService.login(body.email?.trim() ?? '', body.password ?? '');
  }
}
