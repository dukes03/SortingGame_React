"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { getSocket } from "@/lib/socket";
import { useRouter } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import FooterUserList from './footer';
import ContentHost from './ContentHost';
import Playing from './playing';
import Navbar from './Navbar';
import FullscreenButton from "../FullscreenButton";

export default function LobbyPage() {
    const searchParams = useSearchParams();

    const [name, setName] = useState("");
    const [gameState, setGameState] = useState("lobby");// lobby, playing, endgame
    const [Ishost, setIshost] = useState(false);
    const [hostname, setHostName] = useState("");
    const [score, setscore] = useState(0);
    const room = searchParams.get("roomId");
    const username = searchParams.get("username");
    const [userInRoom, setUserInRoom] = useState("");
    const [userList, setUserList] = useState<string[]>([]);
    const socket = getSocket();
    const router = useRouter();
    const QRUrl = `http://localhost:3000/login?roomId=${room}`;


    useEffect(() => {
        if (!room) {
            router.push("/");
            return alert("ไม่มีรหัสห้อง");
        }
        setName(username || "");
        socket.emit("joinRoom", { room, username });

        socket.on("userJoined", (data) => {
            setUserInRoom((prev) => prev + data.username + " เข้าห้อง ");
            console.log(data.username + " เข้าห้อง ");
        });
        socket.on("userList", (users) => {
            setUserList(users.users);
            setHostName(users.creator);
        });
        socket.on("joinRoomError", (users) => {
            // alert(users);
            // router.push("/");
            socket.emit("createRoom", { room, username });
            socket.emit("joinRoom", { room, username });

        });

        socket.emit("IshostRoom", { room, username });

        socket.on("userIshostRoom", (IshostRoom) => {
            setIshost(IshostRoom);
        });
        socket.on("userGetGameState", (gameState) => {
            setGameState(gameState);
        });
        socket.on("Error", (codeError) => {
            alert(codeError);
        });
        socket.on("EndGameResult", (data) => {
            setGameState("endgame");
            setscore(data);
            console.log(data);
        });
    }, [socket]);






    return (

        <div className="">

            {/* Lobby Page */}
            {gameState === "lobby" && <div>
                <Navbar />


                <div className="md:block sm:flex sm:flex-row  sm:justify-start  sm:items-start" >

                    <div >
                        <h1 className="text-[50px] font-bold text-center font-bold md:pt-6 md:m-4">Lobby  {room}</h1>
                        {/* QR Code */}
                        <div className=" md:max-w-2xl  md:mx-auto sm:mx-5 sm:px-10  sm:py-10  bg-sky-50 shadow-xl  rounded-3xl   md:p-7   text-center flex   justify-center flex-row ">

                            <div className="flex-1">
                                <div className="flex justify-center items-center md:m-3 sm:mx-1 md:flex-col">
                                    <h2 className="sm:mb-3 font-bold  text-center ">สามารถใช้ QR Code นี้ <br></br> เข้าห้องเข้าเล่นเกมได้จากทุกอุปกรณ์ </h2>
                                    <QRCodeSVG className="rounded" value={QRUrl} size={150} />
                                </div>   </div>
                            {Ishost &&
                                <div className=" flex-1">
                                    <ContentHost socket={socket} room={room} />        </div>}
                        </div>
                    </div>

                    <FooterUserList UserList={userList} Username={name} Hostname={hostname} /></div>
            </div>}
            {/* Play Page */}
            {gameState === "playing" && <Playing socket={socket} room={room} />}
            {/* endgame Page */}
            {gameState === "endgame" &&
                <div>
                    <h2 className="text-2xl font-bold mb-4">End Game  {room}</h2>
                    <div className="p-4">{score}</div>
                </div>}
            <FullscreenButton />
        </div>

    );
}