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
  const [post, setPost] = useState([]);

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

  const uploadCloud = async (upData) => {
    var imgaURL;
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const sigRes = await axios.get(process.env.REACT_APP_UPLOAD_CLOUD, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const { signature, timestamp, apiKey, cloudName } = sigRes.data;
      const blob = base64ToBlob(upData);

      const uploadCloud = new FormData();
      uploadCloud.append("file", blob);
      uploadCloud.append("api_key", apiKey);
      uploadCloud.append("timestamp", timestamp);
      uploadCloud.append("signature", signature);

      const uploadRes = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        uploadCloud
      );

      const result = uploadRes.data;
      imgaURL = result.secure_url;
      return imgaURL;
    } catch (error) {
      showToast(`${error.response.data.message}`, "error");
    } finally {
      setIsLoading(false);
    }
  };

  async function addDum(upData, cap, groupId) {
    const userData = JSON.parse(localStorage.getItem("user"));
    const imageURL = await uploadCloud(upData);

    const newPost = {
      caption: cap,
      mediaUrl: imageURL,
      mediaType: "image",
      group: {
        id: groupId,
      },
      author: {
        id: userData.userId,
        email: userData.email,
      },
    };

    addPost(newPost);

    setPost((prevDum) => [...prevDum, newPost]);
  }

  const value = { addDum, post };

  return <PostContext.Provider value={value}>{children}</PostContext.Provider>;
};

export const usePostContext = () => {
  return useContext(PostContext);
};
