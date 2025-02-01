import {
  MessageCircle,
  LogOut,
  User,
  Settings,
  Camera,
  Image,
} from "lucide-react";
import { CirclePlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Footer({ getImage }) {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleTakePhoto = () => {
    console.log("Taking photo...");
    setIsModalOpen(false);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const ImageBlob = URL.createObjectURL(file);
      setSelectedImage(ImageBlob);
      // console.log(URL.createObjectURL(file));
      getImage(ImageBlob);
    }

    setIsModalOpen(false);
  };

  return (
    <>
      <div className="flex justify-center items-center w-full px-4 sm:space-x-60 space-x-10 border-t border-gray-200">
        {/* Profile Button */}
        <button className="p-2 sm:p-3 text-gray-600 hover:bg-gray-100 rounded-full transition-colors group">
          <User className="w-8 sm:w-10 h-8 sm:h-10 group-hover:text-indigo-600" />
        </button>

        {/* Direct Message Button */}
        <button
          className="relative p-2 sm:p-3 text-gray-600 hover:bg-gray-100 rounded-full transition-colors group"
          onClick={() => navigate("/chats")}
        >
          <MessageCircle className="w-8 sm:w-10 h-8 sm:h-10 group-hover:text-indigo-600" />
          <span className="absolute top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
            3
          </span>
        </button>

        {/* Add Post Button */}
        <button
          className="bg-indigo-600 md:p-2 rounded-full shadow-lg hover:shadow-xl hover:bg-indigo-700 transition-all duration-300 hover:scale-105 group z-50"
          onClick={() => setIsModalOpen(true)}
          aria-label="Add new post"
        >
          <CirclePlus className="text-white" size={36} />
          <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
            Add New Post
          </span>
        </button>

        {/* Settings Button */}
        <button className="p-2 sm:p-3 text-gray-600 hover:bg-gray-100 rounded-full transition-colors group">
          <Settings className="w-8 sm:w-10 h-8 sm:h-10 group-hover:text-indigo-600" />
        </button>

        {/* Logout Button */}
        <button
          className="p-2 sm:p-3 text-gray-600 hover:bg-red-100 hover:text-red-600 rounded-full transition-colors group"
          onClick={() => navigate("/groups")}
        >
          <LogOut className="w-8 sm:w-10 h-8 sm:h-10 group-hover:text-red-600" />
        </button>
      </div>

      {/* Custom Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={() => setIsModalOpen(false)}
          />

          {/* Modal Content */}
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 relative z-10">
            <div className="flex flex-col space-y-4">
              <button
                onClick={handleTakePhoto}
                className="flex items-center space-x-2 p-4 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Camera className="w-6 h-6 text-indigo-600" />
                <span className="text-lg">Take a Picture</span>
              </button>
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                  id="fileInput"
                />
                <button
                  onClick={() => document.getElementById("fileInput").click()}
                  className="flex items-center space-x-2 p-4 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Image className="w-6 h-6 text-indigo-600" />

                  <span className="text-lg">Choose from Gallery</span>
                </button>
              </div>
            </div>
          </div>
          {/* {selectedImage && (
            <img src={selectedImage} alt="Selected" width="200px" />
          )} */}
        </div>
      )}
    </>
  );
}

export default Footer;
