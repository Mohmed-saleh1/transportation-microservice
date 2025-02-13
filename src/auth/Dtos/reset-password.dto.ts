import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty({
    example: 'NewSecurePassword123',
    description: 'New password for the account',
  })
  password: string;
}
