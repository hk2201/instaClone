import { createContext, useContext, useState } from "react";
import { useLoader } from "../context/loaderContext";
// import { useAuth } from "./authContext";
import { showToast } from "../context/toastService";
import axios from "axios";
const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  // Initialize groupData as an array
  const [groupData, setGroupData] = useState([]);
  const { setIsLoading } = useLoader();
  // const { user } = useAuth();

  const fetchGroups = async (upData) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token"); // Get token from localStorage
      const response = await axios.put(
        process.env.REACT_APP_UPDATE_GROUP_INFO_API,
        upData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
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

  // Debug output
  //   console.log("from context", groupData);

  const value = {
    groupData,
    updateGroupData,
    updateGroupById,
    addGroup,
    removeGroup,
  };

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
};

export const useStoreContext = () => {
  return useContext(StoreContext);
};
