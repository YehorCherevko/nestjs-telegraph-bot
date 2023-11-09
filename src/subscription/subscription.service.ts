import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import { MongoClient } from 'mongodb';

@Injectable()
export class SubscriptionService {
  private readonly client: MongoClient;

  constructor(
    @Inject(forwardRef(() => ConfigService))
    private readonly configService: ConfigService,
  ) {
    this.client = new MongoClient(this.configService.get('MONGO_URI'));
  }

  async connectToDatabase() {
    await this.client.connect();
    return this.client.db('subscription_bot');
  }

  async closeDatabaseConnection() {
    await this.client.close();
  }

  async subscribeUser(userId: number, city: string) {
    const db = await this.connectToDatabase();
    const collection = db.collection('subscriptions');
    await collection.updateOne(
      { userId },
      { $set: { userId, city } },
      { upsert: true },
    );
  }

  public async getAllSubscribers() {
    const db = await this.connectToDatabase();
    const collection = db.collection('subscriptions');
    return collection.find({}).toArray();
  }
}
