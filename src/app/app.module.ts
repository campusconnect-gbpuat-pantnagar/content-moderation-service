import { Module } from '@nestjs/common';
import { HealthCheckController } from './healthcheck/healthcheck.contoller';
import { WorkerModule } from './worker/worker.module';
import { ConfigModule } from '@nestjs/config';
import { DalService } from 'src/libraries/dal/dal.service';

const dalService = {
  provide: DalService,
  useFactory: async () => {
    const service = new DalService();
    await service.connect(process.env.MONGO_URI);
    return service;
  },
};

const PROVIDERS = [dalService];
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    WorkerModule,
  ],
  controllers: [HealthCheckController],
  providers: [...PROVIDERS],
})
export class AppModule {}
