import React, { useState } from "react";
import { Users } from "lucide-react";
import Header from "../components/Header";
import GroupListItem from "../components/GroupListItem";
import GroupSettingsModal from "../components/GroupSettingsModal";

const GroupPage = () => {
  const [groups, setGroups] = useState([
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
  ]);

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [availableUsers] = useState([
    "Alice",
    "Bob",
    "Charlie",
    "David",
    "Eve",
    "Grace",
  ]); // Example users
  const [typedMember, setTypedMember] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isModal, SetIsModal] = useState(false);

  // Add member by typing
  const handleAddMember = () => {
    if (
      availableUsers.some(
        (user) => user.toLowerCase() === typedMember.toLowerCase()
      )
    ) {
      if (!selectedUsers.includes(typedMember)) {
        setSelectedUsers((prev) => [...prev, typedMember]);
        setTypedMember("");
      } else {
        alert("Member is already added!");
      }
    } else {
      alert("User not found!");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newGroup = {
      id: groups.length + 1,
      name: formData.name,
      memberCount: `${selectedUsers.length} members`,
      postCount: "0",
      image: "/api/placeholder/48/48",
      members: selectedUsers,
    };

    setGroups((prevGroups) => [...prevGroups, newGroup]);
    setShowModal(false);
    setFormData({ name: "", description: "" });
    setTypedMember("");
    setSelectedUsers([]);
  };

  const handleChange = (modalVal) => {
    SetIsModal(modalVal);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-xl rounded-3xl border-2 w-11/12 h-screen flex flex-col">
        <Header />
        <div className="mt-4 pt-4 flex justify-center items-center border-t border-gray-200">
          <div>
            <p className="text-sm text-gray-600 font-medium italics">
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
              <button
                onClick={() => setShowModal(true)}
                className="ml-auto bg-indigo-600 text-white px-4 py-2 rounded-lg"
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
            console.log(isModal);
            {isModal ? (
              <GroupSettingsModal modalHandle={handleChange} />
            ) : (
              groups.map((group) => (
                <GroupListItem
                  key={group.id}
                  group={group}
                  modalState={isModal}
                  modalHandle={handleChange}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Add Group</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Group Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                ></textarea>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="members"
                  className="block text-sm font-medium text-gray-700"
                >
                  Invite Members
                </label>
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="text"
                    value={typedMember}
                    onChange={(e) => setTypedMember(e.target.value)}
                    placeholder="Type member name"
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddMember}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
                  >
                    Add
                  </button>
                </div>
                <div className="mt-4">
                  {selectedUsers.map((user) => (
                    <span
                      key={user}
                      className="text-sm bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full mr-2"
                    >
                      {user}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
                >
                  Add Group
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupPage;
