import * as jwt from 'jsonwebtoken';

export function createToken(userId: number): string {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION,
  });
}
