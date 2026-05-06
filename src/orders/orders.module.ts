import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { DatabaseModule } from '../database/database.module';
import { CurrentUserService } from '../common/current-user.service';

@Module({
  imports: [DatabaseModule],
  controllers: [OrdersController],
  providers: [CurrentUserService],
})
export class OrdersModule {}
