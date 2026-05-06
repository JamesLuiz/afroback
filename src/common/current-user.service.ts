import { Injectable, UnauthorizedException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class CurrentUserService {
  constructor(private readonly database: DatabaseService) {}

  async fromAuthorization(authorization?: string) {
    if (!authorization?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing bearer token');
    }

    const token = authorization.replace('Bearer ', '').trim();
    const session = await this.database.sessions.findOne({ token });
    if (!session) {
      throw new UnauthorizedException('Invalid token');
    }

    const user = await this.database.users.findOne({ id: session.userId });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }
}
