import { ApiProperty } from '@nestjs/swagger';

export class ResendVerifyEmailDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email to resend the verification code',
  })
  email: string;
}
