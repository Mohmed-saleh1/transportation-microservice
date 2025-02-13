import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Res,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiResponse, ApiHeader } from '@nestjs/swagger';
import { Response } from 'express';
import { SignupDto } from './Dtos/signup.dto';
import { LoginDto } from './Dtos/login.dto';
import { VerifyEmailDto } from './Dtos/verify-email.dto';
import { ResendVerifyEmailDto } from './Dtos/resend-verify-email.dto';
import { ForgotPasswordDto } from './Dtos/forgot-password.dto';
import { VerifyResetCodeDto } from './Dtos/verify-reset-code.dto';
import { ResetPasswordDto } from './Dtos/reset-password.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'User signup' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User successfully registered',
  })
  async signup(@Body() signupDto: SignupDto, @Res() res: Response) {
    const result = await this.authService.signup(signupDto);
    res.setHeader('Authorization', `Bearer ${result.token}`);
    return res.json({ message: result.message });
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User logged in successfully',
  })
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    const result = await this.authService.login(loginDto);
    res.setHeader('Authorization', `Bearer ${result.token}`);
    return res.json({
      message: result.message,
      token: result.token,
      user: result.user,
    });
  }

  @Post('verify-email')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify email with a code' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Email verified successfully',
  })
  async verifyEmail(
    @Body() verifyEmailDto: VerifyEmailDto,
    @Res() res: Response,
  ) {
    const result = await this.authService.verifyEmail(verifyEmailDto.code);
    res.setHeader('Authorization', `Bearer ${result.token}`);
    return res.json({ message: result.message });
  }

  @Post('resend-verify-email')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Resend email verification code' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Verification email resent',
  })
  async resendEmailVerifyCode(
    @Body() resendVerifyEmailDto: ResendVerifyEmailDto,
    @Res() res: Response,
  ) {
    const result = await this.authService.reSendEmailVerifyCode(
      resendVerifyEmailDto.email,
    );
    return res.json({ message: result.message });
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request a password reset email' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Password reset email sent',
  })
  async forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto,
    @Res() res: Response,
  ) {
    await this.authService.forgotPassword(forgotPasswordDto.email);
    return res.json({ message: 'Password reset email sent' });
  }

  @Post('verify-reset-code')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify password reset code' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Reset code verified successfully',
  })
  async verifyPasswordResetCode(
    @Body() verifyResetCodeDto: VerifyResetCodeDto,
    @Res() res: Response,
  ) {
    const result = await this.authService.verifyPasswordResetCode(
      verifyResetCodeDto.code,
    );
    res.setHeader('Authorization', `Bearer ${result.token}`);
    return res.json({ message: result.message });
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset password using a token' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Password reset successfully',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token for password reset',
    example: 'Bearer <token>',
  })
  async resetPassword(
    @Headers('Authorization') authorization: string,
    @Body() resetPasswordDto: ResetPasswordDto,
    @Res() res: Response,
  ) {
    if (!authorization) {
      throw new UnauthorizedException('Authorization token is missing');
    }

    const token = authorization.replace('Bearer ', '');
    const result = await this.authService.resetPassword(
      token,
      resetPasswordDto.password,
    );

    res.setHeader('Authorization', `Bearer ${result.token}`);
    return res.json({ message: result.message, token });
  }
}
