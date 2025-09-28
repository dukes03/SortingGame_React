
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
        <div className="flex-col md:px-3    h-full  items-center  justify-center border-l-3 border-dashed border-gray-400 " >
            <button className="md:px-4 md:py-3 md:mb-3 sm:px-5 sm:py-3 sm:m-1 sm:text-[10px]  md:text-xl  bg-gray-200 md:w-50 font-bold  rounded-xl">GameSetUP</button>
            <button className="md:px-4 md:py-3 md:mb-3 sm:px-2 sm:py-3 sm:m-1 sm:text-[10px]  md:text-lg  bg-gray-200 md:w-50 font-bold  rounded-xl">Stay as Moderator</button>
            <button onClick={Startgame} className="md:px-4 md:py-7  sm:p-4 sm:m-1 sm:text-sm  md:text-xl  bg-orange-500 md:w-50 font-bold text-white rounded-xl">Start Game</button>
        </div>
    );
}
export default ContentHost;