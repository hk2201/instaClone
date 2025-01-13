import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Title from "../components/Title";

function GroupPage() {
  const chats = [
    { id: 1, name: "..." },
    { id: 2, name: "..." },
    { id: 3, name: "..." },
    { id: 1, name: "..." },
    { id: 2, name: "..." },
    { id: 3, name: "..." },
    { id: 1, name: "..." },
    { id: 2, name: "..." },
    { id: 3, name: "..." },
    
  ];

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white shadow-xl rounded-3xl border-2 size-11/12 flex flex-col">
        <Header />
      
        <div className="rounded w-full max-w-xl ">
          <div className="flex justify-center pb-10 ">
            
          </div>

          
          <div className="flex flex-col gap-4 w-full pt-10 pb-10 ">
            {chats.map((chat) => (
              <div
                className="shadow appearance-none border rounded w-full py-2 px-10 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                key={chat.id}
              >
                {chat.name}{" "}
              </div>
            ))}
            
          </div>
          
        </div>
        
      </div>
    </div>
  );
}
export default GroupPage;
