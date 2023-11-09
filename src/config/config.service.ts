import * as dotenv from 'dotenv';
dotenv.config();

export class ConfigService {
  get(key: string): string {
    return process.env[key];
  }
}
