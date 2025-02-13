import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEmail, IsOptional, MinLength } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({
    description: 'The name of the user',
    example: 'John Doe',
    required: false,
  })
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'The email address of the user',
    example: 'johndoe@example.com',
    required: false,
  })
  @IsOptional()
  @IsEmail({}, { message: 'Invalid email address' })
  email?: string;

  @ApiProperty({
    description: 'The phone number of the user',
    example: '+1 (123) 456-7890',
    required: false,
  })
  @IsOptional()
  phone?: string;

  @ApiProperty({
    description: 'The address of the user',
    example: '123 Main St, Anytown, USA',
    required: false,
  })
  @IsOptional()
  location?: string;

  @ApiProperty({
    description:
      'The password for the user account. Must be at least 6 characters long.',
    example: 'newpassword123',
    required: false,
  })
  @IsOptional()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password?: string;
}
