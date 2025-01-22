import React from "react";
import { Users } from "lucide-react";
import Header from "../components/Header";
import GroupListItem from "../components/GroupListItem";

const GroupPage = () => {
  const groups = [
    {
      id: 1,
      name: "Photography Enthusiasts",
      memberCount: "1.2K",
      postCount: "34",
      image: "/api/placeholder/48/48",
    },
    {
      id: 2,
      name: "Travel & Adventure",
      memberCount: "856",
      postCount: "15",
      image: "/api/placeholder/48/48",
    },
    {
      id: 3,
      name: "Food Lovers Club",
      memberCount: "2.5K",
      postCount: "67",
      image: "/api/placeholder/48/48",
    },
  ];

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-xl rounded-3xl border-2 w-11/12 h-screen flex flex-col">
        <Header />
        <div className="mt-4 pt-4 flex justify-center items-center border-t border-gray-200">
          <div>
            <p className="text-sm text-gray-600 font-medium itali">
              "Share your moments, connect with others, make memories last
              forever"
            </p>
            <div className="flex gap-2 mt-2 justify-center">
              <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full">
                #ShareMoments
              </span>
              <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full">
                #ConnectDaily
              </span>
              <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full">
                #CaptureLife
              </span>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6">
          <div className="sticky top-0 pt-6 pb-4 bg-white">
            <div className="flex items-center gap-4 mb-6">
              <h2 className="text-2xl font-bold text-gray-800">My Groups</h2>
              <div className="flex items-center gap-2 text-gray-500">
                <Users className="w-5 h-5" />
                <span className="text-sm font-medium">
                  {groups.length} Groups
                </span>
              </div>
            </div>

            <input
              type="search"
              placeholder="Search groups..."
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Groups List */}
          <div className="flex flex-col gap-4 py-4">
            {groups.map((group) => (
              <GroupListItem key={group.id} group={group} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupPage;
