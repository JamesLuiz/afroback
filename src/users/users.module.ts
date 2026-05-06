import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { DatabaseModule } from '../database/database.module';
import { CurrentUserService } from '../common/current-user.service';

@Module({
  imports: [DatabaseModule],
  controllers: [UsersController],
  providers: [CurrentUserService],
})
export class UsersModule {}
