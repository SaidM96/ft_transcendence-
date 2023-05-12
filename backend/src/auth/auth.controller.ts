import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport'
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwtStrategy/jwt.strategy';
import { JwtGuard } from './jwtStrategy/jwt.guard';
import { JwtMiddleware } from './jwtStrategy/jwt.middelware';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService:AuthService){}

    @Get('42')
    @UseGuards(AuthGuard('42'))
    async login(@Req() req) {
    }
  
    @Get('callback')
    @UseGuards(AuthGuard('42'))
    async QuaranteDeuxCallback(@Req() req) {
        return await this.authService.login42(req);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('waw')
    async protectedRoute(@Req() req: any) {
      // req.user contains the authenticated user object
      return { message: `Hello, ikhan!` };
    }
}
