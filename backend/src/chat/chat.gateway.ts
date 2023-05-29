import { User } from '.prisma/client';
import { BadRequestException } from '@nestjs/common';
import {OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer} from '@nestjs/websockets'
import {Server, Socket} from 'socket.io'
import { JwtStrategy } from 'src/auth/jwtStrategy/jwt.strategy';
import { UserService } from 'src/user/user.service';

export class userObj {
    login:string;
    userId:string;
}

@WebSocketGateway(80)
export class ChatGateWay implements OnGatewayConnection, OnGatewayDisconnect{
    constructor(private readonly jwtStrategy:JwtStrategy, private readonly userService:UserService){}
    @WebSocketServer()
    server:Server;

    connectedSocket:Map<string, Socket> = new Map();
    connectedUsers:Map<string, User> = new Map();

    async handleConnection(client: Socket) {
        try{
            const tockenJwt:string = client.handshake.headers.authorization;
            const decodedTocken = await this.jwtStrategy.validate(tockenJwt);
            const loginUser = decodedTocken.login;
            const user = await this.userService.findUser({login:loginUser});
            this.connectedSocket.set(client.id,client);
            this.connectedUsers.set(client.id,user);
            console.log(`${user.username} is connected succefully`);
        }catch(e){
            client.disconnect();
            throw new BadRequestException('failed to connect with Gateway cause you are not welcome to party');
        }
    }

    handleDisconnect(client: Socket) {
        console.log(`${this.connectedUsers.get(client.id).username} is disconnected`)
        this.connectedUsers.delete(client.id);
        this.connectedSocket.delete(client.id);
    }
}