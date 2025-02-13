import { Request } from 'express';
import { UserResponseDto } from 'src/users/Dtos/user-response.dto';

export interface AuthenticationRequest extends Request {
  user?: UserResponseDto;
}
