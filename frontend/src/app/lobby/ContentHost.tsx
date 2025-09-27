
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
        <div className="flex-col px-3 h-full  items-center  justify-center mt-4 border-l-3 border-dashed border-gray-400 " >
            <button className="px-4 py-3 mb-3   bg-gray-200 w-50 font-bold  rounded-xl">GameSetUP</button>
            <button className="px-4 py-3  mb-3 bg-gray-200 w-50 font-bold  rounded-xl">Stay as Moderator</button>
            <button onClick={Startgame} className="px-4 py-7  bg-orange-500 w-50 font-bold text-white rounded-xl">Start Game</button>
        </div>
    );
}
export default ContentHost;