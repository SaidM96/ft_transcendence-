import { UserService } from 'src/user/user.service';
import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtGuard } from 'src/auth/jwtStrategy/jwt.guard';
import { FriendDto, findUserDto } from './dto/user.dto';
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
    @Delete(':login/delete')
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
    @Delete(':login/friendship/:removedFriend')
    async removeFriend(@Param('login') login:string, @Param('removedFriend') removedFriend:string){
        return await this.userSrevice.removeFriend(login, removedFriend);
    }

// block
    // block user
    @UseGuards(AuthGuard('jwt'))
    @Post(':login/block/:blockedLogin')
    async blockUser(@Param('login') login:string, @Param('blockedLogin') blockedLogin:string){
        return await this.userSrevice.blockUser(login, blockedLogin);
    }

    // remove Block
    @UseGuards(AuthGuard('jwt'))
    @Delete(':login/rmblock/:blockedLogin')
    async removeBlock(@Param('login') login:string, @Param('blockedLogin') blockedLogin:string){
        return await this.userSrevice.removeBlock(login, blockedLogin);
    }

    // get list of blocked users
    @UseGuards(AuthGuard('jwt'))
    @Get(':login/block')
    async getListBlocked(@Param('login') login:string){
        return await this.userSrevice.getBlockedList(login);
    }

// status

}
