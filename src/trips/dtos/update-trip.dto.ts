import { ApiProperty } from '@nestjs/swagger';
import { TripStatus } from '../types';
import { IsDate, IsEnum, IsOptional } from 'class-validator';

export class UpdateTripDto {
  @ApiProperty({
    example: 'completed',
    enum: TripStatus,
    description: 'Trip status',
  })
  @IsEnum(TripStatus)
  @IsOptional()
  status?: TripStatus;

  @ApiProperty({
    example: '2024-07-10T18:00:00Z',
    description: 'Arrival time (ISO format)',
  })
  @IsDate()
  @IsOptional()
  arrivalTime?: Date;
}
