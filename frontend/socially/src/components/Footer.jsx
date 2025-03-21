import {
  MessageCircle,
  LogOut,
  User,
  Settings,
  Camera,
  Image,
} from "lucide-react";
import { CirclePlus } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useRef, useCallback } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import Webcam from "react-webcam";

const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: "user",
};

function Footer({ getImage }) {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isCameraMode, setIsCameraMode] = useState(false);
  const [caption, setCaption] = useState("");
  const cropperRef = useRef(null);
  const webcamRef = useRef(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageBlob = URL.createObjectURL(file);
      setSelectedImage(imageBlob);
    }
  };

  const handleCrop = () => {
    if (cropperRef.current) {
      const croppedImageData = cropperRef.current.cropper
        .getCroppedCanvas()
        .toDataURL();
      getImage(croppedImageData, caption);
    }
    setIsModalOpen(false);
    setSelectedImage(null);
    setIsCameraMode(false);
  };

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setSelectedImage(imageSrc);
  }, [webcamRef]);

  const handleOpenCamera = () => {
    setIsCameraMode(true);
    setSelectedImage(null);
  };

  const handleOpenGallery = () => {
    setIsCameraMode(false);
    setSelectedImage(null);
  };

  const handleInputChange = (e) => {
    setCaption(e.target.value);
  };

  return (
    <>
      <div className="flex justify-center items-center w-full px-4 sm:space-x-60 space-x-10 border-t border-gray-200">
        <button className="p-2 sm:p-3 text-gray-600 hover:bg-gray-100 rounded-full transition-colors group">
          <User className="w-8 sm:w-10 h-8 sm:h-10 group-hover:text-indigo-600" />
        </button>

        <button
          className="relative p-2 sm:p-3 text-gray-600 hover:bg-gray-100 rounded-full transition-colors group"
          onClick={() => navigate("/chats")}
        >
          <MessageCircle className="w-8 sm:w-10 h-8 sm:h-10 group-hover:text-indigo-600" />
          <span className="absolute top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
            3
          </span>
        </button>

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

        <button className="p-2 sm:p-3 text-gray-600 hover:bg-gray-100 rounded-full transition-colors group">
          <Settings className="w-8 sm:w-10 h-8 sm:h-10 group-hover:text-indigo-600" />
        </button>

        <button
          className="p-2 sm:p-3 text-gray-600 hover:bg-red-100 hover:text-red-600 rounded-full transition-colors group"
          onClick={() => navigate("/groups")}
        >
          <LogOut className="w-8 sm:w-10 h-8 sm:h-10 group-hover:text-red-600" />
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={() => {
              setIsModalOpen(false);
              setIsCameraMode(false);
              setSelectedImage(null);
            }}
          />

          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 relative z-10">
            {!selectedImage && !isCameraMode && (
              <div className="flex flex-col space-y-4">
                <button
                  onClick={handleOpenCamera}
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
            )}

            {isCameraMode && !selectedImage && (
              <div className="flex flex-col space-y-4">
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  videoConstraints={videoConstraints}
                  minScreenshotWidth={180}
                  minScreenshotHeight={180}
                />
                <div className="flex justify-between">
                  <button
                    onClick={capture}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-indigo-700 transition-all duration-300"
                  >
                    Capture
                  </button>
                  <button
                    onClick={() => {
                      setIsCameraMode(false);
                      setSelectedImage(null);
                    }}
                    className="bg-gray-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-gray-600 transition-all duration-300"
                  >
                    Back
                  </button>
                </div>
              </div>
            )}

            {selectedImage && (
              <div className="flex flex-col items-center space-y-4">
                <h2 className="text-xl font-semibold text-gray-700">
                  Crop Your Image
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
                <div className="w-full space-y-4">
                  <div>
                    <label
                      htmlFor="caption"
                      className="block mb-2 text-sm font-medium text-gray-900"
                    >
                      Caption
                    </label>
                    <textarea
                      id="caption"
                      name="caption"
                      value={caption}
                      onChange={handleInputChange}
                      rows="3"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                      placeholder="Add a caption for your image (optional)"
                    />
                  </div>
                </div>
                <div className="flex justify-between w-full">
                  <button
                    onClick={handleCrop}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-indigo-700 transition-all duration-300"
                  >
                    Crop & Save
                  </button>
                  <button
                    onClick={() => {
                      setSelectedImage(null);
                      isCameraMode
                        ? setIsCameraMode(true)
                        : setIsCameraMode(false);
                    }}
                    className="bg-gray-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-gray-600 transition-all duration-300"
                  >
                    Back
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Footer;
