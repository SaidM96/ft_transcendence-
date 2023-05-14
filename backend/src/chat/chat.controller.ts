import { Controller, Post, UseGuards} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('chat')
export class ChatController {
    
    // @UseGuards(AuthGuard('jwt'))
    // @Post(':login/')

}
