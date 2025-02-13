import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vehicle } from './vehicle.entity';
import { VehicleController } from './vehicle.controller';
import { VehicleService } from './vehicle.service';
import { JwtService } from '@nestjs/jwt';
import { Logger } from 'winston';
import { TrackingModule } from 'src/tracking/tracking.module';

@Module({
  imports: [TypeOrmModule.forFeature([Vehicle, TrackingModule])],
  controllers: [VehicleController],
  providers: [VehicleService, JwtService, Logger],
  exports: [VehicleService],
})
export class VehicleModule {}
