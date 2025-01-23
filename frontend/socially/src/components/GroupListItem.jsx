import { Settings, ArrowRight, Bell } from "lucide-react";
import { useState } from "react";
const GroupListItem = ({ group, modalState, modalHandle }) => {
  const [isModal, SetIsModal] = useState(modalState);
  function handleClick() {
    SetIsModal(true);
    modalHandle(isModal);
  }
  return (
    <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-100">
      <div className="relative">
        <img
          src={group.image || "/api/placeholder/48/48"}
          alt={group.name}
          className="w-12 h-12 rounded-full object-cover border-2 border-indigo-100"
        />
        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
      </div>

      <div className="flex-1">
        <h3 className="font-semibold text-gray-800">
          {group.name || "Group Name"}
        </h3>
        <p className="text-sm text-gray-500">
          {group.memberCount || "25"} members • {group.postCount || "12"} posts
          today
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
          <Bell className="w-5 h-5" />
        </button>
        <button
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          onClick={handleClick}
        >
          <Settings className="w-5 h-5" />
        </button>
        <button className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors">
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default GroupListItem;
