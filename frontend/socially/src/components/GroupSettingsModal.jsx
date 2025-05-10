import React, { useEffect, useState, useRef } from "react";
import {
  X,
  Upload,
  Camera,
  Plus,
  Trash2,
  Users,
  UserPlus,
  Group,
} from "lucide-react"; // Using Lucide for icons
import { useStoreContext } from "../context/storeContext";
// import { useLoader } from "../context/loaderContext";
import MemberList from "../components/MemberList";
import { useAuth } from "../context/authContext";
import "cropperjs/dist/cropper.css";
import Cropper from "react-cropper";
import { usePostContext } from "../context/postContext";

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
  const {
    groupData,
    updateGroupData,
    updateCurrentGroup,
    updateMembers,
    updateNewMembers,
    currentGroup,
  } = useStoreContext();
  // const { setIsLoading } = useLoader();
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isCropping, setIsCropping] = useState(false);
  const cropperRef = useRef(null);
  const { addProfileImage } = usePostContext();

  const tabs = [
    { id: "basicInfo", label: "Group Info." },
    { id: "memberManagement", label: "Member Management" },
    { id: "privacy", label: "Privacy" },
    { id: "notifications", label: "Notifications" },
    // { id: "actions", label: "Group Actions" },
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

        const getInfo = () => {
          return currentGroup.members.find(
            (member) => member.email === user.email
          );
        };

        const validateLoggedAdmin = getInfo();

        if (validateLoggedAdmin && validateLoggedAdmin.role === "ADMIN") {
          setIsAdmin(true);
        }
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
    // const file = e.target.files[0];
    // if (file) {
    //   setGroupInfo((prev) => ({
    //     ...prev,
    //     image: URL.createObjectURL(file),
    //   }));
    // }

    const file = e.target.files[0];
    if (file) {
      const imageBlob = URL.createObjectURL(file);
      setSelectedImage(imageBlob);
      // Hide the edit modal and show the cropping modal
      // setIsEditing(false);
      setIsCropping(true);
    }
  };

  const handleCrop = async () => {
    if (cropperRef.current) {
      const croppedImageData = cropperRef.current.cropper
        .getCroppedCanvas()
        .toDataURL();
      const imageURL = await addProfileImage(croppedImageData);
      setGroupInfo({ ...groupInfo, image: imageURL });
      // Close the cropping modal
      setSelectedImage(null);
      setIsCropping(false);
      // Reopen the edit modal
      // setIsEditing(true);
    }
  };

  const handleCancelCrop = () => {
    setSelectedImage(null);
    setIsCropping(false);
    // setIsEditing(true);
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

                {isCropping && selectedImage && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                      <h2 className="text-xl font-semibold text-center mb-4">
                        Crop Your Group Picture
                      </h2>
                      <div className="w-full overflow-hidden rounded-lg border border-gray-300 shadow-sm">
                        <Cropper
                          src={selectedImage}
                          style={{ height: 300, width: "100%" }}
                          aspectRatio={1}
                          guides={true}
                          ref={cropperRef}
                          viewMode={2}
                        />
                      </div>
                      <div className="flex justify-between w-full mt-4">
                        <button
                          onClick={handleCancelCrop}
                          className="bg-gray-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-600 transition-all duration-300"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleCrop}
                          className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-indigo-700 transition-all duration-300"
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  </div>
                )}

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
                <button
                  className={`flex items-center gap-1 px-4 py-2 font-medium ${
                    activeMemberTab === "Group Actions"
                      ? "border-b-2 border-indigo-600 text-indigo-600"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                  onClick={() => setActiveMemberTab("Group Actions")}
                >
                  <Group className="w-5 h-5" />
                  <span>Group Actions</span>
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
              {activeMemberTab === "Group Actions" && (
                <div>
                  {/* <h4 className="text-lg font-semibold mb-3 text-red-600 border-b border-red-200 pb-2">
                    Danger Zone
                  </h4> */}
                  <div className="space-y-4 flex justify-center pt-5">
                    {/* <button
                      className="w-full py-2 px-4 bg-red-600 text-white rounded hover:bg-red-700 flex items-center justify-center"
                      // onClick={handleArchiveGroup}
                    >
                      <span className="mr-2">Archive Group</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
                        <path
                          fillRule="evenodd"
                          d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button> */}
                    {isAdmin ? (
                      <div className="flex flex-col space-y-3 w-full items-center">
                        <h3 className="font-semibold text-gray-700 mb-1">
                          Admin Controls
                        </h3>
                        <button
                          className="w-3/4 py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center justify-center transition-colors duration-200"
                          // onClick={handleDeleteGroup}
                        >
                          <span className="mr-2">Delete Group</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                        <div className="w-3/4 flex items-center my-2">
                          <div className="flex-grow border-t border-gray-300"></div>
                          <span className="px-3 text-sm text-gray-500">OR</span>
                          <div className="flex-grow border-t border-gray-300"></div>
                        </div>
                        <button
                          className="w-3/4 py-2 px-4 bg-gray-600 text-white rounded-md hover:bg-gray-700 flex items-center justify-center transition-colors duration-200"
                          // onClick={handleLeaveGroup}
                        >
                          <span className="mr-2">Leave Group</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm11 4.5a.5.5 0 00-.5-.5h-5a.5.5 0 000 1h3.8l-3.15 3.15a.5.5 0 00.7.7L13 8.71V12.5a.5.5 0 001 0v-5z"
                            />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <div className="flex w-full items-center justify-center">
                        <button
                          className="w-3/4 py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center justify-center transition-colors duration-200"
                          // onClick={handleLeaveGroup}
                        >
                          <span className="mr-2">Leave Group</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm11 4.5a.5.5 0 00-.5-.5h-5a.5.5 0 000 1h3.8l-3.15 3.15a.5.5 0 00.7.7L13 8.71V12.5a.5.5 0 001 0v-5z"
                            />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
          {activeTab === "privacy" && (
            <div>
              <h3 className="text-xl font-bold mb-4">Privacy Settings</h3>
              <p>
                Set your group's privacy to public or private. (Feature to be
                added later)
              </p>
            </div>
          )}
          {activeTab === "notifications" && (
            <div>
              <h3 className="text-xl font-bold mb-4">Notifications</h3>
              <p>
                Customize how you receive notifications from the group. (Feature
                to be added later)
              </p>
            </div>
          )}
          {activeTab === "actions" && (
            <div className="p-4">
              <h3 className="text-xl font-bold mb-4">Group Actions</h3>
              <p className="mb-6 text-gray-600">
                Perform group-level actions like deleting the group or leaving
                it.
              </p>

              {/* Member Actions Section */}
              <div className="mb-8">
                <h4 className="text-lg font-semibold mb-3 border-b pb-2">
                  Member Actions
                </h4>
                <div className="space-y-4">
                  <button
                    className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center justify-center"
                    // onClick={handleInviteMembers}
                  >
                    <span className="mr-2">Invite New Members</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                    </svg>
                  </button>

                  {
                    <button
                      className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center justify-center"
                      // onClick={handleManageMembers}
                    >
                      <span className="mr-2">Manage Members</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                      </svg>
                    </button>
                  }

                  <button
                    className="w-full py-2 px-4 bg-yellow-600 text-white rounded hover:bg-yellow-700 flex items-center justify-center"
                    // onClick={handleLeaveGroup}
                  >
                    <span className="mr-2">Leave Group</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Group Management Section - Admin Only */}
              {
                <div className="mb-8">
                  <h4 className="text-lg font-semibold mb-3 border-b pb-2">
                    Group Management
                  </h4>
                  <div className="space-y-4">
                    <button
                      className="w-full py-2 px-4 bg-purple-600 text-white rounded hover:bg-purple-700 flex items-center justify-center"
                      // onClick={handleEditGroupInfo}
                    >
                      <span className="mr-2">Edit Group Info</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </button>

                    <button
                      className="w-full py-2 px-4 bg-purple-600 text-white rounded hover:bg-purple-700 flex items-center justify-center"
                      // onClick={handleGroupSettings}
                    >
                      <span className="mr-2">Group Settings</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              }

              {/* Danger Zone - Admin Only */}
              {
                <div>
                  <h4 className="text-lg font-semibold mb-3 text-red-600 border-b border-red-200 pb-2">
                    Danger Zone
                  </h4>
                  <div className="space-y-4">
                    <button
                      className="w-full py-2 px-4 bg-red-600 text-white rounded hover:bg-red-700 flex items-center justify-center"
                      // onClick={handleArchiveGroup}
                    >
                      <span className="mr-2">Archive Group</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
                        <path
                          fillRule="evenodd"
                          d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>

                    <button
                      className="w-full py-2 px-4 bg-red-600 text-white rounded hover:bg-red-700 flex items-center justify-center"
                      // onClick={handleDeleteGroup}
                    >
                      <span className="mr-2">Delete Group</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              }
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GroupSettingsModal;
