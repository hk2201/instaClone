import { createContext, useContext, useState } from "react";
import { useLoader } from "../context/loaderContext";
import { showToast } from "../context/toastService";
import axios from "axios";
import { data } from "react-router-dom";
import { useStoreContext } from "./storeContext";

const PostContext = createContext();

export const PostProvider = ({ children }) => {
  const { setIsLoading } = useLoader();
  const { addPost } = useStoreContext();
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

  const base64ToBlob = (base64Data) => {
    const [meta, data] = base64Data.split(",");
    const contentType = meta.match(/:(.*?);/)[1];
    const byteCharacters = atob(data);
    const byteNumbers = new Array(byteCharacters.length)
      .fill(0)
      .map((_, i) => byteCharacters.charCodeAt(i));
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: contentType });
  };

  function addDum(upData, cap, groupId) {
    const userData = JSON.parse(localStorage.getItem("user"));
    const blob = base64ToBlob(upData);
    const formData = new FormData();
    formData.append("image", blob, "photo.png");
    formData.append("caption", cap);
    formData.append("mediaType", "image");
    formData.append("groupId", groupId);
    formData.append("authorId", userData.userId);
    formData.append("authorEmail", userData.email);

    // const newPost = {
    //   caption: cap,
    //   mediaUrl: formData,
    //   mediaType: "image",
    //   group: {
    //     id: groupId,
    //   },
    //   author: {
    //     id: userData.userId,
    //     email: userData.email,
    //   },
    // };

    addPost(formData);

    setPost((prevDum) => [
      ...prevDum,
      {
        id: 123123,
        caption: cap || "Empty",
        content: "" | "Empty",
        mediaUrl: upData,
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
  }

  const value = { addDum, post };

  return <PostContext.Provider value={value}>{children}</PostContext.Provider>;
};

export const usePostContext = () => {
  return useContext(PostContext);
};
