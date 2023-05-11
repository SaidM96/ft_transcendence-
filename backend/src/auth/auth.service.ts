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
            const accessToken = this.jwtService.sign(payload, {expiresIn: '15m'});
            // const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
            // await this.prisma.client.user.update({
            //     where:{
            //         UserId: payload.sub,
            //     },
            //     data: {
            //         refreshToken:refreshToken
            //     }
            // })
            return {payload, accessToken};
        }


        // async refreshTocken(){
        //     const payload = {
        //         username:user.email,
        //         sub:{
        //             name:user.name,
        //         }
        //     }
    
        //     return {
        //             accessTocken: this.jwtService.sign(payload),
        //         }
        // }
    }
}
