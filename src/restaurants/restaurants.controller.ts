import { Controller, Get, Param, Query } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly database: DatabaseService) {}

  @Get()
  async list(@Query('q') q?: string) {
    if (!q?.trim()) {
      return this.database.restaurants.find().toArray();
    }
    const query = q.toLowerCase();
    return this.database.restaurants
      .find({
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { cuisines: { $elemMatch: { $regex: query, $options: 'i' } } },
        ],
      })
      .toArray();
  }

  @Get(':id')
  async detail(@Param('id') id: string) {
    const restaurant = await this.database.restaurants.findOne({ id });
    if (!restaurant) {
      return null;
    }
    const menu = await this.database.products.find({ restaurantId: id }).toArray();
    return { ...restaurant, menu };
  }

  @Get(':id/menu')
  async menu(@Param('id') id: string) {
    return this.database.products.find({ restaurantId: id }).toArray();
  }
}
