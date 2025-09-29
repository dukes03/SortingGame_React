import DraggableCardList from './DraggableCardList';
import CircularProgress from './../component/CircularProgress';
import React from 'react';
import { useState, useEffect } from "react";
interface infoRoom {
    socket: any;
    room: any;
}
interface dataquestion {
    question: any;
    indexQuestion: number;
    lengthQuestion: number;
    timeLimit: number;
    startTime: number;
    endTime: number;
}
interface ResultQuestion {
    correctPairs: number;
    totalPairs: number;
    wrongIndexes: number[];
}

function Playing({ socket, room }: infoRoom) {
    // const Startgame = () => {
    //     socket.emit("startGame", { room });
    // };

    const [IsSubmit, setIsSubmit] = useState(false);
    const [roundPlay, setroundPlay] = useState(0);
    const [Maxround, setMaxround] = useState(1);
    const [score, setscore] = useState(0);
    const [wrongIndexes, setwrongIndexes] = useState<number[]>([]);
    const [StatePlaying, setStatePlaying] = useState("Playing");// Playing, Waiting, ShowAnswer, EndGame
    const [listcardQuestion, setlistcardQuestion] = useState({ question: "กำลังโหลดคำถาม...", ListCard: [{ id: "1", content: "🍎 Card 1", variant: 1 }, { id: "2", content: "🍊🍊 Card 2", variant: 2 }, { id: "3", content: "🍋🍋🍋 Card 3", variant: 3 }, { id: "4", content: "🍉 🍉🍉🍉Card 4", variant: 4 }] });
    const isDesktop = window.matchMedia('(min-width: 768px)').matches;
    const sizeCirvularValue = isDesktop ? 100 : 70;

    const [seconds, setSeconds] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [endTime, setendTime] = useState(0);
    const [timeLimit, settimeLimit] = useState(30);

    useEffect(() => {
        let timer: any;
        if (isRunning) {
            timer = setInterval(() => {
                if (seconds > 0) {
                    setSeconds(seconds - 1);
                } else {
                    clearInterval(timer);
                    setIsRunning(false);
                    if (!IsSubmit) {

                        setIsSubmit(true);
                        setStatePlaying("ShowAnswer");
                        setscore(0);
                        socket.emit("timeoutQuestion", { room });

                    }
                }
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [isRunning, seconds]);
    useEffect(() => {
        socket.emit("RequestQuestion", { room });
        socket.on("userGetQuestion", (data: dataquestion) => {
            console.log("📥 การ์ดคำถาม:", data);
            setlistcardQuestion(data.question);
            setMaxround(data.lengthQuestion);
            setroundPlay(data.indexQuestion);
            settimeLimit(data.timeLimit)
            setStatePlaying("Playing");
            setIsSubmit(false);
            setSeconds((data.endTime - Date.now()) / 1000);
            console.log((data.endTime - Date.now()) / 1000, "  tume")
            setIsRunning(true);
        });
        socket.on("userGetResultQuestion", (data: ResultQuestion) => {
            console.log("📥 userGetResultQuestion:", data);
            setscore(data.correctPairs);
            setwrongIndexes(data.wrongIndexes);
            setStatePlaying("ShowAnswer");
        });
        socket.on("emitRequestQuestion", () => {
            socket.emit("RequestQuestion", { room });
        });

    }, [socket, room]);
    const handleSubmitOrder = (order: number[]) => {
        if (StatePlaying == "Playing" && !IsSubmit) {
            console.log("📤 ส่งคำตอบการ์ด:", order);
            socket.emit("submitAnswer", { room, answer: order });
            setStatePlaying("Waiting");
            setIsSubmit(true);
            setIsRunning(false)
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
                <div className="lg:text-2xl sm:text-xl font-bold space-x-3 lg:mb-4 lg:p-5 sm:px-3  bg-sky-50 flex  flex-row lg:w-1/3 sm:w-4/5 justify-between items-center   rounded-b-xl shadow-xl ">
                    <div>  {listcardQuestion.question} และส่งคำตอบภายในเวลาที่กำหนด</div>
                    {/* Time */}

                    <CircularProgress progress={(roundPlay / Maxround) * 100} size={sizeCirvularValue} textinner={`${roundPlay}/${Maxround} `} textsub="รอบที่" colorhex="#4b4b4bff" colorhexsub="#acabab83"
                        colorClassMain="text-stone-600" colorClasssub="text-stone-500" />
                    {/* Round */}

                    <CircularProgress progress={(seconds / timeLimit) * 100} textinner={Math.floor(seconds) + ""} size={sizeCirvularValue} textsub="วินาที" colorhex="#ff790cff" colorhexsub="#ffa1545e"
                        colorClassMain="text-amber-500" colorClasssub="text-amber-400" />
                </div>
            </div>
            {/* Body */}
            {StatePlaying == "ShowAnswer" && <div>
                <div className='text-3xl font-bold  text-center md:m-5 '> เฉลยคำตอบ คุณได้ {score} คะแนน </div>
            </div>}

            {/* Body  Sortcard*/}
            <DraggableCardList listCard={listcardQuestion} OnSubmitOrder={handleSubmitOrder} StatePlaying={StatePlaying} WrongIndexes={wrongIndexes}></DraggableCardList>

            {/* footer */}
            {StatePlaying == "ShowAnswer" &&
                <div className="flex justify-end items-center ">
                    < button
                        onClick={ReqNewQuestion}
                        className="md:m-6 sm:mx-10 sm:my-1  px-6   py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition"
                    >
                        ข้อถัดไป
                    </button>
                </div >}
        </div >
    );
}
export default Playing;