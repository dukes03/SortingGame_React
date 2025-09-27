import DraggableCardList from './DraggableCardList';
import React from 'react';
import { useState, useEffect } from "react";
interface infoRoom {
    socket: any;
    room: any;
}

function Playing({ socket, room }: infoRoom) {
    // const Startgame = () => {
    //     socket.emit("startGame", { room });
    // };

    const [IsSubmit, setIsSubmit] = useState(false);
    const [StatePlaying, setStatePlaying] = useState("Playing");// Playing, Waiting, ShowAnswer, EndGame
    const [listcardQuestion, setlistcardQuestion] = useState("");
    useEffect(() => {
        socket.emit("RequestQuestion", { room });
        socket.on("userGetQuestion", (data: any) => {
            console.log("📥 การ์ดคำถาม:", data);
            setlistcardQuestion(data);
            setStatePlaying("Playing");
            setIsSubmit(false);
        });
        socket.on("userGetResultQuestion", (data: any) => {
            console.log("📥 userGetResultQuestion:", data);
            setStatePlaying("ShowAnswer");
        });
    }, [socket, room]);
    const handleSubmitOrder = (order: number[]) => {
        if (StatePlaying == "Playing" && !IsSubmit) {
            console.log("📤 ส่งคำตอบการ์ด:", order);
            socket.emit("submitAnswer", { room, answer: order });
            setStatePlaying("Waiting");
            setIsSubmit(true);
        }
    };
    const ReqNewQuestion = () => {
        if (StatePlaying == "ShowAnswer" && IsSubmit) {
            socket.emit("RequestQuestion", { room });
        }
    };
    return (
        <div>
            {/* Header */}
            <div className="text-2xl font-bold mb-4">
                <div>Game is now playing in room {room}!</div>
                <div>Time  !</div>
                <div>Round  !</div>
            </div>
            {/* Body */}
            <DraggableCardList listCard={listcardQuestion} OnSubmitOrder={handleSubmitOrder} StatePlaying={StatePlaying}></DraggableCardList>
            {/* footer */}
            {StatePlaying == "ShowAnswer" &&
                < button
                    onClick={ReqNewQuestion}
                    className="mt-6 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition"
                >
                    ReqNewQuestion
                </button>}
        </div >
    );
}
export default Playing;