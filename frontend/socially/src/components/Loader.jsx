import React, { useState, useEffect } from "react";
import { useLoader } from "../context/loaderContext";
import Title from "./Title";

const Loader = () => {
  const { isLoading } = useLoader();
  const [progress, setProgress] = useState(0);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white">
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

      {/* Progress bar */}
      <div className="mt-8 w-64 h-1 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-500 transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Loading text */}
      <div className="mt-4 text-gray-600 font-medium">
        Gettings things ready for you...
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
    </div>
  );
};

export default Loader;
