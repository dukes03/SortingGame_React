"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

export default function LoginPage() {
    const searchParams = useSearchParams();

    const [name, setName] = useState("");
    const [roomid, setroomid] = useState("");
    const roomId = searchParams.get("roomId"); // ✅ ดึงค่าจาก query ได้ตรง ๆ
    const router = useRouter();



    return (
        <div className="max-w-md mx-auto p-6">
            <h2 className="text-2xl font-bold mb-4">Lobby  {roomId}</h2>
            <div className="max-w-md mx-auto p-6">
                QR Code: {roomId}
                <button className="px-4 py-2 bg-blue-600 text-white rounded">GameSetUP</button>
                 <button className="px-4 py-2 bg-blue-600 text-white rounded">Stay as Moderator</button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded">Start Game</button>
            </div>

            <footer className="text-center mt-4 text-gray-500">
             <div>player</div>
                <div>playercard</div>
            </footer>
        </div>

    );
}