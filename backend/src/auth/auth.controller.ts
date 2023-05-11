import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport'
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwtStrategy/jwt.strategy';

@Controller('auth')
export class AuthController {
    constructor(private readonly jwtService:JwtStrategy, private readonly authService:AuthService){}

    // @UseGuards(AuthGuard('jwt'))
    // @Post('jwt')
    // async login(@Req() req:Request){
    // }

    @Get('42')
    @UseGuards(AuthGuard('42'))
    async login(@Req() req) {
    }
  
    @Get('callback')
    @UseGuards(AuthGuard('42'))
    async QuaranteDeuxCallback(@Req() req) {
        return await this.authService.login42(req);
    }

}
