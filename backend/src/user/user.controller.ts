import { UserService } from 'src/user/user.service';
import { Body, Controller, Delete, Get,Req, Param, Post, UseGuards, Patch } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtGuard } from 'src/auth/jwtStrategy/jwt.guard';
import { BlockDto, FriendDto, UpdateStats, UpdateStatus, UpdateUserDto, findUserDto } from './dto/user.dto';
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
    @Get('me')
    async findMe(@Req() req:any){
        console.log(req.user);
        const {login, id} = req.user;
        const findUser:findUserDto = login;
        return await this.userSrevice.findUser(findUser);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('find')
    async findOne(@Body() findUser:findUserDto){
        return await this.userSrevice.findUser(findUser);
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete('delete')
    async deleteUser(@Body() findUser:findUserDto){
        return await this.userSrevice.deleteUser(findUser);
    }

    @UseGuards(AuthGuard('jwt'))
    @Patch('update')
    async updateUser(@Body() updateUser:UpdateUserDto){
        return await this.userSrevice.updateUser(updateUser);
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
    @Get('friends')
    async getUserFriends(@Body() findUser:findUserDto){
        return await this.userSrevice.getUserFriends(findUser);
    }

    // remove friends
    @UseGuards(AuthGuard('jwt'))
    @Delete('rmfriend')
    async removeFriend(@Body() rmfriendDto:FriendDto){
        return await this.userSrevice.removeFriend(rmfriendDto);
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
    @Get('blocks')
    async getListBlocked(@Body() findUser:findUserDto){
        return await this.userSrevice.getBlockedList(findUser);
    }

// status
    @UseGuards(AuthGuard('jwt'))
    @Get('status')
    async getUserStatus(@Body() findUser:findUserDto){
        return await this.userSrevice.getStatusUser(findUser); 
    }

    @UseGuards(AuthGuard('jwt'))
    @Patch('status')
    async modifyStatusUser(@Body() updateStatus:UpdateStatus){
        return await this.userSrevice.modifyStatusUser(updateStatus); 
    }

// stats
    @UseGuards(AuthGuard('jwt'))
    @Get('stats')
    async getUserStats(@Body() findUser:findUserDto){
        return await this.userSrevice.getStatsUser(findUser); 
    }

    @UseGuards(AuthGuard('jwt'))
    @Patch('stats')
    async modifyStatsUser(@Body() updateStats:UpdateStats){
        return await this.userSrevice.modifyStatsUser(updateStats); 
    }

// 
}