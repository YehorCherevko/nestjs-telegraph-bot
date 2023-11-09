export interface WeatherMainData {
  temp: number;
  humidity: number;
}

export interface WeatherDescription {
  description: string;
}

export interface WindData {
  speed: number;
}

export interface CloudData {
  all: number;
}

export interface WeatherForecastItem {
  dt: number;
  main: WeatherMainData;
  weather: WeatherDescription[];
  wind: WindData;
  clouds: CloudData;
}

export interface WeatherForecast {
  list: WeatherForecastItem[];
}
