import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsDate, IsInt } from 'class-validator';

export class CreateTripDto {
  @ApiProperty({ example: 1, description: 'ID of the vehicle' })
  @IsInt()
  @IsNotEmpty()
  vehicleId: number;

  @ApiProperty({ example: 'New York', description: 'Trip origin' })
  @IsString()
  @IsNotEmpty()
  origin: string;

  @ApiProperty({ example: 'Los Angeles', description: 'Trip destination' })
  @IsString()
  @IsNotEmpty()
  destination: string;

  @ApiProperty({
    example: '2024-07-10T08:00:00Z',
    description: 'Departure time (ISO format)',
  })
  @IsDate()
  @IsNotEmpty()
  departureTime: Date;
}
