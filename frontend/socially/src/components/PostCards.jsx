import React, { useState } from "react";
import { Heart, MessageCircle, Share2, Bookmark } from "lucide-react";
import { usePostContext } from "../context/postContext";
import { useAuth } from "../context/authContext";

const Postcards = (props) => {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(
    props.pData.likes?.some((like) => like.userId === user.userId)
  );

  const [likes, setLikes] = useState(props.pData.likeCount);
  const { updateLikes } = usePostContext();

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
    updateLikes(props.pData.id);
  };

  return (
    <div className="w-full sm:w-96 md:w-md lg:w-md bg-white rounded-lg shadow-md">
      <div className="flex items-center p-4">
        <img
          src={props.pData.author.image}
          alt="Profile"
          className="w-8 h-8 rounded-full object-cover"
        />
        <span className="ml-3 font-semibold">
          {props.pData.author.name} {props.pData.author.lastname}
        </span>
        <button className="ml-auto text-gray-500">•••</button>
      </div>

      <img
        src={props.pData.mediaUrl}
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
          <span className="font-semibold">
            {props.pData.author.name} {props.pData.author.lastname}
          </span>{" "}
          {props.pData.caption}
        </p>

        <p className="mt-2 text-gray-500">View all 24 comments</p>
        <p className="mt-1 text-xs text-gray-400">2 HOURS AGO</p>
      </div>
    </div>
  );
};

export default Postcards;
