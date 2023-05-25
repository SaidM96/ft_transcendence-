import { Controller, Get, Post, Redirect, Req, Res, UseGuards } from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport'
import { AuthService } from './auth.service';
import { Response } from 'express';
import { findUserDto } from 'src/user/dto/user.dto';
import { use } from 'passport';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService:AuthService){}

    @UseGuards(AuthGuard('42'))
    @Get('42')
    async login(@Req() req) {
    }

    @UseGuards(AuthGuard('42'))
    @Get('callback')
    async QuaranteDeuxCallback(@Req() req:any, @Res() response:Response) {
      const access = await this.authService.login42(req);
      console.log(access);
      response.redirect(`https://google.com`)
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('waw')
    async protectedRoute(@Req() req: any) {
      // req.user contains the authenticated user object
      console.log(req.user);
    }

        
    @Get('awaw')
    async awa(userDto:findUserDto){
       return userDto;
    }
    @Get('2-FA')
    async generateNewQrCode(userDto:findUserDto){
       return await this.authService.generateNewQrCode(userDto);
    }

}
