import { Injectable, NotFoundException, Req } from '@nestjs/common';
import { LoginDto, TwoFADto, findUserDto } from 'src/user/dto/user.dto';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'prisma/prisma.service';
import * as speakeasy from 'speakeasy';
import * as QRCode from 'qrcode';
@Injectable()
export class AuthService {
    constructor(private readonly jwtService:JwtService, 
        private readonly userService:UserService,
        private prisma:PrismaService){}

    async login42(req:any) {
        if (!req.user) {
            return {message:"user didnt authenticate"};
        }
        else
        {
            const  { login, displayname, email   } = req.user._json;
            const userInfo = {login:login, username:displayname, email:email,};
            const loginDto:LoginDto = userInfo;
            let user = await this.userService.findUser({login:login});
            if (!user)
            {
                user = await this.userService.createUser(loginDto);
            }
            const payload = { login:user.login, sub:user.UserId };
            return await this.jwtService.signAsync(payload);
        }
    }


    // 2-FA Google Authenticator

    async generateNewQrCode(userDto:findUserDto){
        const user = await this.userService.findUser(userDto);
        if (!user)
            throw new NotFoundException("cant find user");
        if (!(user.enableTwoFa))
            throw new NotFoundException("user had not enable twoFA");
        const secret = await speakeasy.generateSecret();
        await this.prisma.client.user.update({
            where:{
                UserId:user.UserId,
            },
            data:{
                twoFactorSecret:secret.base32,
            }
        })
        const otpAuthUrl = await speakeasy.otpauthURL({
            label:'PigPongGame',
            secret:secret.base32,
        });
        const qrCodeImage = await QRCode.toDataURL(otpAuthUrl);
        return {secret:secret.base32, qrCode:qrCodeImage};
    }

    async validateCode2FA(twoFA:TwoFADto){
        const {login, code} = twoFA;
        let user = await this.userService.findUser({login:login});
        if (!user)
            return new NotFoundException();
        return await speakeasy.totp.verify({
            secret: user.twoFactorSecret,
            encoding: 'base32',
            token: code,
        })
    }
}
