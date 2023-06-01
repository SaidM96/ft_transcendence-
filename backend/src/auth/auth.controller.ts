import { Body, Controller, Get, Post, Redirect, Req, Res, UseGuards } from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport'
import { AuthService } from './auth.service';
import { Response } from 'express';
import { TwoFADto, findUserDto } from 'src/user/dto/user.dto';
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
      response.redirect(`https://www.realmadrid.com/en`)
    }

    @Get('QR')
    async generateNewQrCode(@Body() userDto:findUserDto){
       return await this.authService.generateNewQrCode(userDto);
    }

    @Post('2-FA')
    async validateAthenticaion(@Body() twoFA:TwoFADto){
      return await this.authService.validateCode2FA(twoFA);
    }

}
