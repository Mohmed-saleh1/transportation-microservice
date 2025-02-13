import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty } from 'class-validator';

export class CreateTrackingDto {
  @ApiProperty({ example: 1, description: 'ID of the vehicle being tracked' })
  @IsNumber()
  @IsNotEmpty()
  vehicleId: number;

  @ApiProperty({ example: 40.712776, description: 'Latitude of the vehicle' })
  @IsNumber()
  @IsNotEmpty()
  latitude: number;

  @ApiProperty({ example: -74.005974, description: 'Longitude of the vehicle' })
  @IsNumber()
  @IsNotEmpty()
  longitude: number;
}
