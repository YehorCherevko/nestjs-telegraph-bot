import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SubscriptionService } from 'src/subscription/subscription.service';
import { WeatherService } from 'src/weather/weather.service';
import { TelegrafService } from '../telegraf/telegraf.service';

@Injectable()
export class CronService {
  constructor(
    private readonly subscriptionService: SubscriptionService,
    private readonly weatherService: WeatherService,
    private readonly telegrafService: TelegrafService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_10AM)
  async sendWeatherNotifications() {
    try {
      const subscribers = await this.subscriptionService.getAllSubscribers();

      if (!subscribers.length) {
        console.log('No subscribers found.');
        return;
      }

      for (const subscriber of subscribers) {
        const { userId, city } = subscriber;

        const weatherData = await this.weatherService.getWeatherForecast(city);

        const weatherMessage = this.telegrafService.formatWeather(
          city,
          weatherData,
        );

        await this.telegrafService.sendMessage(userId, weatherMessage);
      }

      console.log('Weather notifications sent.');
    } catch (error) {
      console.error('Error sending weather notifications:', error);
    }
  }
}
