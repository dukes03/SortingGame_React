import React from 'react';

function FooterUserList({ UserList }: { UserList: string[] }) {
    return (
        <div>
            <footer className="text-center mt-4 text-gray-500">
                <div>player</div>
                <div>playercard</div>

                <div className="mb-4 p-3 bg-gray-100 rounded">
                    <strong>👤 ผู้ใช้งาน ({UserList.length}):</strong>
                    <ul className="list-disc ml-6">
                        {UserList.map((user, i) => (
                            <li key={i}>{user}</li>
                        ))}
                    </ul>
                </div>
            </footer>
        </div>
    );
}
export default FooterUserList;