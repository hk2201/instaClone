import React, { useState } from "react";
import { Camera, Edit2, Bookmark, Archive } from "lucide-react";
import Footer from "../components/Footer";

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");
  const [profile, setProfile] = useState({
    profilePicture: "/api/placeholder/200/200",
    name: "John Doe",
    username: "johndoe",
    bio: "Exploring the world, one post at a time",
  });

  const handleProfilePictureChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () =>
        setProfile({ ...profile, profilePicture: reader.result });
      reader.readAsDataURL(file);
    }
  };

  const postTypes = {
    posts: ["1", "2", "3", "4", "5", "6"],
    saved: ["4", "5"],
    archived: ["6"],
  };

  const ProfilePictureUploader = ({ className }) => (
    <>
      <input
        type="file"
        accept="image/*"
        className="hidden"
        id="profilePicture"
        onChange={handleProfilePictureChange}
      />
      <label
        htmlFor="profilePicture"
        className={`absolute bottom-0 right-0 bg-indigo-600 text-white p-1.5 rounded-full cursor-pointer ${className}`}
      >
        <Camera size={16} />
      </label>
    </>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 container mx-auto px-4 py-6 max-w-4xl mb-20">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-12 mb-6">
          <div className="relative w-32 h-32 shrink-0">
            <img
              src={profile.profilePicture}
              alt="Profile"
              className="w-full h-full rounded-full object-cover border-4 border-white shadow-md"
            />
            <ProfilePictureUploader />
          </div>

          <div className="text-center md:text-left w-full">
            <h1 className="text-2xl font-bold">{profile.name}</h1>
            <p className="text-gray-600">@{profile.username}</p>
            <p className="text-gray-500 mt-2">{profile.bio}</p>

            <div className="flex justify-center md:justify-start items-center mt-4 gap-4">
              <button
                onClick={() => setIsEditing(true)}
                className="bg-gray-200 px-4 py-1.5 rounded flex items-center"
              >
                <Edit2 size={16} className="mr-2" /> Edit Profile
              </button>
            </div>
          </div>
        </div>

        {/* Profile Tabs */}
        <div className="flex justify-center border-b mb-6">
          {["posts", "saved", "archived"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 flex items-center ${
                activeTab === tab
                  ? "border-b-2 border-indigo-600 text-indigo-600"
                  : "text-gray-500"
              }`}
            >
              {tab === "saved" && <Bookmark size={16} className="mr-2" />}
              {tab === "archived" && <Archive size={16} className="mr-2" />}
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
          {postTypes[activeTab].map((id) => (
            <div
              key={id}
              className="aspect-square bg-gray-100 overflow-hidden rounded"
            >
              <img
                src={`/api/placeholder/300/300?${id}`}
                alt={`Post ${id}`}
                className="w-full h-full object-cover hover:scale-105 transition-transform"
              />
            </div>
          ))}
        </div>

        {/* Edit Profile Modal */}
        {isEditing && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
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
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    id="profilePictureEdit"
                    className="hidden"
                    onChange={handleProfilePictureChange}
                  />
                  <label
                    htmlFor="profilePictureEdit"
                    className="bg-indigo-600 text-white px-3 py-1.5 rounded cursor-pointer"
                  >
                    Change
                  </label>
                </div>
              </div>

              {["name", "username", "bio"].map((field) => (
                <div key={field} className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                  {field === "bio" ? (
                    <textarea
                      value={profile[field]}
                      onChange={(e) =>
                        setProfile({ ...profile, [field]: e.target.value })
                      }
                      className="w-full border rounded px-3 py-2"
                      rows="3"
                    />
                  ) : (
                    <input
                      type="text"
                      value={profile[field]}
                      onChange={(e) =>
                        setProfile({ ...profile, [field]: e.target.value })
                      }
                      className="w-full border rounded px-3 py-2"
                    />
                  )}
                </div>
              ))}

              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-200 px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 w-full border-t z-50">
        <Footer />
      </div>
    </div>
  );
};

export default ProfilePage;
