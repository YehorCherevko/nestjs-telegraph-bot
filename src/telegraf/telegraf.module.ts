import { Module } from '@nestjs/common';
import { TelegrafService } from './telegraf.service';
import { WeatherModule } from '../weather/weather.module';
import { SubscriptionModule } from 'src/subscription/subscription.module';
import { ConfigModule } from '../config/config.module';

@Module({
  imports: [ConfigModule, WeatherModule, SubscriptionModule],
  providers: [TelegrafService],
})
export class TelegrafModule {}
