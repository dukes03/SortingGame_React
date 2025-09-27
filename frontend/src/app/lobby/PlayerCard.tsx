import React from "react";

const PlayerCard = ({ name, avatar, isYou }: { name: string, avatar: string, isYou: boolean; }) => {
    return (
        <div className="relative " >    {isYou && (
            <span className="  absolute -z-1 -top-5 -left-0    text-xs bg-red-400 text-white px-5 py-5 rounded-md  flex justify-center items-center">
                <span className="absolute -z-1 -top-0.5">  You</span>
            </span>
        )}
            <div
                className={`flex  justify-items-start items-center   px-5 py-2 rounded-full shadow-xl z-3 ${isYou ? "bg-red-100" : "bg-white"
                    }`}
            >
                {/* Avatar */}
                <img
                    src={avatar}
                    alt={name}
                    className="w-8 h-8 rounded-full border border-gray-300 z-2"
                />

                {/* Name */}
                <span className="text-sm px-3 font-medium text-gray-800 z-2 ">{name}</span>

                {/* Badge "You" */}

            </div>
        </div>
    );
};

export default PlayerCard;
