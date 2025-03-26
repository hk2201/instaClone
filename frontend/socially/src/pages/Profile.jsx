import React, { useState } from "react";
import {
  Camera,
  Edit2,
  Settings,
  BookmarkIcon,
  ArchiveIcon,
} from "lucide-react";

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    profilePicture: "/api/placeholder/200/200",
    name: "John Doe",
    username: "johndoe",
    bio: "Exploring the world, one post at a time",
  });

  const [activeTab, setActiveTab] = useState("posts");

  const handleProfilePictureChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile((prev) => ({
          ...prev,
          profilePicture: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const renderPosts = () => {
    const postTypes = {
      posts: [
        { id: 1, image: "/api/placeholder/300/300?1" },
        { id: 2, image: "/api/placeholder/300/300?2" },
        { id: 3, image: "/api/placeholder/300/300?3" },
      ],
      saved: [
        { id: 4, image: "/api/placeholder/300/300?4" },
        { id: 5, image: "/api/placeholder/300/300?5" },
      ],
      archived: [{ id: 6, image: "/api/placeholder/300/300?6" }],
    };

    return (
      <div className="grid grid-cols-3 gap-1 sm:gap-3">
        {postTypes[activeTab].map((post) => (
          <div
            key={post.id}
            className="aspect-square bg-gray-100 overflow-hidden"
          >
            <img
              src={post.image}
              alt={`Post ${post.id}`}
              className="w-full h-full object-cover hover:scale-105 transition-transform"
            />
          </div>
        ))}
      </div>
    );
  };

  const renderProfileEditModal = () => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profile Picture
            </label>
            <div className="flex items-center space-x-4">
              <img
                src={profile.profilePicture}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover"
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleProfilePictureChange}
                className="hidden"
                id="profilePicture"
              />
              <label
                htmlFor="profilePicture"
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 cursor-pointer"
              >
                Change
              </label>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name
            </label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) =>
                setProfile((prev) => ({ ...prev, name: e.target.value }))
              }
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              value={profile.username}
              onChange={(e) =>
                setProfile((prev) => ({ ...prev, username: e.target.value }))
              }
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bio
            </label>
            <textarea
              value={profile.bio}
              onChange={(e) =>
                setProfile((prev) => ({ ...prev, bio: e.target.value }))
              }
              className="w-full border rounded px-3 py-2"
              rows="3"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setIsEditing(false)}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Profile Header */}
      <div className="flex items-center space-x-6 mb-6">
        <div className="relative">
          <img
            src={profile.profilePicture}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleProfilePictureChange}
            className="hidden"
            id="profilePictureHeader"
          />
          <label
            htmlFor="profilePictureHeader"
            className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full cursor-pointer"
          >
            <Camera size={16} />
          </label>
        </div>

        <div className="flex-1">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold">{profile.name}</h1>
            <button
              onClick={() => setIsEditing(true)}
              className="bg-gray-200 text-gray-800 px-3 py-1 rounded hover:bg-gray-300 flex items-center"
            >
              <Edit2 size={16} className="mr-2" />
              Edit Profile
            </button>
          </div>
          <p className="text-gray-600">@{profile.username}</p>
          <p className="text-gray-500 mt-2">{profile.bio}</p>
        </div>
      </div>

      {/* Profile Tabs */}
      <div className="border-b mb-6">
        <div className="flex space-x-6 justify-center">
          <button
            onClick={() => setActiveTab("posts")}
            className={`pb-2 ${
              activeTab === "posts"
                ? "border-b-2 border-indigo-600 text-indigo-600"
                : "text-gray-500"
            }`}
          >
            Posts
          </button>
          <button
            onClick={() => setActiveTab("saved")}
            className={`pb-2 ${
              activeTab === "saved"
                ? "border-b-2 border-indigo-600 text-indigo-600"
                : "text-gray-500"
            }`}
          >
            <BookmarkIcon size={18} className="inline-block mr-2" />
            Saved
          </button>
          <button
            onClick={() => setActiveTab("archived")}
            className={`pb-2 ${
              activeTab === "archived"
                ? "border-b-2 border-indigo-600 text-indigo-600"
                : "text-gray-500"
            }`}
          >
            <ArchiveIcon size={18} className="inline-block mr-2" />
            Archived
          </button>
        </div>
      </div>

      {/* Posts Grid */}
      {renderPosts()}

      {/* Edit Profile Modal */}
      {isEditing && renderProfileEditModal()}
    </div>
  );
};

export default ProfilePage;
