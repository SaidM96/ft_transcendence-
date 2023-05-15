import { UserService } from 'src/user/user.service';
import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtGuard } from 'src/auth/jwtStrategy/jwt.guard';
import { BlockDto, FriendDto, findUserDto } from './dto/user.dto';
import { find } from 'rxjs';

@Controller('user')
export class UserController {
constructor(private readonly userSrevice:UserService){}

    // User
    @UseGuards(AuthGuard('jwt'))
    @Get('all')
    async findAll(){
        return await this.userSrevice.findAllUsers();
    }
    
    @UseGuards(AuthGuard('jwt'))
    @Get(':login')
    async findOne(@Param('login') login:string){
        return await this.userSrevice.findUser(login);
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete(':login')
    async deleteUser(@Param('login') login:string){
        return await this.userSrevice.deleteUser(login);
    }

//friends
    // addFriend
    @UseGuards(AuthGuard('jwt'))
    @Post('friendship')
    async newFriendshi(@Body() friendDto:FriendDto){
        return await this.userSrevice.createFriendship(friendDto);
    }

    // get friends
    @UseGuards(AuthGuard('jwt'))
    @Get(':login/friends')
    async getUserFriends(@Param('login') login:string){
        return await this.userSrevice.getUserFriends(login);
    }
    // remove friends
    @UseGuards(AuthGuard('jwt'))
    @Delete('friendship')
    async removeFriend(@Body() friendDto:FriendDto){
        return await this.userSrevice.removeFriend(friendDto);
    }

// block
    // block user
    @UseGuards(AuthGuard('jwt'))
    @Post('block')
    async blockUser(@Body() blockDto:BlockDto){
        return await this.userSrevice.blockUser(blockDto);
    }

    // remove Block
    @UseGuards(AuthGuard('jwt'))
    @Delete('block')
    async removeBlock(@Body() blockDto:BlockDto){
        return await this.userSrevice.removeBlock(blockDto.login, blockDto.blockedLogin);
    }

    // get list of blocked users
    @UseGuards(AuthGuard('jwt'))
    @Get('block/:login')
    async getListBlocked(@Param('login') login:string){
        return await this.userSrevice.getBlockedList(login);
    }

// status
    @UseGuards(AuthGuard('jwt'))
    @Get('status/:login')
    async getUserStatus(@Param('login') login:string){
        return await this.userSrevice.getStatusUser(login); 
    }
}