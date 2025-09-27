import React, { useState } from "react";
import { BsDoorOpen } from "react-icons/bs";
import { useRouter } from "next/navigation";
const Navbar = () => {
    const router = useRouter();

    const leaveLobby = () => { router.push("/"); };

    return (
        <nav className="bg-neutral-900   shadow-md ">
            <div className=" mx-auto  lg:p-1 sm:px-6 lg:px-8">
                <div className="flex justify-between h-10">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center bg-yellow-400  my-1 px-2  rounded-lg shadow-md">
                        <span className="font-bold text-[13px]">NBG</span>
                    </div>

                    <button
                        className=" text-neutral-400  px-4 rounded-lg flex items-center space-x-2      "
                        onClick={leaveLobby}
                    >
                        <BsDoorOpen />
                        <span>Leave Lobby</span>
                    </button>
                </div>
            </div>


        </nav>
    );
};

export default Navbar;
