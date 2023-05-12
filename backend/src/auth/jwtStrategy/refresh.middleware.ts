import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class RefreshJwtMiddleware implements NestMiddleware {
  constructor(private readonly prisma: PrismaService,
    private readonly jwtService: JwtService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const refreshToken = req.cookies?.['refresh-token'];
    if (!refreshToken) {
      return next();
    }
    try {
      const decoded = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_TOKEN_SECRET,
      })
      const user = await this.prisma.client.user.findUnique({
        where: {
          UserId: decoded.sub,
        },
      });
      if (!user || user.refreshToken !== refreshToken) {
        return next();
      }
      req.user = user;
      return next();
    } catch (err) {
      return next();
    }
  }
}