import { Controller, Get, Post, Redirect, Req, Res, UseGuards } from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport'
import { AuthService } from './auth.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService:AuthService){}

    @Get('42')
    @UseGuards(AuthGuard('42'))
    async login(@Req() req) {
    }  

    @Get('call')
    @UseGuards(AuthGuard('42'))
    async QuaranteDeuxCallback(@Req() req:any) {
        return   await this.authService.login42(req);
        // return accessToken;
      // response.redirect(`http://localhost:3000/callback?token=${accessToken}?`) 
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('waw')
    async protectedRoute(@Req() req: any) {
      // req.user contains the authenticated user object
      console.log(req.user);
    }
}
