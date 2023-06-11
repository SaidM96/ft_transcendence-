import { WebSocketGateway, WebSocketServer, OnGatewayInit, ConnectedSocket, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Body, Engine, World, Bodies, Composite } from 'matter-js';
import WebSocket from 'ws';
import { matterNode, measurements } from './game.service';





@WebSocketGateway(3008, { cors: "*" })
export class GameGateway implements OnGatewayInit {
    @WebSocketServer() server;
    private worlds = {};
    private world: matterNode
    constructor() { }
    afterInit() {
        this.worlds = {};
    }
    @SubscribeMessage('joinRoom')
    async handleJoinRoom(@MessageBody() data: { roomId: string, obj: measurements }, @ConnectedSocket() client: Socket) {
        const { roomId } = data;
        console.log("user joined room", roomId, "and page height is", !this.worlds[roomId] == false)
        if (!this.worlds[roomId]) {
            console.log("new room")
            this.world = new matterNode(this.server, roomId, data.obj);
            this.worlds[roomId] = this.world
            this.world.sendBallPosition()
        }
        else
            this.world = this.worlds[roomId];

        client.join(roomId); // add the client to the specified room
        this.world.handleConnection(client)

    }

    handleConnection(client: Socket) {
        console.log("user connected handle connection.")
    }

    handleDisconnect(client: Socket) {
        this.world?.handleDisconnect(client);
        if (!this.server.engine.clientsCount) {
            this.world.clearGame()
            console.log("deleting room")
            const roomId = this.world.roomId
            delete this.worlds[roomId]
            this.worlds[roomId] = null
        }
    }


}