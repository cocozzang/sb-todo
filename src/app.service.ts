import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) {}
  getAppProfile(): string {
    const profile = this.configService.get('PROFILE') ?? 'dev';
    return profile;
  }
}
