import { Body, Controller, Get, Res, UseGuards} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {  channeDto,getConvDto} from './Dto/chat.dto';
import { ChatService } from './chat.service';
import { findUserDto } from 'src/user/dto/user.dto';
import { Response } from 'express';

@Controller('chat')
export class ChatController {
    constructor(private readonly chatService:ChatService){}

    // add new msg to database and rely it to conversation that belongs to
    // get conversation between two users
    @UseGuards(AuthGuard('jwt'))
    @Get('conversation')
    async getConversation(@Body() getConv:getConvDto, @Res() response:Response){
        try{
            const result = await this.chatService.getConversation(getConv);
            response.status(200).json(result);
        }
        catch(error){
            response.status(400).json(error);
        }
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('conversations/user')
    async getConversationsOfUser(@Body() dto:findUserDto, @Res() response:Response){
        try{
            const result = await this.chatService.getConversationsOfUser(dto);
            response.status(200).json(result);
        }
        catch(error){
            response.status(400).json(error);
        }
    }


// channel

    // get conversation  channel 
    @UseGuards(AuthGuard('jwt'))
    @Get('channel/message/all')
    async getConversationChannel(@Body() chDto:channeDto, @Res() response:Response){
        try{
            const result = await this.chatService.getConversationChannel(chDto);
            response.status(200).json(result);
        }
        catch(error){
            response.status(400).json(error);
        }
    }

    // get all public channels
    @UseGuards(AuthGuard('jwt'))
    @Get('channel/all')
    async getAllChannels(){
        return await this.chatService.getAllChannels();
    }
    
    // memberShip
    @UseGuards(AuthGuard('jwt'))
    @Get('membership/all')
    async getUserChannels(@Body() userDto:findUserDto, @Res() response:Response){
        try{
            const result = await this.chatService.getUserChannels(userDto);
            response.status(200).json(result);
        }
        catch(error){
            response.status(400).json(error);
        }
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('channel/members')
    async getMembersOfChannel(@Body() chDto:channeDto, @Res() response:Response){
        try{
            const result = await this.chatService.getMembersOfChannel(chDto);
            response.status(200).json(result);
        }
        catch(error){
            response.status(400).json(error);
        }
    }

    // delete a memberShip
    // @UseGuards(AuthGuard('jwt'))
    // @Delete('channel/member/delete')
    // async deleteMemberShip(@Body() deleteMember:DeleteMemberChannelDto){
    //     return await this.chatService.deleteMemberShip(deleteMember);
    // }

}
