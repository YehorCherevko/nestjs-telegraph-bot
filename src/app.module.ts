import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { CronModule } from './cron/cron.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { WeatherModule } from './weather/weather.module';
import { TelegrafModule } from './telegraf/telegraf.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    CronModule,
    SubscriptionModule,
    WeatherModule,
    TelegrafModule,
  ],
})
export class AppModule {}
