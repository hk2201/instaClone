import React, { useState } from "react";
import { MessageCircle, LogOut, User, Settings } from "lucide-react";

function Footer() {
  return (
    <div className="flex justify-center items-center w-full px-4 sm:space-x-60 space-x-10">
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
