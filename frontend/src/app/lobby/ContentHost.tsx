
import React from 'react';
interface infoRoom {
    socket: any;
    room: any;
}
function ContentHost({ socket, room }: infoRoom) {
     const Startgame = () => {
        socket.emit("startGame", { room });
     };
    return (
        <div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded">GameSetUP</button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded">Stay as Moderator</button>
            <button onClick={Startgame} className="px-4 py-2 bg-blue-600 text-white rounded">Start Game</button>
        </div>
    );
}
export default ContentHost;