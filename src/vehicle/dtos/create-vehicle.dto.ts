import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { VehicleType, VehicleStatus } from '../vehicle.types';

export class CreateVehicleDto {
  @ApiProperty({ example: 'Toyota Hiace' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Toyota' })
  @IsString()
  @IsNotEmpty()
  brand: string;

  @ApiProperty({ example: VehicleType.BUS, enum: VehicleType })
  @IsEnum(VehicleType)
  type: VehicleType;

  @ApiProperty({ example: 'ABC-1234' })
  @IsString()
  @IsNotEmpty()
  licensePlate: string;

  @ApiProperty({ example: 15 })
  @IsInt()
  @Min(1)
  capacity: number;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsInt()
  active?: boolean;

  @ApiPropertyOptional({ example: 'Downtown, City' })
  @IsOptional()
  @IsString()
  currentLocation?: string;

  @ApiPropertyOptional({
    example: VehicleStatus.AVAILABLE,
    enum: VehicleStatus,
  })
  @IsOptional()
  @IsEnum(VehicleStatus)
  status?: VehicleStatus;

  @ApiPropertyOptional({ example: 3 })
  @IsOptional()
  @IsInt()
  driverId?: number;

  @ApiPropertyOptional({ example: 'https://example.com/image.jpg' })
  @IsOptional()
  @IsString()
  imageUrl?: string;
}
