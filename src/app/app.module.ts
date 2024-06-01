import { Module } from '@nestjs/common';
import { HealthCheckController } from './healthcheck/healthcheck.contoller';
import { WorkerModule } from './worker/worker.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    WorkerModule,
  ],
  controllers: [HealthCheckController],
  providers: [],
})
export class AppModule {}
