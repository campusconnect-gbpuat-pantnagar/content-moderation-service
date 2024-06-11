import { Module } from '@nestjs/common';
import { HealthCheckController } from './healthcheck/healthcheck.contoller';
import { WorkerModule } from './worker/worker.module';
import { ConfigModule } from '@nestjs/config';
import { PostModule } from './post/post.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    WorkerModule,
    PostModule,
    UserModule,
  ],
  controllers: [HealthCheckController],
  providers: [],
})
export class AppModule {}
