import { Controller, Get, Post, Redirect, Req, Res, UseGuards } from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport'
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwtStrategy/jwt.strategy';
import { JwtGuard } from './jwtStrategy/jwt.guard';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService:AuthService){}

    @Get('42')
    @UseGuards(AuthGuard('42'))
    async login(@Req() req) {
    }
  
    @Get('callback')
    @UseGuards(AuthGuard('42'))
    async QuaranteDeuxCallback(@Req() req, @Res({passthrough:true}) response:Response) {
      const accessToken =  await this.authService.login42(req);
      const secretData = {
        token:accessToken,
      }
      response.cookie('jwt-cookie', secretData, {httpOnly:true,},);
      response.redirect('http://localhost:3000/Home');

      
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('waw')
    async protectedRoute(@Req() req: any) {
      // req.user contains the authenticated user object
      return { message: `Hello, ikhan  hmed!` };
    }
}
