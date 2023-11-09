import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from 'src/config/config.service';
import { WeatherForecast } from './weather.interfaces';

@Injectable()
export class WeatherService {
  constructor(private readonly configService: ConfigService) {}

  async getWeatherForecast(city: string): Promise<WeatherForecast> {
    const apiKey = this.configService.get('API_KEY');
    const weatherUrl = `http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
    const response = await axios.get<WeatherForecast>(weatherUrl);
    return response.data;
  }
}
