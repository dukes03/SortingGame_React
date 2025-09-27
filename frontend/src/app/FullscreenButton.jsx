import React from "react";
import { BsArrowsFullscreen } from "react-icons/bs";

export default function FullscreenButton() {
    const handleFullscreen = () => {
        const elem = document.documentElement; // ทั้งหน้าเว็บ

        if (!document.fullscreenElement) {
            elem.requestFullscreen?.();
        } else {
            document.exitFullscreen?.();
        }
    };

    return (
        <button
            onClick={handleFullscreen}
            className="
        fixed bottom-6 right-6 z-50
        bg-sky-500 text-white rounded-full shadow-lg
        p-4 flex items-center justify-center
        hover:bg-sky-400 active:scale-95
        transition-all duration-200
      "
            aria-label="Toggle fullscreen"
        >
            <BsArrowsFullscreen />

        </button>
    );
}
