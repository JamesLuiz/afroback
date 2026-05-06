import { Controller, Get, Headers } from '@nestjs/common';
import { CurrentUserService } from '../common/current-user.service';

@Controller('users')
export class UsersController {
  constructor(private readonly currentUserService: CurrentUserService) {}

  @Get('me')
  async me(@Headers('authorization') authorization?: string) {
    const user = await this.currentUserService.fromAuthorization(authorization);
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      createdAt: user.createdAt,
    };
  }
}
