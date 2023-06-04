import { User, channel } from '.prisma/client';
import { JwtService } from '@nestjs/jwt';
import {ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer} from '@nestjs/websockets'
import { Socket, Server} from 'socket.io'
import { JwtStrategy } from 'src/auth/jwtStrategy/jwt.strategy';
import { UserService } from 'src/user/user.service';
import { ChannelDto, DeleteMemberChannelDto, MemberChannelDto, deleteChannelDto, msgChannelDto, newChannelDto, sendMsgSocket, updateChannelDto, updateMemberShipDto } from './Dto/chat.dto';
import { ChatService } from './chat.service';
import { BadRequestException, ConflictException, NotFoundException, UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { WebsocketExceptionsFilter } from './socketException';


@WebSocketGateway(3333)
@UseFilters(WebsocketExceptionsFilter)
@UsePipes(new ValidationPipe({ transform: true }))
export class UserGateWay implements OnGatewayConnection, OnGatewayDisconnect{
    constructor(private readonly jwtStrategy:JwtStrategy, private readonly userService:UserService,private readonly jwtService:JwtService, private readonly chatService:ChatService){    
        this.setExistenChannels();
    }
    @WebSocketServer()
    server:Server;

    connectedUsers:Map<string, User> = new Map();
    existChannels:Map<string, channel> = new Map();

    // fetch all channels in database and set them in map
    async setExistenChannels(){
        const channels = await this.chatService.getAllChannels();
        channels.forEach((channel) => {this.existChannels.set(channel.channelName,channel)});
    }
    // handle connection user
    // Socket should contain a user's jwt to connect him succefully 
    async handleConnection(client: Socket) {
        try{
            const token = client.handshake.headers.authorization;
            const decodedToken = await this.jwtService.verify(token,{secret:`${process.env.jwt_secret}`});
            const login = decodedToken.login;
            const user = await this.userService.findUser({login:login});
            this.connectedUsers.set(client.id,user);
            const roomsToJoin = await this.chatService.getUserNameChannels({login:user.login});
            roomsToJoin.forEach((channelName) => {
                client.join(channelName);
            });
            client.emit('message',`welcome ${this.connectedUsers.get(client.id).username} you have connected succefully`);
        }
        catch(error){
            this.connectedUsers.delete(client.id);
            client.emit('errorMessage', error);
            client.disconnect();
        }
    }

    // handle disconnection user
    handleDisconnect(client: Socket) {
        client.emit('errorMessage', `${this.connectedUsers.get(client.id).username} is disconnected`);
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
        try {
            const {receiver, content} = body;
            const userSender = this.connectedUsers.get(client.id);
            if (!userSender)
                throw new NotFoundException(`cant find sender User`);
            const userReceiver = await this.userService.findUser({login:receiver});
            if (userReceiver.login == userSender.login)
                throw new BadRequestException(`${receiver} cant send msg to ${receiver}`);
            const receiverSocketId = this.findKeyByLogin(userReceiver.login);
            if (receiverSocketId)
                this.server.to(receiverSocketId).emit('PrivateMessage', {sender:userSender.login,content:content});
            this.chatService.addNewMessage({sender:userSender.login,receiver:userReceiver.login, content:content});
        }
        catch(error){
            client.emit("errorMessage", error);
        }
    }

    // create new channel
    @SubscribeMessage('newChannel')
    async createNewChannel(@ConnectedSocket() client:Socket, @MessageBody() body:newChannelDto){
        try{
            const {channelName,isPrivate , ispassword, password} = body;
            if (this.existChannels.has(body.channelName))
                throw new BadRequestException('Channel already exists');
            const user = this.connectedUsers.get(client.id)
            if (!user)
                throw new NotFoundException('no such user');
            const dto:ChannelDto = {channelName:channelName,isPrivate:isPrivate, LoginOwner:user.login,ispassword:ispassword,password:password};
            const ch = await this.chatService.createNewChannel(dto);
            this.existChannels.set(ch.channelName,ch);
            client.join(ch.channelName);
            client.emit('message',`your Channel: ${ch.channelName} has been created`);
        }
        catch(error){
            client.emit("errorMessage", error);
        }
    }

    // update channel  : turne it public or private , change Owner , or password
    @SubscribeMessage('updateChannel')
    async updateChannel(@ConnectedSocket() client:Socket, @MessageBody() body:updateChannelDto){
        try{        
            if (!this.existChannels.has(body.channelName))
                throw new BadRequestException('no such Channel');
            const user = this.connectedUsers.get(client.id)
            if (!user)
                throw new NotFoundException('no such user');
            const channel = await this.chatService.updateChannel(body);
            this.existChannels.set(channel.channelName,channel);
            client.emit('message','changes have been sauvegardeded');
        }
        catch(error){
            client.emit('errorMessage',error);
        }
    }

    // delete channel
    @SubscribeMessage('deleteChannel')
    async deleteChannel(@ConnectedSocket() client:Socket, @MessageBody() body:deleteChannelDto){
        try{
            if (!this.existChannels.has(body.channelName))
                throw new BadRequestException('no such Channel');
            await this.chatService.deleteChannel(body);
            client.emit('message',`you have been delete ${body.channelName} channel`);
        }
        catch(error){
            client.emit('errorMessage',error);
        }
    }

    // add new Member to a channel
    @SubscribeMessage('joinChannel')
    async joinChannel(@ConnectedSocket() client:Socket, @MessageBody() body:MemberChannelDto){
        if (!this.existChannels.has(body.channelName))
            throw new BadRequestException('no such Channel');
        const user = this.connectedUsers.get(client.id);
        if (!user)
            throw new NotFoundException('no such user');
        // add client as member to  database
        const memberShip = await this.chatService.createMemberChannel(body);
        client.join(memberShip.channelName);
        client.emit('joinChannel',`you have been Joined to ${memberShip.channelName} channel`);
    }

    // delete member from a channel
    @SubscribeMessage('kickMember')
    async kickMemberFromChannel(@ConnectedSocket() client:Socket, @MessageBody() body:DeleteMemberChannelDto){
        if (!this.existChannels.has(body.channelName))
            throw new BadRequestException('no such Channel');
        const user = this.connectedUsers.get(client.id)
        if (!user)
            throw new NotFoundException('no such user');
        await this.chatService.deleteMemberShip(body);
        client.leave(body.channelName);
        client.emit('kickMember',`you have been kicked from ${body.channelName} channel`);
    }

    // update a member ban mute ...
    @SubscribeMessage('updateMember')
    async updateUser(@ConnectedSocket() client:Socket, @MessageBody() body:updateMemberShipDto){
        if (!this.existChannels.has(body.channelName))
            client.emit('updateMember','no such Channel')
        const user = this.connectedUsers.get(client.id)
        if (!user)
            client.emit('updateMember','no such user')
        const memberShip = await this.chatService.updateMemberShip(body);
        // this.server.to()
    }

    // msg channel
    @SubscribeMessage('msgChannel')
    async newMsgChannel(@ConnectedSocket() client:Socket, @MessageBody() body:msgChannelDto){
        if (!this.existChannels.has(body.channelName))
            throw new BadRequestException('no such Channel');
        const user = this.connectedUsers.get(client.id)
        if (!user)
            throw new NotFoundException('no such user');
        const msg = await this.chatService.newMsgChannel(body);
        if (msg)
        {
            this.server.to(msg.channelName).emit('msgChannel',{sender:user.login,content:msg.content});
        }
        else
            client.emit('msgChannel','cant send a msg to this channel');
    }

    // event to change case of a user
    
}