import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    MessageBody,
    ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { QUESTIONS, Question } from './questions.data';
import e from 'express';
interface RoomInfo {
    creator: string;
    maxRound: number;
    currentRound?: number;
    gameState?: string;
    userInfo: Map<string, UserInfo>;
}
interface UserInfo {
    scorePerRound: number[];
    totalScore: number;
    isReady: boolean;
    indeximage: number;
    currentRound: number;
    currentQuestionStart: number[];
    currentQuestionEnd: number[];
}
interface CardInfo {
    header: string;
    decription: string;
    imageUrl?: string;
    Textimage: string;
    variant: number;
}
interface ListUserInRoom {
    users: any;
    creator: string;
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
    private questions: Question[] = QUESTIONS;

    getAllQuestions(): Question[] {
        return this.questions;
    }
    shuffleArray<T>(array: T[]): T[] {
        let currentIndex = array.length,
            randomIndex;

        // While there remain elements to shuffle.
        while (currentIndex !== 0) {
            // Pick a remaining element.
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            // And swap it with the current element.
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex],
                array[currentIndex],
            ];
        }

        return array;
    }
    handleConnection(client: Socket) {
        //console.log(`✅ Client connected: ${client.id}`);
    }
    checkSortedAndScore(arr) {
        let correctPairs = 1;
        let wrongIndexes = [] as number[];
        for (let i = 0; i < arr.length - 1; i++) {
            if (arr[i] <= arr[i + 1]) correctPairs++;
            else { wrongIndexes.push(i); }
        }
        const totalPairs = arr.length;
        return { correctPairs, totalPairs, wrongIndexes };
    }

    handleDisconnect(client: Socket) {
        const room = client.data.room;
        const username = client.data.username;

        if (room && username) {
            const roomInfo = this.rooms.get(room);
            const user = roomInfo?.userInfo.get(username);
            if (user) {
                console.log(`⚠️ ${username} disconnected, waiting for reconnect...`);
                user.isReady = false;
            }


            this.removeUserFromRoom(room, username);
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
        this.rooms.set(room, { creator: username, userInfo: new Map(), maxRound: 3, currentRound: 0, gameState: 'lobby' });
        console.log(`📌 Room created: ${room} by ${username}`);
        client.emit('roomCreated', { room, creator: username });
        client.emit('userIshostRoom', true);
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

        // Add user in  rooms map
        const roomInfo = this.rooms.get(room)!;
        if (!roomInfo.userInfo) {
            roomInfo.userInfo = new Map<string, UserInfo>();
        }
        if (!roomInfo.userInfo.has(username)) {
            roomInfo.userInfo.set(username, {
                scorePerRound: [], totalScore: 0, isReady: false, indeximage: 0, currentRound: 0, currentQuestionStart: [],
                currentQuestionEnd: []
            });
        }

        console.log(`📌 ${username} joined room: ${room}`);

        this.server.to(room).emit('userJoined', { username });
        client.emit('joinedRoom', { room, username, creator: roomInfo.creator });

        this.notifyUserList(room);
    }
    // startGame
    @SubscribeMessage('startGame')
    handleStartGame(
        @MessageBody() data: { room: string },
        @ConnectedSocket() client: Socket,
    ) {
        const { room } = data;
        const roomInfo = this.rooms.get(room);
        if (roomInfo && roomInfo.creator === client.data.username) {
            this.server.to(room).emit('userGetGameState', 'playing');
            roomInfo.gameState = 'playing';
            // roomInfo.currentRound = (roomInfo.currentRound || 0) + 1;
            console.log(`▶️ Game started in room: ${room}`);
            //console.log(this.questions[roomInfo.currentRound || 0]);
        } else {
            client.emit('Error', 'Only the host can start the game.');
        }
    }
    // startGame
    @SubscribeMessage('GetGameState')
    handleGetGameState(
        @MessageBody() data: { room: string },
        @ConnectedSocket() client: Socket,
    ) {
        const { room } = data;
        const roomInfo = this.rooms.get(room);
        if (roomInfo) {
            client.emit('userGetGameState', roomInfo.gameState);
        }
    }
    //  this.server.to(room).emit('userGetQuestion', this.questions[roomInfo.currentRound || 0]);
    /**
     
    * userGetQuestion
    */
    @SubscribeMessage('RequestQuestionRoom')
    handleRequestQuestionRoom(
        @MessageBody() data: { room: string; },
        @ConnectedSocket() client: Socket,
    ) {
        const { room } = data;
        const roomInfo = this.rooms.get(room);
        if (!roomInfo) {
            client.emit('Error', 'Room not found.');
            return;
        }
        let question = this.questions[roomInfo.currentRound || 0];
        question.ListCard = this.shuffleArray(question.ListCard);
        this.server.to(room).emit('userGetQuestion', question);
    }
    /**
     
    * userGetQuestion
    */
    @SubscribeMessage('RequestQuestion')
    handleRequestQuestion(
        @MessageBody() data: { room: string },
        @ConnectedSocket() client: Socket,
    ) {
        const { room } = data;
        const roomInfo = this.rooms.get(room);
        let indexQuestion = 0;

        if (!roomInfo) {
            client.emit('Error', 'Room not found.');
            return;
        }

        const user = roomInfo.userInfo.get(client.data.username);
        if (!user) {
            client.emit('Error', 'User not found.');
            return;
        }

        if (user.currentRound) {
            indexQuestion = user.currentRound;
        }

        if (indexQuestion < roomInfo.maxRound) {

            let question = this.questions[indexQuestion];
            question.ListCard = this.shuffleArray(question.ListCard);

            let timeLimit = 10;
            let startTime = Date.now();
            let endTime = startTime + timeLimit * 1000 + 1000;
            console.log(user.scorePerRound, indexQuestion, user.currentQuestionStart.length)
            if (indexQuestion >= user.currentQuestionStart.length) {
                user.currentRound = indexQuestion;
                user.currentQuestionStart[indexQuestion] = startTime;
                user.currentQuestionEnd[indexQuestion] = endTime;

            }
            else {
                startTime = user.currentQuestionStart[indexQuestion];
                endTime = user.currentQuestionEnd[indexQuestion];


            }
            indexQuestion++;
            client.emit('userGetQuestion', {
                question,
                indexQuestion,
                lengthQuestion: roomInfo.maxRound,
                timeLimit,
                startTime,
                endTime,
            });
        } else {
            client.emit('EndGameResult', user.totalScore);
        }
    }

    /**
     
    * userGetQuestion
    */
    @SubscribeMessage('submitAnswer')
    handlesubmitAnswer(
        @MessageBody() data: { room: string; answer: number[] },
        @ConnectedSocket() client: Socket,
    ) {
        const { room } = data;
        const roomInfo = this.rooms.get(room);
        if (!roomInfo) {
            client.emit('Error', 'Room not found.');
            return;
        }
        const result = this.checkSortedAndScore(data.answer);
        roomInfo.userInfo?.get(client.data.username)?.scorePerRound.push(result.correctPairs);
        if (roomInfo.userInfo?.get(client.data.username)?.totalScore) {
            roomInfo.userInfo.get(client.data.username)!.totalScore += result.correctPairs;
            roomInfo.userInfo.get(client.data.username)!.currentRound! += 1;
        }
        else {
            roomInfo.userInfo.get(client.data.username)!.totalScore = result.correctPairs;
            roomInfo.userInfo.get(client.data.username)!.currentRound = 1;
        }
        client.emit('userGetResultQuestion', result);
    }

    /**
 
* userGetQuestion
*/
    @SubscribeMessage('timeoutQuestion')
    handleTimeoutQuestion(
        @MessageBody() data: { room: string; answer: number[] },
        @ConnectedSocket() client: Socket,
    ) {
        const { room } = data;
        const roomInfo = this.rooms.get(room);
        if (!roomInfo) {
            client.emit('Error', 'Room not found.');
            return;
        }
        
        roomInfo.userInfo?.get(client.data.username)?.scorePerRound.push(0);
        if (roomInfo.userInfo?.get(client.data.username)?.totalScore != null) {
            roomInfo.userInfo.get(client.data.username)!.totalScore +=0;
            roomInfo.userInfo.get(client.data.username)!.currentRound! += 1;
        }
        else {
            roomInfo.userInfo.get(client.data.username)!.totalScore = 0;
            roomInfo.userInfo.get(client.data.username)!.currentRound = 1;
        }
       // client.emit('emitRequestQuestion');
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
    private async removeUserFromRoom(room: string, username: string) {
        const roomInfo = this.rooms.get(room);
        if (!roomInfo) return;


        // 🔍 ตรวจสอบจำนวน socket จริง ๆ ใน room
        const sockets = await this.server.in(room).fetchSockets();
        if (sockets.length === 0) {
            console.log(`🏁 Room deleted: ${room}`);
            this.rooms.delete(room);
        }
    }
    //notifyUserList
    private async notifyUserList(room: string) {
        const sockets = await this.server.in(room).fetchSockets();
        const users = sockets.map((s) => s.data.username || 'Unknown');
        const listUsers: ListUserInRoom = { users, creator: this.rooms.get(room)?.creator || '' };
        console.log(`👥 Users in room ${room}:`, listUsers);
        this.server.to(room).emit('userList', listUsers);
    }
}
