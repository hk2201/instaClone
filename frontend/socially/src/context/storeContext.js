import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoader } from "../context/loaderContext";
// import { useAuth } from "./authContext";
import { showToast } from "../context/toastService";
import axios from "axios";

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  // Initialize groupData as an array
  const [groupData, setGroupData] = useState([]);
  const { setIsLoading } = useLoader();
  const [currentGroup, setCurrentGroup] = useState();
  const [members, setMembers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [groupId, setGroupId] = useState();
  // const { user } = useAuth();
  const navigate = useNavigate();

  const updateGroupId = (upData) => {
    setGroupId(upData);
  };

  const addNewMembers = async (upData, groupId) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        process.env.REACT_APP_UPDATE_NEW_MEMBERS,
        { upData, groupId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMembers(response.data.data);

      showToast("New Members added", "success");
    } catch (error) {
      showToast(`${error.response.data.message}`, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPosts = async (groupId) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token"); // Get token from localStorage
      const response = await axios.get(process.env.REACT_APP_GET_POSTS, {
        params: { groupId },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPosts(response.data.data);

      navigate(`/posts/${groupId}`);
    } catch (error) {
      showToast(`${error.response.data.message}`, "error");
      navigate(`/groups`);
      // console.error("Error updating groups:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const addPost = async (newPost) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token"); // Get token from localStorage
      const response = await axios.post(
        process.env.REACT_APP_ADD_POST,
        newPost,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            // "Content-Type": "multipart/form-data",
          },
        }
      );
      showToast(`${response.data.message}`, "success");
      fetchPosts(newPost.group.id);
    } catch (error) {
      showToast(`${error.response.data.message}`, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchGroups = async (upData) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token"); // Get token from localStorage
      await axios.put(process.env.REACT_APP_UPDATE_GROUP_INFO_API, upData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // setGroupData(response.data.data);
      showToast("Group Info Updated ", "success");
      // console.log("Full API response:", response);
      // console.log("Response data:", response.data);
      // console.log("Groups data:", response.data.data);
    } catch (error) {
      showToast("Error updating groups:", error, "error");
      // console.error("Error updating groups:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateMembers = (newData) => {
    setMembers(newData);
  };

  const updateNewMembers = (newData, Id) => {
    addNewMembers(newData, Id);
  };

  const updateCurrentGroup = (newData) => {
    setCurrentGroup(newData);
  };

  // Update function that properly maintains the array structure
  const updateGroupData = (newData) => {
    if (Array.isArray(newData)) {
      // If newData is an array, replace the current array
      setGroupData(newData);
    } else if (typeof newData === "object") {
      // If it's a single group object, add it to the array
      console.log("STORE FINAL CHECK", groupData);
      // console.log("FROM STORE", groupData);
      let upData = groupData.find((g) => g.id === newData.id);
      upData.name = newData.name;
      upData.description = newData.description;
      upData.image = newData.image;
      fetchGroups(upData);
      // setGroupData((prevData) => [...prevData, newData]);
    }
  };

  // Add a specific group by ID
  const updateGroupById = (groupId, updatedFields) => {
    setGroupData((prevData) =>
      prevData.map((group) =>
        group.id === groupId ? { ...group, ...updatedFields } : group
      )
    );
  };

  // Add a new group
  const addGroup = (newGroup) => {
    // Ensure the new group has a unique ID
    if (!newGroup.id) {
      newGroup.id = Date.now().toString(); // Simple ID generation
    }
    setGroupData((prevData) => [...prevData, newGroup]);
  };

  // Remove a group
  const removeGroup = (groupId) => {
    setGroupData((prevData) =>
      prevData.filter((group) => group.id !== groupId)
    );
  };

  const getRelativeTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

    if (diffSeconds < 60) {
      return rtf.format(-diffSeconds, "second");
    } else if (diffSeconds < 3600) {
      // 60 * 60
      return rtf.format(-Math.floor(diffSeconds / 60), "minute");
    } else if (diffSeconds < 86400) {
      // 60 * 60 * 24
      return rtf.format(-Math.floor(diffSeconds / 3600), "hour");
    } else if (diffSeconds < 2592000) {
      // 60 * 60 * 24 * 30
      return rtf.format(-Math.floor(diffSeconds / 86400), "day");
    } else if (diffSeconds < 31536000) {
      // 60 * 60 * 24 * 365
      return rtf.format(-Math.floor(diffSeconds / 2592000), "month");
    } else {
      return rtf.format(-Math.floor(diffSeconds / 31536000), "year");
    }
  };

  const value = {
    groupData,
    updateGroupData,
    updateGroupById,
    addGroup,
    removeGroup,
    members,
    currentGroup,
    updateMembers,
    updateCurrentGroup,
    updateNewMembers,
    fetchPosts,
    addPost,
    posts,
    getRelativeTime,
    updateGroupId,
    groupId,
  };

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
};

export const useStoreContext = () => {
  return useContext(StoreContext);
};
