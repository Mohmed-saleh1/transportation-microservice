import { ApiProperty } from '@nestjs/swagger';

export class VerifyResetCodeDto {
  @ApiProperty({
    example: '654321',
    description: 'Password reset verification code',
  })
  code: string;
}
