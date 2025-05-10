import React, { useEffect, useState, useRef } from "react";
import { Edit2, Bookmark, Archive } from "lucide-react";
import Footer from "../components/Footer";
import { useLoader } from "../context/loaderContext";
import { showToast } from "../context/toastService";
import axios from "axios";
import Cropper from "react-cropper";
import { useParams } from "react-router-dom";
import "cropperjs/dist/cropper.css";
import { usePostContext } from "../context/postContext";
import { useStoreContext } from "../context/storeContext";

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { setIsLoading } = useLoader();
  const [activeTab, setActiveTab] = useState("posts");
  const [selectedImage, setSelectedImage] = useState(null);
  const [isCropping, setIsCropping] = useState(false);
  const cropperRef = useRef(null);
  const hasFetched = useRef(false); // Prevent duplicate fetches
  const { addProfileImage } = usePostContext();
  const { posts } = useStoreContext();
  const { profileId } = useParams();

  const [profile, setProfile] = useState({
    profilePicture: "",
    name: "",
    uname: "",
    bio: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      if (hasFetched.current) return; // Prevents multiple API calls
      hasFetched.current = true;

      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(process.env.REACT_APP_GET_USER, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProfile(response.data.data);
        showToast("User Data Fetched", "success");
      } catch (error) {
        showToast(
          `${error.response?.data?.message || "Failed to fetch data"}`,
          "error"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleProfilePictureChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageBlob = URL.createObjectURL(file);
      setSelectedImage(imageBlob);
      // Hide the edit modal and show the cropping modal
      setIsEditing(false);
      setIsCropping(true);
    }
  };

  const handleCrop = async () => {
    if (cropperRef.current) {
      const croppedImageData = cropperRef.current.cropper
        .getCroppedCanvas()
        .toDataURL();
      const imageURL = await addProfileImage(croppedImageData);
      setProfile({ ...profile, profilePicture: imageURL });
      // Close the cropping modal
      setSelectedImage(null);
      setIsCropping(false);
      // Reopen the edit modal
      setIsEditing(true);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");

      const response = await axios.put(
        process.env.REACT_APP_UPDATE_USER,
        profile,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setProfile(response.data.data);

      showToast("User Details Updated", "success");
    } catch (error) {
      showToast(
        error.response?.data?.message || "Failed to update user",
        "error"
      );
    } finally {
      setIsLoading(false);
      setIsEditing(false);
    }
  };

  const postTypes = {
    posts: posts,
    // saved: saved,
    // archived: archive,
  };

  const handleCancelCrop = () => {
    setSelectedImage(null);
    setIsCropping(false);
    setIsEditing(true);
  };

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
          </div>

          <div className="text-center md:text-left w-full">
            <h1 className="text-2xl font-bold">{profile.name}</h1>
            <p className="text-gray-600">@{profile.uname}</p>
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
          {postTypes[activeTab]
            .filter((post) => post.author.id === profileId) // Filter posts by authorId
            .map((post) => (
              <div
                key={post.id}
                className="aspect-square bg-gray-100 overflow-hidden rounded-xl"
              >
                <img
                  src={post.mediaUrl}
                  alt={`Post ${post.id}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform"
                />
              </div>
            ))}
        </div>

        {/* Edit Profile Modal */}
        {isEditing && !isCropping && (
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
                      value={
                        field === "username" ? profile.uname : profile[field]
                      }
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          [field === "username" ? "uname" : field]:
                            e.target.value,
                        })
                      }
                      className={`w-full border rounded px-3 py-2 ${
                        field === "name"
                          ? "bg-gray-200 cursor-not-allowed text-gray-500"
                          : ""
                      }`}
                      disabled={field === "name"}
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
                  onClick={handleSave}
                  className="bg-indigo-600 text-white px-4 py-2 rounded"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Image Cropping Modal - Separate from Edit Profile Modal */}
        {isCropping && selectedImage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-semibold text-center mb-4">
                Crop Your Profile Picture
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
      </div>

      <div className="fixed bottom-0 left-0 w-full border-t">
        <Footer />
      </div>
    </div>
  );
};

export default ProfilePage;
