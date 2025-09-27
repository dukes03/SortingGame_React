import React from 'react';
import PlayerCard from "./PlayerCard";
function FooterUserList({ UserList }: { UserList: string[] }) {
    return (
        <div>
            <footer className="text-center mt-4 text-gray-500">
                <strong>👤 ผู้ใช้งาน ({UserList.length}):</strong>
                <div className="mb-4 p-3   rounded flex flex-wrap justify-center gap-3 shadow-md">
               
                 
                        {UserList.map((user, i) => (
                            <PlayerCard key={i} name={user} avatar={`https://ui-avatars.com/api/?name=${user}&background=random&size=32`} isYou={true} />
                            
                        ))}
                   
                </div>
            </footer>
        </div>
    );
}
export default FooterUserList;