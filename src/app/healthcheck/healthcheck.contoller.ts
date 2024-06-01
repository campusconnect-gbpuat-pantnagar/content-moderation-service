import { Controller, Get } from '@nestjs/common';

@Controller('healthcheck')
export class HealthCheckController {
  constructor() {}

  @Get()
  healthcheck() {
    return ' CONTENT MODERATION SERVICE WORKER IS HEALTHY ✅ 🚀.';
  }
}
