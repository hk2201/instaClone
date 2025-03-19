import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoader } from "../context/loaderContext";
// import { useAuth } from "./authContext";
import { showToast } from "../context/toastService";
import axios from "axios";

const PostContext = createContext();

export const PostProvider = ({ children }) => {
  const [post, setPost] = useState([
    {
      id: 123123,
      caption: "" | "Empty",
      content: "" | "Empty",
      mediaUrl: "https://shorturl.at/ki9EJ",
      mediaType: "image" || null,
      createdAt: 12,
      updatedAt: 21,
      group: {
        id: 123123,
        name: "Something",
      },
      author: {
        id: 123123,
        name: "Harshad" || "Unknown",
        lastname: "Khandare" || "Unknown",
        email: "hk@gmail.com",
        image: "sdfsdf" || "/api/placeholder/48/48",
      },
      comments: [],
      commentCount: 12,
      likes: [],
      likeCount: 123,
    },
  ]);
  function addDum(upData) {
    setPost((prevDum) => [...prevDum, { mediaUrl: upData }]);
  }

  const value = { addDum, post };

  return <PostContext.Provider value={value}>{children}</PostContext.Provider>;
};

export const usePostContext = () => {
  return useContext(PostContext);
};
