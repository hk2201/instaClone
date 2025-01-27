import React, { useState } from "react";
import { MessageCircle, LogOut, User, Settings } from "lucide-react";
import { CirclePlus } from "lucide-react";
function Footer() {
  return (
    <div className="flex justify-center items-center w-full px-4 sm:space-x-60 space-x-10 border-t border-gray-200">
      {/* Profile Button */}
      <button className="p-2 sm:p-3 text-gray-600 hover:bg-gray-100 rounded-full transition-colors group">
        <User className="w-8 sm:w-10 h-8 sm:h-10 group-hover:text-indigo-600" />
      </button>

      {/* Direct Message Button */}
      <button className="relative p-2 sm:p-3 text-gray-600 hover:bg-gray-100 rounded-full transition-colors group">
        <MessageCircle className="w-8 sm:w-10 h-8  sm:h-10 group-hover:text-indigo-600" />
        <span className="absolute top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
          3
        </span>
      </button>
      <button
        className="bg-indigo-600 md:p-2 rounded-full shadow-lg hover:shadow-xl hover:bg-indigo-700 transition-all duration-300 hover:scale-105 group z-50"
        onClick={() => console.log("Add post clicked")}
        aria-label="Add new post"
      >
        <CirclePlus className="text-white" size={36} />
        <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
          Add New Post
        </span>
      </button>

      {/* Settings Button */}
      <button className="p-2 sm:p-3 text-gray-600 hover:bg-gray-100 rounded-full transition-colors group">
        <Settings className="w-8 sm:w-10 h-8  sm:h-10 group-hover:text-indigo-600" />
      </button>

      {/* Logout Button */}
      <button className="p-2 sm:p-3 text-gray-600 hover:bg-red-100 hover:text-red-600 rounded-full transition-colors group">
        <LogOut className="w-8 sm:w-10 h-8  sm:h-10 group-hover:text-red-600" />
      </button>
    </div>
  );
}

export default Footer;
