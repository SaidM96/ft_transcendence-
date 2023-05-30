import { User } from '.prisma/client';
import { JwtService } from '@nestjs/jwt';
import {OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer} from '@nestjs/websockets'
import { Socket, Server} from 'socket.io'
import { JwtStrategy } from 'src/auth/jwtStrategy/jwt.strategy';
import { UserService } from 'src/user/user.service';

@WebSocketGateway(3333)
export class UserGateWay implements OnGatewayConnection, OnGatewayDisconnect{
    constructor(private readonly jwtStrategy:JwtStrategy, private readonly userService:UserService, private readonly jwtService:JwtService){    
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

    handleDisconnect(client: Socket) {
        console.log(`${this.connectedUsers.get(client.id).username} is disconnected`);
        this.connectedUsers.delete(client.id);
    }

    // findKeyByLogin(login: string): string | undefined {
    //     for (const [key, user] of this.connectedUsers) {
    //       if (user.login === login) {
    //         return key;
    //       }
    //     }
    //     return undefined; // User not found
    //   }

    // @SubscribeMessage('PrivateMessage')
    // async handlePrivatemessage(client:Socket, payload:any){
    //     const user = this.connectedUsers.get(client.id);
    //     const rec = await this.userService.findUser({login:payload.login})
    //     const receiverSocketId = this.findKeyByLogin(rec.login);
    //     this.server.to(receiverSocketId).emit('PrivateMessage', payload.message);
    // }
}