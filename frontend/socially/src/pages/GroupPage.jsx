import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import axios from "axios";
import GroupListItem from "../components/GroupListItem";
import GroupSettingsModal from "../components/GroupSettingsModal";
import { X, Users, Lock, Globe, Plus, Trash2 } from "lucide-react";
import { useLoader } from "../context/loaderContext";
import { useAuth } from "../context/authContext";
import { showToast } from "../context/toastService";
import { useStoreContext } from "../context/storeContext";

const GroupPage = () => {
  const [groups, setGroups] = useState([
    // {
    //   id: 1,
    //   name: "Photography Enthusiasts",
    //   memberCount: "1.2K",
    //   postCount: "34",
    //   image: "/api/placeholder/48/48",
    // },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [privacySetting, setPrivacySetting] = useState("private");
  const [members, setMembers] = useState([]);
  const [inviteInput, setInviteInput] = useState("");
  const [isModal, SetIsModal] = useState(false);
  const [tempGroupId, settempGroupId] = useState();
  const { setIsLoading } = useLoader();

  const { user, logout } = useAuth(); // Get logged-in user from context
  const { groupData, updateGroupData } = useStoreContext();

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token"); // Get token from localStorage
        const response = await axios.get(
          process.env.REACT_APP_GET_GROUPS_API, // Replace with your API
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setGroups(response.data.data);
        updateGroupData(response.data.data);
        // console.log("Full API response:", response);
        // console.log("Response data:", response.data);
        // console.log("Groups data:", response.data.data);
      } catch (error) {
        logout();
        showToast(
          `${error.response.data.message} please log in again`,
          "error"
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchGroups(); // Fetch groups when the user is logged in
    }
  }, [user]); // Runs when the user state changes

  const addMember = () => {
    if (inviteInput && !members.includes(inviteInput)) {
      setMembers([...members, inviteInput]);
      setInviteInput("");
    }
  };

  const removeMember = (memberToRemove) => {
    setMembers(members.filter((member) => member !== memberToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newGroup = {
      id: groups.length + 1,
      name: groupName,
      memberCount: `${members.length} members`,
      postCount: "0",
      image: "/api/placeholder/48/48",
      members: members,
    };

    if (!groupName) {
      showToast("Please enter group name", "error");
      return;
    } else if (!description) {
      showToast("Please enter group description", "error");
      return;
    } else if (members.length < 1) {
      showToast("Please add members to your group", "error");
      return;
    }

    try {
      setShowModal(false);
      setIsLoading(true);
      // await new Promise((resolve, reject) => {
      //   setTimeout(() => {
      //     resolve("Done waiting for 5 seconds");
      //   }, 5000);
      // }).then(console.log);
      const token = localStorage.getItem("token"); // Get token from localStorage
      const response = await axios.post(
        process.env.REACT_APP_POST_GROUPS_API, // Replace with your API
        { groupName, description, image: "/api/placeholder/48/48", members },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      showToast(`${response.data.data.name} Group Created`, "success");
    } catch (error) {
      console.error("Error fetching groups:", error);
      showToast(
        error.response?.data?.message || "Error Fetching Data",
        "error"
      );
    } finally {
      setGroups((prevGroups) => [...prevGroups, newGroup]);
      setGroupName("");
      setDescription("");
      setMembers([]);
      setInviteInput("");
      setIsLoading(false);
      console.log(groups);
    }
  };

  const handleChange = (modalVal, id) => {
    SetIsModal(modalVal);
    settempGroupId(id);
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-white w-11/12 h-screen flex flex-col">
        <Header />
        <div className="mt-4 pt-4 flex justify-center items-center border-t border-gray-200">
          <div className="flex flex-col justify-center items-center">
            <p className="text-sm w-64 sm:w-full text-gray-600 font-medium italics">
              "Share your moments, connect with others, make memories last
              forever"
            </p>
            <div className="flex gap-2 mt-4 justify-center">
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
              <button
                onClick={() => setShowModal(true)}
                className="ml-auto bg-indigo-600 text-white px-1 py-1  md:py-3 md:px-4 rounded-lg"
              >
                Add Group
              </button>
            </div>

            <input
              type="search"
              placeholder="Search groups..."
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Groups List */}
          <div className="flex flex-col gap-4 py-4">
            {isModal && (
              <GroupSettingsModal
                modalHandle={handleChange}
                groupID={tempGroupId}
              />
            )}
            {groups.map((group) => (
              <GroupListItem
                key={group.id}
                group={group}
                modalState={isModal}
                modalHandle={handleChange}
                groupID={group.id}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-bold mb-6 text-center">
              Create New Group
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="groupName" className="block mb-2 font-medium">
                  Group Name
                </label>
                <input
                  id="groupName"
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="Enter group name"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="description" className="block mb-2 font-medium">
                  Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your group (optional)"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows="3"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">Privacy</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setPrivacySetting("private")}
                    className={`flex items-center justify-center py-3 rounded-lg border transition ${
                      privacySetting === "private"
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <Lock className="mr-2 w-5 h-5" />
                    Private
                  </button>
                  <button
                    type="button"
                    onClick={() => setPrivacySetting("public")}
                    className={`flex items-center justify-center py-3 rounded-lg border transition ${
                      privacySetting === "public"
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <Globe className="mr-2 w-5 h-5" />
                    Public
                  </button>
                </div>
              </div>

              <div>
                <label className="block mb-2 font-medium">Invite Members</label>
                <div className="flex">
                  <input
                    type="email"
                    value={inviteInput}
                    onChange={(e) => setInviteInput(e.target.value)}
                    placeholder="Enter email to invite"
                    className="flex-1 px-3 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={addMember}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-r-lg hover:bg-indigo-700"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>

                {members.length > 0 && (
                  <div className="mt-2">
                    <h4 className="text-sm font-medium mb-2">Added Members:</h4>
                    <ul className="space-y-2 max-h-20 overflow-auto">
                      {members.map((member) => (
                        <li
                          key={member}
                          className="flex justify-between items-center bg-gray-100 px-3 py-2 rounded-lg"
                        >
                          <span>{member}</span>
                          <button
                            type="button"
                            onClick={() => removeMember(member)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <button
                type="submit"
                onClick={handleSubmit}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition"
              >
                Create Group
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupPage;
