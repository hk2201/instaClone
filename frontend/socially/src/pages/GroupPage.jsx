import React from "react";

function GroupPage(){
    const chats = [
        {id:1, name:'Business Group'},
        {id:2, name:'John Doe'},
        {id:3, name:'Omkar Bodke'},
        {id:4, name:'Harshad Khandare' }
    ];

    return (
        <div className="flex justify-center items-center h-screen white-100">
            <header>
                <h1 text-3xl font-black  font-cursive text-gray-800>Hello Sociophiless !!!</h1>
                <p>Welcome to your Social Zone , Keep Chatting !!</p>
            </header>
            <div className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                {chats.map((chat) => (<div key ={chat.id}>
                  {chat.name}  </div>))}
            </div>
        </div>
        
    );

};
export default GroupPage;