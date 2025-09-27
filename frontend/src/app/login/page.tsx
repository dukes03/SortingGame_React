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

    const handleLogin = () => {
        if (!name.trim()) return alert("กรุณากรอกชื่อ");
        localStorage.setItem("user", JSON.stringify({ name, id: Date.now().toString(36) }));
        router.push("/lobby" + (roomId ? `?roomId=${roomId}` : `?roomId=${roomid}`) + "&username=" + name);
    };
    const [isVisible, setIsVisibleInputRoomId] = useState(false);

    useEffect(() => {
        if (roomId) {
            setIsVisibleInputRoomId(false);
        } else {
            setIsVisibleInputRoomId(true);
        }
    }, [roomId]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center   ">

            <div className="bg-white p-8 rounded shadow-md  rounded-3xl    ">
                <h1 className=" xl:text-3xl sm:text-xl  font-bold mb-4 text-center  ">เข้าร่วมห้อง</h1>
                {isVisible && (

                    <div className="xl:text-xl sm:text-sm  font-bold  "> รหัสห้อง
                        <input
                            className="border px-3 py-2 w-full mb-3 rounded-lg  "
                            placeholder="รหัสห้อง"
                            value={roomid}
                            onChange={(e) => setroomid(e.target.value)}
                        />
                    </div>

                )}
                <div className="xl:text-xl sm:text-sm  font-bold  "> ชื่อ
                    <input
                        className="border px-3 py-2 w-full mb-3 rounded-lg"
                        placeholder="ชื่อของคุณ"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <button onClick={handleLogin} className="px-4 py-2 bg-blue-600 text-white rounded">
                        เข้าสู่ระบบ
                    </button>
                </div>
            </div>
        </div>
    );
}