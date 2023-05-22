import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { sendMsgDto } from './Dto/chat.dto';

@Injectable()
export class ChatService {
    constructor(private readonly userService:UserService){}



    

    // async addNewMessage(msgDto:sendMsgDto){
        
    //     // check if sender or receiver exist in  database 
        
    //     // know we check if sender and receiver has already an conversation
    //     const conv = await this.
    //     return await this.userService
    // }
}


// export class sendMsgDto {
//     @IsString()
//     sender:string;
//     @IsString()
//     receiver:string;
//     @IsString()
//     content:string;
// }