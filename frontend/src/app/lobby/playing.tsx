import DraggableCardList from './DraggableCardList';
import React from 'react';
interface infoRoom {
    socket: any;
    room: any;
}
function Playing({ socket, room }: infoRoom) {
    // const Startgame = () => {
    //     socket.emit("startGame", { room });
    // };
    return (
        <div>
            {/* Header */}
            <div className="text-2xl font-bold mb-4">
                <div>Game is now playing in room {room}!</div>
                <div>Time  !</div>
                <div>Round  !</div>
            </div>
            {/* Body */}
            <DraggableCardList></DraggableCardList>
            {/* footer */}
        </div>
    );
}
export default Playing;