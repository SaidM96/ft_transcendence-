import { UserService } from 'src/user/user.service';
import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtGuard } from 'src/auth/jwtStrategy/jwt.guard';

@Controller('user')
export class UserController {
constructor(private readonly userSrevice:UserService){}

    @UseGuards(AuthGuard('jwt'))
    @Get('all')
    async findAll(){
        return await this.userSrevice.findAllUsers();
    }

}
