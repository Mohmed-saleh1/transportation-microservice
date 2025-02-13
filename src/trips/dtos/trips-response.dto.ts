import { ApiProperty } from '@nestjs/swagger';
import { TripStatus } from '../types';

export class TripResponseDto {
  @ApiProperty({ example: 1, description: 'Trip ID' })
  id: number;

  @ApiProperty({ example: 1, description: 'Vehicle ID' })
  vehicleId: number;

  @ApiProperty({ example: 'New York', description: 'Trip origin' })
  origin: string;

  @ApiProperty({ example: 'Los Angeles', description: 'Trip destination' })
  destination: string;

  @ApiProperty({
    example: '2024-07-10T08:00:00Z',
    description: 'Departure time',
  })
  departureTime: Date;

  @ApiProperty({ example: '2024-07-10T18:00:00Z', description: 'Arrival time' })
  arrivalTime?: Date;

  @ApiProperty({
    example: 'scheduled',
    enum: TripStatus,
    description: 'Trip status',
  })
  status: TripStatus;
}
