import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Collection, Db, MongoClient } from 'mongodb';
import { productsSeed, restaurantsSeed } from './seed-data';

export type DbUser = {
  id: string;
  email: string;
  password: string;
  fullName: string;
  createdAt: string;
};

export type DbSession = {
  token: string;
  userId: string;
  createdAt: string;
  expiresAt: string;
};

export type DbRestaurant = (typeof restaurantsSeed)[number];
export type DbProduct = (typeof productsSeed)[number];

export type DbOrder = {
  id: string;
  userId: string;
  restaurantId: string;
  items: { productId: string; quantity: number }[];
  deliveryAddress: string;
  notes?: string;
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: 'Pending' | 'Preparing' | 'Out for Delivery';
  createdAt: string;
};

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private readonly client = new MongoClient(
    process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017',
  );
  private db!: Db;

  users!: Collection<DbUser>;
  sessions!: Collection<DbSession>;
  restaurants!: Collection<DbRestaurant>;
  products!: Collection<DbProduct>;
  orders!: Collection<DbOrder>;

  async onModuleInit() {
    await this.client.connect();
    this.db = this.client.db(process.env.MONGODB_DB_NAME ?? 'afrobite');
    this.users = this.db.collection<DbUser>('users');
    this.sessions = this.db.collection<DbSession>('sessions');
    this.restaurants = this.db.collection<DbRestaurant>('restaurants');
    this.products = this.db.collection<DbProduct>('products');
    this.orders = this.db.collection<DbOrder>('orders');

    await this.users.createIndex({ email: 1 }, { unique: true });
    await this.sessions.createIndex({ token: 1 }, { unique: true });
    await this.sessions.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
    await this.orders.createIndex({ userId: 1, createdAt: -1 });

    const restaurantsCount = await this.restaurants.countDocuments();
    if (restaurantsCount === 0) {
      await this.restaurants.insertMany(restaurantsSeed);
    }

    const productsCount = await this.products.countDocuments();
    if (productsCount === 0) {
      await this.products.insertMany(productsSeed);
    }
  }

  async onModuleDestroy() {
    await this.client.close();
  }
}
