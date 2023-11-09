/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Telegraf, Context } from 'telegraf';
import { WeatherService } from '../weather/weather.service';
import { SubscriptionService } from '../subscription/subscription.service';
import { WeatherForecast } from '../weather/weather.interfaces';
import { ConfigService } from 'src/config/config.service';

@Injectable()
export class TelegrafService implements OnModuleInit {
  private bot: Telegraf<Context>;

  constructor(
    private readonly weatherService: WeatherService,
    private readonly subscriptionService: SubscriptionService,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    const bot = new Telegraf(this.configService.get('BOT_TOKEN'));

    // Handle /start command
    bot.start((ctx) => this.handleStart(ctx));

    // Handle /subscribe command
    bot.command('subscribe', (ctx) => this.handleSubscription(ctx));

    // Handle text messages
    bot.on('text', (ctx) => this.handleText(ctx));

    // Launch the bot
    await bot.launch();
  }

  private async handleStart(ctx) {
    const userId = ctx.message.from.id;
    ctx.reply(
      `Provide location to see the forecast or type: /subscribe city to subscribe for our everyday forecast at 8.30 UTC! eg. /subscribe London`,
    );
  }

  private async handleSubscription(ctx) {
    const userId = ctx.message.from.id;
    const city = ctx.message.text.split(' ').slice(1).join(' ');

    if (city) {
      await this.subscriptionService.subscribeUser(userId, city);
      ctx.reply(`You are subscribed to weather updates for ${city}!`);
    } else {
      ctx.reply('To subscribe, use the format: /subscribe city');
    }
  }
  async sendMessage(userId: number, message: string): Promise<void> {
    await this.bot.telegram.sendMessage(userId, message, {
      parse_mode: 'HTML',
    });
  }

  private async handleText(ctx) {
    const userId = ctx.message.from.id;
    const city = ctx.message.text;

    try {
      const weatherData = await this.weatherService.getWeatherForecast(city);
      const weatherMessage = this.formatWeather(city, weatherData);

      ctx.replyWithHTML(weatherMessage);
    } catch (error) {
      console.error('Error fetching weather data', error);
      ctx.reply(`The forecast for ${city} is not found`);
    }
  }

  public formatWeather(city: string, weatherData: WeatherForecast): string {
    let message = `Here's the 1-day / 3-hour weather forecast for <b>${city}</b>:\n\n`;
    const numberOfForecasts = 8; // 8 forecasts every day

    for (let i = 0; i < numberOfForecasts; i++) {
      const forecast = weatherData.list[i];
      const timestamp = new Date(forecast.dt * 1000);
      const temperature = forecast.main.temp;
      const description = forecast.weather[0].description;
      const humidity = forecast.main.humidity;
      const windSpeed = forecast.wind.speed;
      const cloudiness = forecast.clouds.all;

      message +=
        `<i>${timestamp.toLocaleString()}</i>\n` +
        `🌡️ Temperature: <b>${temperature}°C</b>\n` +
        `☁️ Description: <b>${description}</b>\n` +
        `💧 Humidity: <b>${humidity}%</b>\n` +
        `🌬️ Wind Speed: <b>${windSpeed} m/s</b>\n` +
        `☁️ Cloudiness: <b>${cloudiness}%</b>\n\n`;
    }

    return message;
  }
}
