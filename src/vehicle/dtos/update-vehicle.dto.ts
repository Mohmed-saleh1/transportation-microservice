import { ApiPropertyOptional } from '@nestjs/swagger';
import { VehicleStatus } from '../vehicle.types';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateVehicleDto {
  @ApiPropertyOptional({
    example: VehicleStatus.IN_TRANSIT,
    enum: VehicleStatus,
  })
  @IsOptional()
  @IsEnum(VehicleStatus)
  status?: VehicleStatus;

  @ApiPropertyOptional({ example: 'Uptown, City' })
  @IsOptional()
  @IsString()
  currentLocation?: string;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  active?: boolean;

  @ApiPropertyOptional({ example: 5 })
  @IsOptional()
  @IsInt()
  driverId?: number;
}
