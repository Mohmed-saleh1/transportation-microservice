import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TripService } from './trip.service';
import { CreateTripDto } from './dtos/create-trip.dto';
import { TripResponseDto } from './dtos/trips-response.dto';
import { UpdateTripDto } from './dtos/update-trip.dto';

@ApiTags('Trips')
@Controller('trips')
export class TripController {
  constructor(private readonly tripService: TripService) {}

  @Post()
  @ApiOperation({ summary: 'Schedule a new trip' })
  @ApiResponse({
    status: 201,
    description: 'Trip created successfully',
    type: TripResponseDto,
  })
  async createTrip(@Body() dto: CreateTripDto) {
    return this.tripService.createTrip(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Fetch all trips' })
  @ApiResponse({
    status: 200,
    description: 'List of trips',
    type: [TripResponseDto],
  })
  async getTrips() {
    return this.tripService.getTrips();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get trip details' })
  @ApiResponse({
    status: 200,
    description: 'Trip details',
    type: TripResponseDto,
  })
  async getTrip(@Param('id', ParseIntPipe) id: number) {
    return this.tripService.getTripById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Modify trip details' })
  @ApiResponse({
    status: 200,
    description: 'Trip updated successfully',
    type: TripResponseDto,
  })
  async updateTrip(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTripDto,
  ) {
    return this.tripService.updateTrip(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Cancel a trip' })
  @ApiResponse({ status: 200, description: 'Trip deleted successfully' })
  async deleteTrip(@Param('id', ParseIntPipe) id: number) {
    return this.tripService.deleteTrip(id);
  }
}
