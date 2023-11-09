import { Module } from '@nestjs/common';
import { ConfigModule } from '../config/config.module';
import { WeatherService } from './weather.service';
import { ConfigService } from '../config/config.service'; // Adjust the import path

@Module({
  imports: [ConfigModule],
  providers: [WeatherService, ConfigService], // Add ConfigService to providers
  exports: [WeatherService],
})
export class WeatherModule {}
