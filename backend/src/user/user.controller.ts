import { UserService } from 'src/user/user.service';
import { Body, Controller, Delete, Get,Req, Post, UseGuards, Patch, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FriendDto ,findUserDto, storeMatchDto } from './dto/user.dto';
import { Response } from 'express';
import { ApiBearerAuth, ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('user')
export class UserController {
constructor(private readonly userSrevice:UserService){}

    // get all Users
    @UseGuards(AuthGuard('jwt'))
    @Get('all')
    async findAll(){
        return await this.userSrevice.findAllUsers();
    }


    // get a user by his token jwt
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

    // get user 
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

    // get user friends
    @UseGuards(AuthGuard('jwt'))
    @Post('friends')
    async getUserFriends(@Body() findUser:findUserDto, @Res() response:Response){
        try {
            const result =  await this.userSrevice.getUserFriends(findUser);
            console.log(result)
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

// get status of user
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


// get stats of user
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

// matches
    @UseGuards(AuthGuard('jwt'))
    @Post('match')
    async storeNewMatch(@Body() matchDto:storeMatchDto){
        return await this.userSrevice.storeMatch(matchDto);
    }

    // get history of matches between of a  user
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
    
    // get history of matches between two users
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