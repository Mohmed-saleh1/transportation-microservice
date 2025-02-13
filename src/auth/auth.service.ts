import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { MoreThan, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  resetPasswordEmailBody,
  resetPasswordEmailSubject,
  verifyEmailBody,
  verifyEmailSubject,
} from 'src/common/types/send.email.type';
import { EmailUtil } from 'src/common/utils/email.utils';
import { createToken } from 'src/common/utils/create-token.util';
import { SignupDto } from './Dtos/signup.dto';
import { LoginDto } from './Dtos/login.dto';
import { UserService } from 'src/users/user.service';
import { User } from 'src/users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private emailUtil: EmailUtil,
    private readonly userService: UserService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  validateToken(token: string): any {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      throw new UnauthorizedException(err);
    }
  }

  extractTokenFromHeaders(headers: Record<string, string | string[]>): string {
    const authHeader = headers['authorization'];

    if (!authHeader || !authHeader.toString().startsWith('Bearer ')) {
      throw new UnauthorizedException('Invalid authorization header format');
    }

    return authHeader.toString().split(' ')[1];
  }

  async signup(
    signupDto: SignupDto,
  ): Promise<{ message: string; token: string }> {
    const currentUser = await this.userService.findByEmail(signupDto.email);
    if (currentUser) {
      throw new HttpException('Sorry, this user already exists', 401);
    }

    const user = await this.userService.create(signupDto);

    const verificationCode = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();

    user.emailVerifyCode = crypto
      .createHash('sha256')
      .update(verificationCode)
      .digest('hex');
    user.emailVerifyExpires = new Date(Date.now() + 10 * 60 * 1000);

    await this.userRepository.save(user);

    try {
      await this.emailUtil.sendVerifyEmail({
        to: user.email,
        subject: verifyEmailSubject,
        user: user.name,
        code: verificationCode,
        message: verifyEmailBody,
      });
    } catch (err) {
      throw new HttpException('Error sending verification code via email', 500);
    }

    const token = createToken(user.id);
    return { message: 'Verification code sent to your email', token };
  }

  async login(
    loginDto: LoginDto,
  ): Promise<{ message: string; token: string; user: Partial<User> }> {
    const user = await this.userService.findByEmail(loginDto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (!user.isEmailVerified) {
      throw new UnauthorizedException(
        'Please verify your email before logging in',
      );
    }

    const token = createToken(user.id);
    return { message: 'Login successful', token, user };
  }

  async verifyEmail(code: string): Promise<{ message: string; token: string }> {
    const hashedCode = crypto.createHash('sha256').update(code).digest('hex');

    const user = await this.userRepository.findOneBy({
      emailVerifyCode: hashedCode,
    });

    if (!user || new Date(user.emailVerifyExpires).getTime() < Date.now()) {
      throw new BadRequestException(
        'Invalid verification code or user not found.',
      );
    }

    user.isEmailVerified = true;
    user.emailVerifyCode = null;
    user.emailVerifyExpires = null;
    await this.userRepository.save(user);

    const token = createToken(user.id);
    return { message: 'Email successfully verified', token };
  }

  async reSendEmailVerifyCode(email: string): Promise<{ message: string }> {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new BadRequestException('User not found.');
    }

    if (user.isEmailVerified) {
      throw new BadRequestException('Email is already verified.');
    }

    const verificationCode = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();

    user.emailVerifyCode = crypto
      .createHash('sha256')
      .update(verificationCode)
      .digest('hex');
    user.emailVerifyExpires = new Date(Date.now() + 15 * 60 * 1000);

    await this.userRepository.save(user);

    try {
      await this.emailUtil.sendVerifyEmail({
        to: user.email,
        subject: verifyEmailSubject,
        user: user.name,
        code: verificationCode,
        message: verifyEmailBody,
      });
    } catch (err) {
      throw new HttpException(err, 500);
    }

    return { message: 'Verification code resent successfully.' };
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new HttpException(
        `There is no user with this email address ${email}`,
        HttpStatus.NOT_FOUND,
      );
    }

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    user.passwordResetCode = crypto
      .createHash('sha256')
      .update(resetCode)
      .digest('hex');
    user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);
    user.passwordResetVerified = false;

    await this.userRepository.save(user);

    try {
      await this.emailUtil.sendForgotPasswordEmail({
        to: user.email,
        subject: resetPasswordEmailSubject,
        user: user.name,
        resetCode,
        message: resetPasswordEmailBody,
      });
    } catch (err) {
      user.passwordResetCode = null;
      user.passwordResetExpires = null;
      user.passwordResetVerified = null;
      await this.userRepository.save(user);

      throw new HttpException(
        'Error sending reset code email',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async verifyPasswordResetCode(
    code: string,
  ): Promise<{ message: string; token: string }> {
    const hashedResetCode = crypto
      .createHash('sha256')
      .update(code)
      .digest('hex');

    const user = await this.userRepository.findOneBy({
      passwordResetCode: hashedResetCode,
      passwordResetExpires: MoreThan(new Date()),
    });

    if (!user) {
      throw new HttpException(
        'Invalid reset code or reset code has expired',
        HttpStatus.FORBIDDEN,
      );
    }

    user.passwordResetVerified = true;
    await this.userRepository.save(user);

    const token = createToken(user.id);
    return { message: 'Password reset code verified successfully', token };
  }

  async resetPassword(token: string, password: string) {
    const userId = this.validateToken(token).userId;
    const user = await this.userRepository.findOneBy({ id: userId });

    if (!user || !user.passwordResetVerified) {
      throw new HttpException('Invalid token or code not verified', 403);
    }

    user.password = await bcrypt.hash(password, 10);
    user.passwordResetCode = null;
    user.passwordResetExpires = null;
    user.passwordResetVerified = null;

    await this.userRepository.save(user);

    const newToken = createToken(user.id);
    return { message: 'Password reset successful', token: newToken };
  }
}
