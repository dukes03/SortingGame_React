import DraggableCardList from './DraggableCardList';
import CircularProgress from './../component/CircularProgress';
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
    const [listcardQuestion, setlistcardQuestion] = useState({ question: "กำลังโหลดคำถาม...", ListCard: [{ id: "1", content: "🍎 Card 1", variant: 1 }, { id: "2", content: "🍊🍊 Card 2", variant: 2 }, { id: "3", content: "🍋🍋🍋 Card 3", variant: 3 }, { id: "4", content: "🍉 🍉🍉🍉Card 4", variant: 4 }] });
    console.log("📥 Playing:", listcardQuestion, StatePlaying, IsSubmit);
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
            <div className="flex justify-center items-center ">
                <div className="text-2xl font-bold space-x-3 mb-4 p-5  bg-sky-50 flex  flex-row w-1/3 justify-between items-center   rounded-xl shadow-xl ">
                    <div>  {listcardQuestion.question} และส่งคำตอบภายในเวลาที่กำหนด</div>
                    {/* Time */}

                    <CircularProgress progress={10} textinner='3/5' textsub="รอบที่" />
                    {/* Round */}

                    <CircularProgress progress={10} textinner='19' textsub="วินาที" />
                </div>
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