import { ApiProperty } from '@nestjs/swagger';

export class VerifyEmailDto {
  @ApiProperty({
    example: '123456',
    description: 'Verification code sent to email',
  })
  code: string;
}
