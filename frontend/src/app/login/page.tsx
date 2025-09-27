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

            <div className="bg-white p-8 rounded shadow-2xl   rounded-3xl  items-center  ">
                <h1 className=" xl:text-3xl sm:text-xl  font-bold mb-4 text-center  ">เข้าร่วมห้อง</h1>
                {isVisible && (

                    <div className="xl:text-xl sm:text-sm  font-bold    flex justify-between  "> รหัสห้อง
                        <input
                            className="border-1 border-dashed border-gray-400 shadow-lg mx-3 px-3 py-2 w-90 mb-3 rounded-xl bg-gray-100 "
                            placeholder="รหัสห้อง"
                            value={roomid}
                            onChange={(e) => setroomid(e.target.value)}
                        />
                    </div>

                )}
                <div className="xl:text-xl sm:text-sm  font-bold  flex justify-between   "> ชื่อผู้เล่น
                    <input
                        className="border-1 border-dashed border-gray-400 shadow-lg px-3 py-2 mx-3 w-90 mb-3 rounded-xl bg-gray-100"
                        placeholder="ชื่อของคุณ"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                </div>
                <div className="flex justify-center items-center ">
                    <button onClick={handleLogin} className="xl:text-2xl sm:text-lg  hover:scale-95  active:scale-90  shadow-2xl p-4  bg-orange-500 text-white w-50 rounded-2xl">
                        เข้าร่วมห้อง
                    </button></div>
            </div>
        </div>
    );
}