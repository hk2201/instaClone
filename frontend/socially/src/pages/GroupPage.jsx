import React from "react";

function GroupPage() {
  const chats = [
    { id: 1, name: "Business Group" },
    { id: 2, name: "John Doe" },
    { id: 3, name: "Omkar Bodke" },
    { id: 4, name: "Harshad Khandare" },
    { id: 4, name: "Harshad Khandare" },
    { id: 4, name: "Harshad Khandare" },
    { id: 4, name: "Harshad Khandare" },
    { id: 4, name: "Harshad Khandare" },
    { id: 4, name: "Harshad Khandare" },
    { id: 4, name: "Harshad Khandare" },
    { id: 4, name: "Harshad Khandare" },
    { id: 4, name: "Harshad Khandare" },
    { id: 4, name: "Harshad Khandare" },
    { id: 4, name: "Harshad Khandare" },
    { id: 4, name: "Harshad Khandare" },
  ];

  return (
    <div className="flex justify-center items-center h-screen white-100">
      <div class="bg-white shadow-xl rounded-3xl border-2 size-11/12 flex justify-center items-center ">
        <div className="rounded w-full max-w-xl">
          <div className="flex justify-center pb-10 ">
            <h1 text-3xl font-black font-cursive text-gray-800>
              Hello Sociophiless !!!
            </h1>
          </div>

          <p>Welcome to your Social Zone , Keep Chatting !!</p>
          <div className="flex flex-col gap-4 w-full">
            {chats.map((chat) => (
              <div
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
