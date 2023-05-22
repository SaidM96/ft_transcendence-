import { Controller, Post, UseGuards} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { sendMsgDto } from './Dto/chat.dto';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
    constructor(private readonly chatService:ChatService){}

    // @Post('newMessage')
    // async addNewMessage(msgDto:sendMsgDto){
    //     return await this.chatService.addNewMessage(msgDto);
    // }

}
