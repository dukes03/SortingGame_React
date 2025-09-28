"use client";
import Image from "next/image";
import GlitterGravity from "./GlitterGravity";
import FullscreenButton from "./FullscreenButton";

export default function Home() {
  return (

    <div className="min-h-screen flex flex-col items-center justify-center     bgImage ">
      <div className="fixed inset-0 pointer-events-none z-0">
        <GlitterGravity />
      </div>
      <div className=" z-1 flex flex-col items-center justify-center space-y-8   items-stretch text-center   bg-white bg-opacity-80 px-30 py-10 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold mb-6"> Sorting Game</h1>
        <a href="/host" className="bg-amber-500 text-white text-3xl font-bold py-5 px-15  rounded-3xl hover:bg-amber-700 hover:rounded-full">
          Host
        </a>
        <a href="/login" className="bg-blue-500 text-white text-3xl font-bold py-5 px-15 rounded-3xl hover:bg-blue-700 hover:rounded-full">
          Login
        </a>
  
      </div>
         <FullscreenButton />
    </div>
  );
}
