import { User } from '.prisma/client';
import { JwtService } from '@nestjs/jwt';
import {ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer} from '@nestjs/websockets'
import { Socket, Server} from 'socket.io'
import { JwtStrategy } from 'src/auth/jwtStrategy/jwt.strategy';
import { UserService } from 'src/user/user.service';
import { sendChannelMsgSocket, sendMsgDto, sendMsgSocket } from './Dto/chat.dto';
import { ChatService } from './chat.service';
import { NotFoundException } from '@nestjs/common';

@WebSocketGateway(3333)
export class UserGateWay implements OnGatewayConnection, OnGatewayDisconnect{
    constructor(private readonly jwtStrategy:JwtStrategy, private readonly userService:UserService,
                 private readonly jwtService:JwtService, private readonly chatService:ChatService){    
    }
    @WebSocketServer()
    server:Server;

    connectedUsers:Map<string, User> = new Map();

    // handle connection user
    // Socket should contain a user's jwt to connect him succefully 
    async handleConnection(client: Socket) {
        try{
            const token = client.handshake.headers.authorization;
            const decodedToken = await this.jwtService.verify(token,{secret:'said@123'})
            const login = decodedToken.login;
            const user = await this.userService.findUser({login:login});
            this.connectedUsers.set(client.id,user);
            console.log(`${this.connectedUsers.get(client.id).username} is connected succefully`);
        }
        catch(e){
            client.disconnect();
        }
    }

    // handle disconnection user
    handleDisconnect(client: Socket) {
        console.log(`${this.connectedUsers.get(client.id).username} is disconnected`);
        this.connectedUsers.delete(client.id);
    }


    findKeyByLogin(login: string): string | undefined {
        for (const [key, user] of this.connectedUsers) {
          if (user.login === login) {
            return key;
          }
        }
        return undefined;
      }

    // handle private msg 
    @SubscribeMessage('PrivateMessage')
    async handlePrivatemessage(@ConnectedSocket() client:Socket, @MessageBody() body:sendMsgSocket){
        const {receiver, content} = body;
        const userSender = this.connectedUsers.get(client.id);
        if (!userSender)
            throw new NotFoundException('no such user');
        const userReceiver = await this.userService.findUser({login:receiver});
        if (!userReceiver)
            throw new NotFoundException('no such user');
        const receiverSocketId = this.findKeyByLogin(userReceiver.login);
        if (receiverSocketId)
            this.server.to(receiverSocketId).emit('PrivateMessage', content);
        this.chatService.addNewMessage({sender:userSender.login,receiver:userReceiver.login, content:content});
    }

    // @SubscribeMessage('addMember')
    // async addMemberChannel(@ConnectedSocket() client:Socket, @MessageBody() body:any){
        
    // }

    @SubscribeMessage('channelMsg')
    async handleChannelmessage(@ConnectedSocket() client:Socket, @MessageBody() body:sendChannelMsgSocket){
        const {content, channelName} = body;
        const userSender = this.connectedUsers.get(client.id);
        if (!userSender)
            throw new NotFoundException('no such user');
        const channel = this.chatService.findChannel({channelName:channelName});
        if (!channel)
            throw new NotFoundException('no such channel');
        this.server.emit('channelMsg', content);
        this.chatService.newMsgChannel({login:userSender.login, content:content, channelName:channelName});
    }
}