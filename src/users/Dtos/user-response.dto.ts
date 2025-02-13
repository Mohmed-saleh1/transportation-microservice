import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class UserResponseDto {
  @ApiProperty({
    description: 'The unique identifier of the user',
    example: 1,
  })
  id: number;
  @ApiProperty({
    description: 'The name of the user',
    example: 'John Doe',
  })
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @ApiProperty({
    description: 'The email address of the user',
    example: 'johndoe@example.com',
  })
  @IsEmail({}, { message: 'Invalid email address' })
  email: string;

  @ApiProperty({
    description: 'The phone number of the user',
    example: '+1 (123) 456-7890',
  })
  phone: string;

  @ApiProperty({
    description: 'The address of the user',
    example: '123 Main St, Anytown, USA',
  })
  location: string;

  @ApiProperty({
    description: 'The number of services offered by the user',
    example: 3,
  })
  noOfServices: number;

  isEmailVerified: boolean;
  emailVerifyCode: string;
}
