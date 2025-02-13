import { Controller, Get, Param, Body, Post } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';
import { TrackingService } from './tracking.service';
import { Tracking } from './tracking.entity';
import { CreateTrackingDto } from './dtos/create-track.dto';

@ApiTags('Tracking')
@Controller('tracking')
export class TrackingController {
  constructor(private readonly trackingService: TrackingService) {}

  @Post()
  @ApiOperation({ summary: 'Push GPS data (Real-time tracking)' })
  @ApiBody({ type: CreateTrackingDto })
  @ApiResponse({ status: 201, description: 'GPS data stored successfully' })
  async pushLocation(@Body() dto: CreateTrackingDto): Promise<Tracking> {
    return this.trackingService.pushLocation(dto);
  }

  @Get(':vehicleId')
  @ApiOperation({ summary: 'Get latest real-time location of a vehicle' })
  @ApiParam({ name: 'vehicleId', required: true, example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Returns the latest vehicle location',
  })
  async getVehicleLocation(
    @Param('vehicleId') vehicleId: number,
  ): Promise<Tracking> {
    return this.trackingService.getVehicleLocation(vehicleId);
  }
}
