import { Injectable, UnauthorizedException } from '@nestjs/common';
import { hash, compare } from 'bcryptjs';
import { randomUUID } from 'crypto';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class AuthService {
  constructor(private readonly database: DatabaseService) {}

  async register(email: string, password: string, fullName: string) {
    const normalizedEmail = email.trim().toLowerCase();
    const existing = await this.database.users.findOne({ email: normalizedEmail });
    if (existing) {
      throw new UnauthorizedException('Email already in use');
    }

    const user = {
      id: randomUUID(),
      email: normalizedEmail,
      password: await hash(password, 12),
      fullName,
      createdAt: new Date().toISOString(),
    };
    await this.database.users.insertOne(user);

    const token = randomUUID();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString();
    await this.database.sessions.insertOne({
      token,
      userId: user.id,
      createdAt: new Date().toISOString(),
      expiresAt,
    });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
      },
    };
  }

  async login(email: string, password: string) {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await this.database.users.findOne({ email: normalizedEmail });
    if (!user || !(await compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = randomUUID();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString();
    await this.database.sessions.insertOne({
      token,
      userId: user.id,
      createdAt: new Date().toISOString(),
      expiresAt,
    });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
      },
    };
  }
}
