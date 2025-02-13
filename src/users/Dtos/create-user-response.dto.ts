import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserResponseDto {
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

  @ApiProperty({
    description: 'The email verification code sent to the user',
    example: 'abc123',
    required: false,
  })
  emailVerifyCode?: string;

  @ApiProperty({
    description: 'The expiration time of the email verification code',
    example: '2024-12-31T23:59:59Z',
    required: false,
  })
  emailVerifyExpires?: Date;

  @ApiProperty({
    description: 'The status of email verification for the user',
    example: true,
  })
  isEmailVerified: boolean;

  @ApiProperty({
    description: 'The password reset code sent to the user',
    example: 'resetcode123',
    required: false,
  })
  passwordResetCode?: string;

  @ApiProperty({
    description: 'The expiration time of the password reset code',
    example: '2024-12-31T23:59:59Z',
    required: false,
  })
  passwordResetExpires?: Date;

  @ApiProperty({
    description: 'The status of password reset verification for the user',
    example: true,
  })
  passwordResetVerified: boolean;
}
