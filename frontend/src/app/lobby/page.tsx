"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { getSocket } from "@/lib/socket";
import { useRouter } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import FooterUserList from './footer';
import ContentHost from './ContentHost';
import Playing from './playing';

export default function LobbyPage() {
    const searchParams = useSearchParams();

    const [name, setName] = useState("");
    const [gameState, setGameState] = useState("lobby");// lobby, playing, endgame
    const [Ishost, setIshost] = useState(false);
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
        socket.emit("joinRoom", { room, username });

        socket.on("userJoined", (data) => {
            setUserInRoom((prev) => prev + data.username + " เข้าห้อง ");
            console.log(data.username + " เข้าห้อง ");
        });
        socket.on("userList", (users) => {
            setUserList(users);
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

        <div className="max-w-md mx-auto p-6">
            {gameState === "lobby" && <div>
                <h2 className="text-2xl font-bold mb-4">Lobby  {room}</h2>
                <div className="max-w-md mx-auto p-6">
                    <div className="p-4">
                        <h2 className="mb-2">QR Code สำหรับ URL:</h2>
                        <QRCodeSVG value={QRUrl} size={200} />
                        {Ishost &&
                            <ContentHost socket={socket} room={room} />}
                    </div>
                    QR Code: {room}

                </div>
                <FooterUserList UserList={userList} />
            </div>}
            {gameState === "playing" && <Playing socket={socket} room={room} />}
            {gameState === "endgame" &&
                <div>
                    <h2 className="text-2xl font-bold mb-4">End Game  {room}</h2>
                    <div className="p-4">{score}</div>
                </div>}
        </div>

    );
}