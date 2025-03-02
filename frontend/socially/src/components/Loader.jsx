import React from "react";
import ReactDOM from "react-dom"; // Import this
import { useLoader } from "../context/loaderContext";
import Title from "./Title";

const Loader = () => {
  const { isLoading } = useLoader();

  if (!isLoading) return null;

  // Use ReactDOM.createPortal to render directly to body
  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      {/* Loader container with glass effect */}
      <div className="p-8 rounded-xl bg-white bg-opacity-80 shadow-lg flex flex-col items-center">
        {/* Brand logo placeholder */}
        <div className="mb-8">
          <Title />
        </div>

        {/* Animated dots */}
        <div className="flex space-x-2">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-4 h-4 rounded-full bg-blue-500"
              style={{
                animation: `bounce 0.8s ${i * 0.1}s infinite`,
                opacity: 0.2 + i * 0.2,
              }}
            />
          ))}
        </div>

        {/* Loading text */}
        <div className="mt-4 text-gray-600 font-medium">
          Getting things ready for you...
        </div>
      </div>

      <style jsx global>{`
        @keyframes bounce {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </div>,
    document.body // This appends the loader directly to the body element
  );
};

export default Loader;
