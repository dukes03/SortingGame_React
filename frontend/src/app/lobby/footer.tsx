import React from 'react';
import PlayerCard from "./PlayerCard";
import { FaRegUser } from "react-icons/fa";
function FooterUserList({ UserList, Username, Hostname }: { UserList: string[], Username: string, Hostname: string }) {
    return (
        <div className="    items-center  justify-center mt-4    " >
            <footer >
                <div className="    flex flex-row  items-center  justify-center mb-2  ">
                    <strong className=' text-2xl text-bold'>Players    </strong>

                    <div className=" flex flex-row m-3 text-xl text-bold  py-3  px-8 bg-sky-50  items-center  shadow-xl  rounded-full ">
                        <FaRegUser />
                        <strong className="mx-3">  {UserList.length}    </strong>
                    </div>
                </div>
                <div className="overflow-y-scroll md:overflow-y-visible h-64">
                    <div className="m-4 p-3   rounded flex flex-wrap justify-center gap-3  ">


                        {UserList.map((user, i) => (
                            <PlayerCard key={i} name={user} avatar={`https://ui-avatars.com/api/?name=${user}&background=random&size=32`} isYou={user == Username} isHost={Hostname == user} />

                        ))}

                    </div></div>
            </footer>
        </div>
    );
}
export default FooterUserList;