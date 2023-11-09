import { Module } from '@nestjs/common';
import { CronService } from './cron.service';
import { SubscriptionModule } from '../subscription/subscription.module';
import { WeatherModule } from '../weather/weather.module';
import { TelegrafModule } from '../telegraf/telegraf.module';
import { TelegrafService } from 'src/telegraf/telegraf.service';
import { ConfigModule } from '../config/config.module';
@Module({
  imports: [SubscriptionModule, WeatherModule, TelegrafModule, ConfigModule],
  providers: [CronService, TelegrafService],
})
export class CronModule {}
