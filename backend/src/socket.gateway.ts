import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    MessageBody,
    ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

interface RoomInfo {
    creator: string;
    users: string[];
}

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class SocketGateway {
    @WebSocketServer()
    server: Server;

    private rooms: Map<string, RoomInfo> = new Map();
    handleConnection(client: Socket) {
        console.log(`✅ Client connected: ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        console.log(`❌ Client disconnected: ${client.data.username || client.id}`);
        if (client.data.room) {
            this.server.to(client.data.room).emit('userLeft', {
                username: client.data.username,
            });
        }
    }
    // createRoom
    @SubscribeMessage('createRoom')
    handleCreateRoom(
        @MessageBody() data: { room: string; username: string },
        @ConnectedSocket() client: Socket,
    ) {
        const { room, username } = data;

        if (this.rooms.has(room)) {
            client.emit('createRoomError', 'ห้องนี้มีคนสร้างแล้ว');
            return;
        }

        this.rooms.set(room, { creator: username, users: [] });
        console.log(`📌 Room created: ${room} by ${username}`);

        client.emit('roomCreated', { room, creator: username });
    }

    // Is host room
    @SubscribeMessage('IshostRoom')
    handleIshostRoom(
        @MessageBody() data: { room: string; username: string },
        @ConnectedSocket() client: Socket,
    ) {
        const { room, username } = data;
        const roomInfo = this.rooms.get(room);
        if (roomInfo && roomInfo.creator === username) {
            client.emit('userIshostRoom', true);
        } else {
            client.emit('userIshostRoom', false);
        }

    }
    // joinRoom
    @SubscribeMessage('joinRoom')
    handleJoinRoom(
        @MessageBody() data: { room: string; username: string },
        @ConnectedSocket() client: Socket,
    ) {
        const { room, username } = data;

        if (!this.rooms.has(room)) {
            client.emit('joinRoomError', 'ห้องนี้ยังไม่ถูกสร้าง');
            return;
        }

        client.data.username = username;
        client.data.room = room;
        client.join(room);

        // เพิ่ม user ลงใน rooms map
        const roomInfo = this.rooms.get(room)!;
        if (!roomInfo.users.includes(username)) roomInfo.users.push(username);

        console.log(`📌 ${username} joined room: ${room}`);

        this.server.to(room).emit('userJoined', { username });
        client.emit('joinedRoom', { room, username, creator: roomInfo.creator });

        this.notifyUserList(room);
    }
    @SubscribeMessage('startGame')
    handleStartGame(
        @MessageBody() data: { room: string },
        @ConnectedSocket() client: Socket,
    ) {
        const { room } = data;
        const roomInfo = this.rooms.get(room);
        if (roomInfo && roomInfo.creator === client.data.username) {
            this.server.to(room).emit('userGetGameState', 'playing');
        } else {
            client.emit('Error', 'Only the host can start the game.');
        }
    }

    /**
      
     * client : { room: string, message: string }
     */
    @SubscribeMessage('sendMessage')
    handleMessage(
        @MessageBody() data: { room: string; message: string },
        @ConnectedSocket() client: Socket,
    ) {
        const username = client.data.username || 'Anonymous';
        const { room, message } = data;

        console.log(`💬 [${room}] ${username}: ${message}`);

        this.server.to(room).emit('message', {
            username,
            room,
            message,
        });
    }
    //  leaveRoom
    @SubscribeMessage('leaveRoom')
    handleLeaveRoom(
        @MessageBody() room: string,
        @ConnectedSocket() client: Socket,
    ) {
        const username = client.data.username;
        this.removeUserFromRoom(room, username);
        client.leave(room);

        this.server.to(room).emit('userLeft', { username });
        this.notifyUserList(room);

        client.emit('leftRoom', room);
    }

    //   remove user
    private removeUserFromRoom(room: string, username: string) {
        const roomInfo = this.rooms.get(room);
        if (!roomInfo) return;

        roomInfo.users = roomInfo.users.filter((u) => u !== username);


        if (roomInfo.users.length === 0) {
            console.log(`Room deleted: ${room}`);
            this.rooms.delete(room);
        }
    }
    //notifyUserList
    private async notifyUserList(room: string) {
        const sockets = await this.server.in(room).fetchSockets();
        const users = sockets.map((s) => s.data.username || 'Unknown');

        this.server.to(room).emit('userList', users);
    }
}
