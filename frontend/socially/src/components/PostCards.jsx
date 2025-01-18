import React, { useState } from "react";
import { Heart, MessageCircle, Share2, Bookmark } from "lucide-react";

const Postcards = (props) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(128);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
  };

  return (
    <div className="max-w-md bg-white rounded-lg shadow-md">
      <div className="flex items-center p-4">
        <img
          src={props.img}
          alt="Profile"
          className="w-8 h-8 rounded-full object-cover"
        />
        <span className="ml-3 font-semibold">username</span>
        <button className="ml-auto text-gray-500">•••</button>
      </div>

      <img
        src={props.img}
        alt="Post"
        className="w-full aspect-square object-cover"
      />

      <div className="p-4">
        <div className="flex items-center gap-4">
          <button onClick={handleLike} className="hover:opacity-70 transition">
            <Heart
              className={`w-7 h-7 ${
                isLiked ? "fill-red-500 stroke-red-500" : "stroke-gray-700"
              }`}
            />
          </button>
          <button className="hover:opacity-70 transition">
            <MessageCircle className="w-7 h-7 stroke-gray-700" />
          </button>
          <button className="hover:opacity-70 transition">
            <Share2 className="w-7 h-7 stroke-gray-700" />
          </button>
          <button className="ml-auto hover:opacity-70 transition">
            <Bookmark className="w-7 h-7 stroke-gray-700" />
          </button>
        </div>

        <p className="mt-2 font-semibold">{likes.toLocaleString()} likes</p>

        <p className="mt-1">
          <span className="font-semibold">username</span> This is a sample
          caption for the Instagram post...
        </p>

        <p className="mt-2 text-gray-500">View all 24 comments</p>
        <p className="mt-1 text-xs text-gray-400">2 HOURS AGO</p>
      </div>
    </div>
  );
};

export default Postcards;
