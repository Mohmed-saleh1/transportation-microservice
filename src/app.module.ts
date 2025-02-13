import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './common/core/database/database.module';
import { AuthModule } from './auth/auth.module';
import { VehicleModule } from './vehicle/vehicle.module';

@Module({
  imports: [DatabaseModule, AuthModule, VehicleModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
