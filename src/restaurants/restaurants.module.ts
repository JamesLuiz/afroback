import { Module } from '@nestjs/common';
import { RestaurantsController } from './restaurants.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [RestaurantsController],
})
export class RestaurantsModule {}
