import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { AuthenticationRequest } from '../auth.types';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  private extractTokenFromHeader(request: Request): string | null {
    const authorization = request.headers['authorization'];
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return null;
    }
    return authorization.replace('Bearer ', '');
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: AuthenticationRequest = context
      .switchToHttp()
      .getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Authorization token is missing');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });

      request.user = payload;
    } catch (err) {
      throw new UnauthorizedException(err);
    }

    return true;
  }
}
