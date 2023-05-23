import { Body, Controller, Get, Post, UseGuards} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ChannelDto, MemberChannelDto, getConvDto, msgChannelDto, sendMsgDto } from './Dto/chat.dto';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
    constructor(private readonly chatService:ChatService){}

    @UseGuards(AuthGuard('jwt'))
    @Post('message/new')
    async addNewMessage(@Body() msgDto:sendMsgDto){
        return await this.chatService.addNewMessage(msgDto);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('conversation')
    async getConversation(@Body() getConv:getConvDto){
        return await this.chatService.getConversation(getConv);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('channel/new')
    async createNewChannel(@Body() channelDto: ChannelDto){
        return await this.chatService.createNewChannel(channelDto);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('channel/member/new')
    async createMembreChannel(@Body() memberChannelDto:MemberChannelDto){
        return await this.chatService.createMemberChannel(memberChannelDto);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('channel/message/new')
    async newMsgChannel(@Body() msgDto:msgChannelDto){
        return await this.chatService.newMsgChannel(msgDto);
    }

}
