import { Body, Controller, Get, Headers, Param, Post } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CurrentUserService } from '../common/current-user.service';
import { DatabaseService } from '../database/database.service';

type CheckoutPayload = {
  restaurantId?: string;
  items?: { productId: string; quantity: number }[];
  deliveryAddress?: string;
  notes?: string;
};

@Controller('orders')
export class OrdersController {
  constructor(
    private readonly currentUserService: CurrentUserService,
    private readonly database: DatabaseService,
  ) {}

  @Post()
  async create(
    @Headers('authorization') authorization: string | undefined,
    @Body() body: CheckoutPayload,
  ) {
    const user = await this.currentUserService.fromAuthorization(authorization);
    const cartItems = body.items ?? [];
    const restaurant = await this.database.restaurants.findOne({ id: body.restaurantId });

    if (!restaurant || cartItems.length === 0) {
      return { message: 'Invalid checkout payload' };
    }

    const productIds = cartItems.map((item) => item.productId);
    const menuProducts = await this.database.products.find({ id: { $in: productIds } }).toArray();
    const priceMap = new Map(menuProducts.map((product) => [product.id, product.price]));
    const subtotal = cartItems.reduce(
      (sum, item) => sum + (priceMap.get(item.productId) ?? 0) * item.quantity,
      0,
    );

    const newOrder = {
      id: randomUUID(),
      userId: user.id,
      restaurantId: restaurant.id,
      items: cartItems,
      deliveryAddress: body.deliveryAddress ?? 'Unknown address',
      notes: body.notes,
      subtotal: Number(subtotal.toFixed(2)),
      deliveryFee: restaurant.deliveryFee,
      total: Number((subtotal + restaurant.deliveryFee).toFixed(2)),
      status: 'Pending' as const,
      createdAt: new Date().toISOString(),
    };

    await this.database.orders.insertOne(newOrder);
    return newOrder;
  }

  @Get('me')
  async listMine(@Headers('authorization') authorization: string | undefined) {
    const user = await this.currentUserService.fromAuthorization(authorization);
    return this.database.orders.find({ userId: user.id }).sort({ createdAt: -1 }).toArray();
  }

  @Get(':id/track')
  async track(@Headers('authorization') authorization: string | undefined, @Param('id') id: string) {
    const user = await this.currentUserService.fromAuthorization(authorization);
    const order = await this.database.orders.findOne({ id, userId: user.id });
    if (!order) {
      return null;
    }
    return {
      orderId: order.id,
      status: order.status,
      eta: '20-25 mins',
      timeline: ['Order Received', 'Preparing', 'Out for Delivery', 'Arrived'],
    };
  }
}
