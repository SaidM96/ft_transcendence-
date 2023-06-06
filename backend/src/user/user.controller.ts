import { UserService } from 'src/user/user.service';
import { Body, Controller, Delete, Get,Req, Post, UseGuards, Patch, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FriendDto ,findUserDto } from './dto/user.dto';
import { Response } from 'express';

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
    async findMe(@Req() req:any, @Res() response:Response){
        try{
            const  { login} = req.user;
            const result = await this.userSrevice.findUser({login:login});
            response.status(200).json(result);
        }
        catch(e){
            response.status(400).json(e);
        }
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('find')
    async findOne(@Body() findUser:findUserDto, @Res() response:Response){
        try{
            const result = await this.userSrevice.findUser(findUser);
            response.status(200).json(result);
        }
        catch(e){
            response.status(400).json(e);
        }
    }

    // do it in gateway
    // @UseGuards(AuthGuard('jwt'))
    // @Delete('delete')
    // async deleteUser(@Body() findUser:findUserDto){
    //     return await this.userSrevice.deleteUser(findUser);
    // }

    // get friends
    @UseGuards(AuthGuard('jwt'))
    @Get('friends')
    async getUserFriends(@Body() findUser:findUserDto, @Res() response:Response){
        try {
            const result =  await this.userSrevice.getUserFriends(findUser);
            response.status(200).json(result);
        }
        catch(error){
            response.status(400).json(error);
        }
    }



    // get list of blocked users
    @UseGuards(AuthGuard('jwt'))
    @Get('blocks')
    async getListBlocked(@Body() findUser:findUserDto, @Res() response:Response){
        try {
            const result =  await this.userSrevice.getBlockedList(findUser);
            response.status(200).json(result);
        }
        catch(error){
            response.status(400).json(error);
        }
    }

// status
    @UseGuards(AuthGuard('jwt'))
    @Get('status')
    async getUserStatus(@Body() findUser:findUserDto, @Res() response:Response){
        try {
            const result =  await this.userSrevice.getStatusUser(findUser); 
            response.status(200).json(result);
        }
        catch(error){
            response.status(400).json(error);
        }
    }


// stats
    @UseGuards(AuthGuard('jwt'))
    @Get('stats')
    async getUserStats(@Body() findUser:findUserDto, @Res() response:Response){
        try {
            const result = await this.userSrevice.getStatsUser(findUser); 
            response.status(200).json(result);
        }
        catch(error){
            response.status(400).json(error);
        }
    }

    // @UseGuards(AuthGuard('jwt'))
    // @Patch('stats')
    // async modifyStatsUser(@Body() updateStats:UpdateStats){
    //     return await this.userSrevice.modifyStatsUser(updateStats); 
    // }

// matches
    // @UseGuards(AuthGuard('jwt'))
    // @Post('match')
    // async storeNewMatch(@Body() matchDto:storeMatchDto){
    //     return await this.userSrevice.storeMatch(matchDto);
    // }

    @UseGuards(AuthGuard('jwt'))
    @Get('historyMatch')
    async getHistoryMatch(@Body() findUser:findUserDto, @Res() response:Response){
        try {
            const result = await this.userSrevice.getHistoryUserMatchs(findUser);
            response.status(200).json(result);
        }
        catch(error){
            response.status(400).json(error);
        }
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('historyFriend')
    async getHistoryOneVsOne(@Body() friendDto:FriendDto, @Res() response:Response){
        try {
            const result = await this.userSrevice.getHistoryOneVsOne(friendDto);
            response.status(200).json(result);
        }
        catch(error){
            response.status(400).json(error);
        }
    }
}