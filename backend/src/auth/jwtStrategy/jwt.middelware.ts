import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).send({ message: 'Unauthorized' });
    }
    const token = authHeader.split(' ')[1];
    try {
      const payload = this.jwtService.verify(token, { secret: 'said@123' });
      // Check if the payload contains a refresh token
      if (payload.refreshToken) {
        // Set the refresh token as an HttpOnly cookie
        res.cookie('refreshToken', payload.refreshToken, {
          httpOnly: true,
        });
      }
      next();
    } catch (err) {
      return res.status(401).send({ message: 'Unauthorized' });
    }
  }
}