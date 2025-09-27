import Image from "next/image";
import GlitterGravity from "./GlitterGravity";
export default function Home() {
  return (

    <div className="min-h-screen flex flex-col items-center justify-center     bgImage ">
     <div className="fixed inset-0 pointer-events-none z-0">
        <GlitterGravity />
      </div>
        <a href="/login" className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700">
          login
        </a>
        <a href="/login" className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700">
          host
        </a>
        
      </div>
  );
}
 