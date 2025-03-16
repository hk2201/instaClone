import React, { useEffect, useState } from "react";
import { X, Upload, Camera, Plus, Trash2, Users, UserPlus } from "lucide-react"; // Using Lucide for icons
import { useStoreContext } from "../context/storeContext";
import { useLoader } from "../context/loaderContext";
import MemberList from "../components/MemberList";

const GroupSettingsModal = ({ modalHandle, groupID }) => {
  const [activeTab, setActiveTab] = useState("basicInfo");
  const [activeMemberTab, setActiveMemberTab] = useState("current");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [inviteInput, setInviteInput] = useState("");
  const [groupInfo, setGroupInfo] = useState({
    id: groupID,
    name: "",
    description: "",
    location: "",
    category: "",
    image: null,
  });
  const [newmembers, setNewMembers] = useState([]);
  const { groupData, updateGroupData } = useStoreContext();
  const { setIsLoading } = useLoader();
  const { updateCurrentGroup, updateMembers, updateNewMembers, currentGroup } =
    useStoreContext();

  const tabs = [
    { id: "basicInfo", label: "Group Info." },
    { id: "memberManagement", label: "Member Management" },
    { id: "privacy", label: "Privacy" },
    { id: "notifications", label: "Notifications" },
    { id: "actions", label: "Group Actions" },
  ];

  useEffect(() => {
    // Check if groupData is an array before calling map

    if (Array.isArray(groupData)) {
      const currentGroup = groupData.find((g) => g.id === groupID);
      if (currentGroup) {
        // You could also update the form with this data
        setGroupInfo({
          id: currentGroup.id,
          name: currentGroup.name || "",
          description: currentGroup.description || "",
          location: currentGroup.location || "",
          category: currentGroup.category || "",
          image: currentGroup.image || null,
        });

        updateMembers(currentGroup.members);
        updateCurrentGroup(groupInfo);
      }
    }
  }, []);

  const addMember = () => {
    if (inviteInput && !newmembers.includes(inviteInput)) {
      setNewMembers([...newmembers, inviteInput]);
      setInviteInput("");
    }
  };

  const AddNewMembers = () => {
    updateNewMembers(newmembers, currentGroup.id);
    setNewMembers([]);
  };

  const removeMember = (memberToRemove) => {
    setNewMembers(newmembers.filter((member) => member !== memberToRemove));
  };
  const handleChange = () => {
    modalHandle(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setGroupInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setGroupInfo((prev) => ({
        ...prev,
        image: URL.createObjectURL(file),
      }));
    }
  };

  const handleSaveChanges = async () => {
    await updateGroupData(groupInfo);
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white w-full max-w-4xl h-[90vh] rounded-lg shadow-lg flex flex-col md:flex-row relative overflow-hidden">
        {/* Mobile Header with Menu Toggle */}
        <div className="md:hidden flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Settings</h2>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-gray-600 hover:text-gray-900"
          >
            {isMobileMenuOpen ? "Close" : "Menu"}
          </button>
        </div>

        {/* Side Menu - Responsive */}
        <div
          className={`
          ${isMobileMenuOpen ? "block" : "hidden"}
          md:block md:w-1/4 bg-gray-100 border-r rounded-l-lg p-4 
          absolute md:relative top-0 left-0 w-full h-full z-10 
          overflow-y-auto bg-white md:bg-gray-100
        `}
        >
          <h2 className="text-lg font-semibold mb-4 hidden md:block">
            Settings
          </h2>
          <ul className="space-y-2">
            {tabs.map((tab) => (
              <li key={tab.id}>
                <button
                  onClick={() => {
                    setActiveTab(tab.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 rounded-lg ${
                    activeTab === tab.id
                      ? "bg-indigo-600 text-white"
                      : "bg-white text-gray-800 hover:bg-gray-200"
                  }`}
                >
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Content Area - Responsive */}
        <div className="flex-1 p-6 overflow-y-auto relative">
          <button
            onClick={handleChange}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
          >
            <X className="w-6 h-6" />
          </button>

          {activeTab === "basicInfo" && (
            <div>
              <h3 className="text-xl font-bold mb-4">Basic Group Info.</h3>
              <div className="space-y-6">
                {/* Group Image */}
                <div className="flex flex-col items-center mb-6">
                  <div className="relative w-32 h-32 mb-2">
                    {groupInfo.image ? (
                      <img
                        src={groupInfo.image}
                        alt="Group"
                        className="w-32 h-32 rounded-full object-cover border-2 border-gray-200"
                      />
                    ) : (
                      <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center border-2 border-gray-300">
                        <Camera className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                    <label
                      htmlFor="group-image"
                      className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full cursor-pointer hover:bg-indigo-700"
                    >
                      <Upload className="w-4 h-4" />
                      <input
                        type="file"
                        id="group-image"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                    </label>
                  </div>
                  <p className="text-sm text-gray-500">
                    Upload group image (recommended size: 200x200)
                  </p>
                </div>

                {/* Group Name */}
                <div className="mb-4">
                  <label
                    htmlFor="name"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Group Name*
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={groupInfo.name}
                    onChange={handleInputChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                    placeholder="Enter group name"
                    required
                  />
                </div>

                {/* Group Description */}
                <div className="mb-4">
                  <label
                    htmlFor="description"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows="4"
                    value={groupInfo.description}
                    onChange={handleInputChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                    placeholder="Describe what your group is about"
                  ></textarea>
                  <p className="mt-1 text-sm text-gray-500">
                    Brief description helps potential members understand your
                    group's purpose
                  </p>
                </div>

                {/* Location */}
                {/* <div className="mb-4">
                  <label
                    htmlFor="location"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Location
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={groupInfo.location}
                    onChange={handleInputChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                    placeholder="City, Country or 'Online'"
                  />
                </div> */}

                {/* Category */}
                {/* <div className="mb-6">
                  <label
                    htmlFor="category"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={groupInfo.category}
                    onChange={handleInputChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                  >
                    <option value="">Select a category</option>
                    <option value="technology">Technology</option>
                    <option value="education">Education</option>
                    <option value="gaming">Gaming</option>
                    <option value="health">Health & Wellness</option>
                    <option value="business">Business & Networking</option>
                    <option value="hobby">Hobbies & Interests</option>
                    <option value="social">Social</option>
                    <option value="other">Other</option>
                  </select>
                </div> */}

                {/* Save Button */}
                <div className="flex justify-end">
                  <button
                    onClick={handleSaveChanges}
                    className="px-6 py-2.5 bg-indigo-600 text-white font-medium text-sm rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "memberManagement" && (
            <div className="p-4 rounded-lg">
              <h3 className="text-xl font-bold mb-4">Member Management</h3>

              {/* Tab navigation */}
              <div className="flex mb-4 border-b">
                <button
                  className={`flex items-center gap-1 px-4 py-2 font-medium ${
                    activeMemberTab === "current"
                      ? "border-b-2 border-indigo-600 text-indigo-600"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                  onClick={() => setActiveMemberTab("current")}
                >
                  <Users className="w-4 h-4" />
                  <span>Current Members</span>
                </button>
                <button
                  className={`flex items-center gap-1 px-4 py-2 font-medium ${
                    activeMemberTab === "invite"
                      ? "border-b-2 border-indigo-600 text-indigo-600"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                  onClick={() => setActiveMemberTab("invite")}
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Invite New</span>
                </button>
              </div>

              {/* Current members tab */}
              {activeMemberTab === "current" && (
                <div>
                  <div className="mb-4">
                    <div className="relative">
                      <input
                        type="search"
                        placeholder="Search members..."
                        className="w-full px-3 py-2 pl-10 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white shadow-sm"
                      />
                      <svg
                        className="absolute left-3 top-3 text-gray-400"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                      </svg>
                    </div>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    <MemberList />
                  </div>
                </div>
              )}

              {/* Invite members tab */}
              {activeMemberTab === "invite" && (
                <div>
                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <label className="block mb-2 font-medium text-gray-700">
                      Invite New Members
                    </label>
                    <div className="flex mb-3">
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
                        className="bg-indigo-600 text-white px-4 py-2 rounded-r-lg hover:bg-indigo-700 transition-colors"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>

                    {newmembers.length > 0 && (
                      <div className="mt-2">
                        <h4 className="text-sm font-medium mb-2 text-gray-700">
                          Members to invite:
                        </h4>
                        <ul className="space-y-2 max-h-32 overflow-y-auto">
                          {newmembers.map((member) => (
                            <li
                              key={member}
                              className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded-lg"
                            >
                              <span className="text-gray-800">{member}</span>
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

                    <div className="mt-4">
                      <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                        onClick={AddNewMembers}
                      >
                        <UserPlus className="w-5 h-5" />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "privacy" && (
            <div>
              <h3 className="text-xl font-bold mb-4">Privacy Settings</h3>
              <p>Set your group's privacy to public or private.</p>
            </div>
          )}

          {activeTab === "notifications" && (
            <div>
              <h3 className="text-xl font-bold mb-4">Notifications</h3>
              <p>Customize how you receive notifications from the group.</p>
            </div>
          )}

          {activeTab === "actions" && (
            <div>
              <h3 className="text-xl font-bold mb-4">Group Actions</h3>
              <p>
                Perform group-level actions like deleting the group or leaving
                it.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GroupSettingsModal;
