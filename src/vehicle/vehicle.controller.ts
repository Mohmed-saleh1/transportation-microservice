import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { VehicleService } from './vehicle.service';
import { CreateVehicleDto } from './dtos/create-vehicle.dto';
import { Vehicle } from './vehicle.entity';
import { UpdateVehicleDto } from './dtos/update-vehicle.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { AdminGuard } from 'src/common/guards/admin.guard';

@ApiTags('Vehicles')
@Controller('vehicles')
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @Post()
  @ApiOperation({ summary: 'Add a new vehicle (Admin only)' })
  @ApiResponse({
    status: 201,
    description: 'Vehicle created successfully',
    type: Vehicle,
  })
  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async createVehicle(
    @Body() createVehicleDto: CreateVehicleDto,
  ): Promise<Vehicle> {
    return this.vehicleService.createVehicle(createVehicleDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all vehicles' })
  @ApiResponse({
    status: 200,
    description: 'Returns all vehicles',
    type: [Vehicle],
  })
  async getAllVehicles(): Promise<Vehicle[]> {
    return this.vehicleService.getAllVehicles();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get vehicle details by ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns vehicle details',
    type: Vehicle,
  })
  @ApiResponse({ status: 404, description: 'Vehicle not found' })
  async getVehicleById(@Param('id') id: number): Promise<Vehicle> {
    return this.vehicleService.getVehicleById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update vehicle status or details' })
  @ApiResponse({
    status: 200,
    description: 'Vehicle updated successfully',
    type: Vehicle,
  })
  @ApiResponse({ status: 404, description: 'Vehicle not found' })
  async updateVehicle(
    @Param('id') id: number,
    @Body() updateVehicleDto: UpdateVehicleDto,
  ): Promise<Vehicle> {
    return this.vehicleService.updateVehicle(id, updateVehicleDto);
  }

  @Delete(':id')
  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiOperation({ summary: 'Remove a vehicle (Admin only)' })
  @ApiResponse({ status: 204, description: 'Vehicle removed successfully' })
  @ApiResponse({ status: 404, description: 'Vehicle not found' })
  async deleteVehicle(@Param('id') id: number): Promise<void> {
    return this.vehicleService.deleteVehicle(id);
  }
}
