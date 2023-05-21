import { Injectable, Req } from '@nestjs/common';
import { LoginDto } from 'src/user/dto/user.dto';
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
            return {message:"user didnt authenticate"};
        }
        else
        {
            
            const  { login, displayname, email   } = req.user._json;
            const userInfo = {login:login, username:displayname, email:email,};
            let user = await this.userService.findUser(userInfo.login);
            if (!user)
            {
                const loginDto:LoginDto = userInfo;
                user = await this.userService.createUser(loginDto);
            }
            const payload = { login:user.login, sub:user.UserId };
            const accessToken = await this.jwtService.signAsync(payload);
            return accessToken;
        }
    }
}
