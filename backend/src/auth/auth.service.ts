import { Injectable, Req } from '@nestjs/common';
import { LoginDto } from 'src/user/dto/login.dto';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class AuthService {
    constructor(private readonly jwtService:JwtService, 
        private readonly userService:UserService,
        private prisma:PrismaService,){}



    async login42(req:any) {
        if (!req.user) {
            console.log("user didnt authenticate");
        }
        else
        {
            const  { login, displayname, email,   } = req.user._json;
            const userInfo = {login:login, username:displayname, email:email,}
            const user = await this.userService.findUser(userInfo.login)
            if (!user)
            {
                const loginDto:LoginDto = userInfo;
                await this.userService.createUser(loginDto);
            }
            const payload = {login:user.login, username:user.username, sub:user.UserId }
            const accessToken = this.jwtService.sign(payload, {expiresIn: '60s'});
            const refreshTocken = this.jwtService.sign(payload, {expiresIn: '7d'});
            return {payload, accessToken, refreshTocken};
        }
    }

    async refreshTocken(payload:any){
        return {
                accessTocken: this.jwtService.sign(payload),
            }
    }
}
