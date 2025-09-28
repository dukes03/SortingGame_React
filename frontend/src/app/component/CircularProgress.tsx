import React from "react";
import { useState, useEffect } from "react";

const CircularProgress = ({ size = 100, strokeWidth = 12, progress = 75, colorClassMain = "text-red-300", colorClasssub = "text-red-300", colorhex = "#f87171", colorhexsub = "#e5e7eb", textinner = "Test", textsub = "sub" }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const [offset, setoffset] = useState(circumference - (progress / 100) * circumference);

    useEffect(() => {
        setoffset(circumference - (progress / 100) * circumference);
    }, [progress]);

    return (
        <div className="relative flex items-center justify-center">
            <svg
                width={size}
                height={size}
                className="transform -rotate-90" // หมุนให้เริ่มจากด้านบน
            >
                {/* circle BG */}
                <circle
                    stroke={colorhexsub}
                    fill="transparent"
                    strokeWidth={strokeWidth}
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />
                {/* circle progress */}
                <circle
                    stroke={colorhex}
                    fill="transparent"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                    className="transition-all duration-500 ease-out"
                />
            </svg>
            {/* text */}
            <div className="absolute top-[30px] font-bold  flex flex-col items-center justify-center">
                <div className={` text-3xl  ${colorClassMain} `}>{textinner}</div>
                <div className={`text-sm  ${colorClasssub} `}>{textsub}</div>
            </div>
        </div>
    );
};

export default CircularProgress;
