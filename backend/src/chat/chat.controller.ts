import { Body, Controller, Delete, Get, Patch, Post, Res, UseGuards} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ChannelDto, DeleteMemberChannelDto, MemberChannelDto, channeDto, deleteChannelDto, getConvDto, msgChannelDto, sendMsgDto, updateChannelDto, updateMemberShipDto } from './Dto/chat.dto';
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

    // creaate new channel
    // @UseGuards(AuthGuard('jwt'))
    // @Post('channel/new')
    // async createNewChannel(@Body() channelDto: ChannelDto, @Res() response:Response){
        // try{
        //     const result =  await this.chatService.createNewChannel(channelDto);
        //     response.status(200).json(result);
        // }
        // catch(error){
        //     response.status(400).json(error);
        // }
    // }

    // MSG Channel
    // add new msg to database and rely it to channelConversation that belongs to
    // @UseGuards(AuthGuard('jwt'))
    // @Post('channel/message/new')
    // async newMsgChannel(@Body() msgDto:msgChannelDto){
    //     return await this.chatService.newMsgChannel(msgDto);
    // }

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
    
    
    // update channel : turne it public or private , change Owner , or password
    // @UseGuards(AuthGuard('jwt'))
    // @Patch('channel/update')
    // async updateChannel(@Body() updateCh:updateChannelDto){
    //     return await this.chatService.updateChannel(updateCh);
    // }

    // delete a channel
    // @UseGuards(AuthGuard('jwt'))
    // @Delete('channel/delete')
    // async deleteChannelDto(@Body() deleteCh:deleteChannelDto){
    //     return await this.chatService.deleteChannel(deleteCh);
    // }
    
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



    // create new member
    // @UseGuards(AuthGuard('jwt'))
    // @Post('channel/member/new')
    // async createMembreChannel(@Body() memberChannelDto:MemberChannelDto){
    //     return await this.chatService.createMemberChannel(memberChannelDto);
    // }

    // update memberShip , you can mute , blacklist , change nickName , set member an admin
    // @UseGuards(AuthGuard('jwt'))
    // @Patch('channel/member/update')
    // async updateMemberShip(@Body() updateMember:updateMemberShipDto){
    //     return await this.chatService.updateMemberShip(updateMember);
    // }

    // delete a memberShip
    // @UseGuards(AuthGuard('jwt'))
    // @Delete('channel/member/delete')
    // async deleteMemberShip(@Body() deleteMember:DeleteMemberChannelDto){
    //     return await this.chatService.deleteMemberShip(deleteMember);
    // }

}
