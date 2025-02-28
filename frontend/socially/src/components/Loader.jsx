import React, { useState, useEffect } from "react";
import { useLoader } from "../context/loaderContext";
import Title from "./Title";

const Loader = () => {
  const { isLoading } = useLoader();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isLoading) {
      // Simulate progress for demo purposes
      const interval = setInterval(() => {
        setProgress((prev) => (prev < 90 ? prev + 10 : prev));
      }, 800);
      return () => clearInterval(interval);
    }
  }, [isLoading]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
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

        {/* Progress bar */}
        <div className="mt-8 w-full h-1.5 bg-gray-200 bg-opacity-30 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
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
    </div>
  );
};

export default Loader;
