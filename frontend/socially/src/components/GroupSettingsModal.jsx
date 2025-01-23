import React, { useState } from "react";

const GroupSettingsModal = () => {
  const [activeTab, setActiveTab] = useState("basicInfo");

  const tabs = [
    { id: "basicInfo", label: "Basic Info" },
    { id: "memberManagement", label: "Member Management" },
    { id: "privacy", label: "Privacy" },
    { id: "notifications", label: "Notifications" },
    { id: "actions", label: "Group Actions" },
  ];

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white w-3/4 h-3/4 rounded-lg shadow-lg flex relative">
        {/* Side Menu */}
        <div className="w-1/4 bg-gray-100 border-r rounded-l-lg p-4">
          <h2 className="text-lg font-semibold mb-4">Settings</h2>
          <ul className="space-y-2">
            {tabs.map((tab) => (
              <li key={tab.id}>
                <button
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left px-4 py-2 rounded-lg ${
                    activeTab === tab.id
                      ? "bg-indigo-600 text-white"
                      : "bg-white text-gray-800 hover:bg-gray-200"
                  }`}
                >
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6">
          <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
            ✕
          </button>

          {activeTab === "basicInfo" && (
            <div>
              <h3 className="text-xl font-bold mb-4">Basic Group Info</h3>
              <p>
                Edit your group's name, description, and other basic details
                here.
              </p>
            </div>
          )}

          {activeTab === "memberManagement" && (
            <div>
              <h3 className="text-xl font-bold mb-4">Member Management</h3>
              <p>Manage members of your group, invite or remove members.</p>
            </div>
          )}

          {activeTab === "privacy" && (
            <div>
              <h3 className="text-xl font-bold mb-4">Privacy Settings</h3>
              <p>Set your group's privacy to public or private.</p>
            </div>
          )}

          {activeTab === "notifications" && (
            <div>
              <h3 className="text-xl font-bold mb-4">Notifications</h3>
              <p>Customize how you receive notifications from the group.</p>
            </div>
          )}

          {activeTab === "actions" && (
            <div>
              <h3 className="text-xl font-bold mb-4">Group Actions</h3>
              <p>
                Perform group-level actions like deleting the group or leaving
                it.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GroupSettingsModal;
