import React, { useEffect, useState } from "react";
import { Trash2, Shield, ShieldCheck } from "lucide-react";
import axios from "axios";
import { useLoader } from "../context/loaderContext";
import { showToast } from "../context/toastService";
import { useStoreContext } from "../context/storeContext";

const MemberList = () => {
  // Track confirmation state per member using their unique IDs
  const [membersToDelete, setMembersToDelete] = useState({});
  const { setIsLoading } = useLoader();
  const { members, currentGroup, updateMembers } = useStoreContext();

  const handleDeleteClick = (memberId) => {
    setMembersToDelete((prev) => ({
      ...prev,
      [memberId]: true,
    }));
  };

  const handleCancelDelete = (memberId) => {
    setMembersToDelete((prev) => {
      const updated = { ...prev };
      delete updated[memberId];
      return updated;
    });
  };

  const handleSubmit = async (member) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        process.env.REACT_APP_DELETE_GROUP_MEMBER,
        {
          data: { groupId: currentGroup.id, member },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      updateMembers(response.data.data);
      showToast(`${member.name} deleted`, "success");

      // Clean up the confirmation state for this member
      handleCancelDelete(member.id);
    } catch (error) {
      showToast(`${error.response.data.message}`, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdmin = async (member) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        process.env.REACT_APP_UPDATE_ADMIN,
        { groupId: currentGroup.id, member },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      updateMembers(response.data.data);
      showToast(`${member.name} role updated`, "success");

      // Clean up the confirmation state for this member
      handleCancelDelete(member.id);
    } catch (error) {
      showToast(`${error.response.data.message}`, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {members.map((member) => (
        <div
          key={member.id}
          className="flex items-center gap-2 bg-white p-2 rounded-lg shadow-sm hover:shadow transition-all border border-gray-100 mb-2"
        >
          <div className="relative">
            <img
              src={member.image || "/api/placeholder/40/40"}
              alt={member.name}
              className="w-9 h-9 rounded-full object-cover border border-indigo-100"
            />
            <div
              className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 ${
                member.isOnline ? "bg-green-500" : "bg-gray-400"
              } rounded-full border border-white`}
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <h3 className="font-medium text-gray-800 text-md truncate">
                {member.name || "Member Name"}{" "}
                {member.lastname || "Member Lastname"}
              </h3>
              {member.role === "ADMIN" && (
                <span className="px-1.5 py-0.4 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full">
                  Admin
                </span>
              )}
            </div>
            {/* <p className="text-xs text-gray-500 truncate">
              {member.role || ""}
            </p> */}
          </div>

          <div className="flex items-center gap-1">
            <button
              className={`p-1.5 rounded-full transition-colors ${
                member.role === "ADMIN"
                  ? "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
              title={
                member.role === "ADMIN"
                  ? "Remove admin privileges"
                  : "Make admin"
              }
              onClick={() => handleAdmin(member)}
            >
              {member.role === "ADMIN" ? (
                <ShieldCheck className="w-4 h-4" />
              ) : (
                <Shield className="w-4 h-4" />
              )}
            </button>

            {membersToDelete[member.id] ? (
              <div className="flex items-center gap-1 bg-red-50 rounded-full px-1.5 py-0.5">
                <button
                  onClick={() => handleCancelDelete(member.id)}
                  className="text-xs text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <span className="text-gray-400 text-xs">|</span>
                <button
                  className="text-xs text-red-600 hover:text-red-800"
                  onClick={() => handleSubmit(member)}
                >
                  Confirm
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleDeleteClick(member.id)}
                className="p-1.5 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-full transition-colors group"
                title="Remove member"
              >
                <Trash2 className="w-4 h-4 group-hover:text-red-600" />
              </button>
            )}
          </div>
        </div>
      ))}
    </>
  );
};

export default MemberList;
