import React, { useState } from "react";
import { X } from "lucide-react"; // Using Lucide for a more modern close icon

const GroupSettingsModal = ({ modalHandle }) => {
  const [activeTab, setActiveTab] = useState("basicInfo");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const tabs = [
    { id: "basicInfo", label: "Basic Info" },
    { id: "memberManagement", label: "Member Management" },
    { id: "privacy", label: "Privacy" },
    { id: "notifications", label: "Notifications" },
    { id: "actions", label: "Group Actions" },
  ];

  const handleChange = () => {
    modalHandle(false);
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white w-full max-w-4xl h-[90vh] rounded-lg shadow-lg flex flex-col md:flex-row relative overflow-hidden">
        {/* Mobile Header with Menu Toggle */}
        <div className="md:hidden flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Settings</h2>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-gray-600 hover:text-gray-900"
          >
            {isMobileMenuOpen ? "Close" : "Menu"}
          </button>
        </div>

        {/* Side Menu - Responsive */}
        <div
          className={`
          ${isMobileMenuOpen ? "block" : "hidden"}
          md:block md:w-1/4 bg-gray-100 border-r rounded-l-lg p-4 
          absolute md:relative top-0 left-0 w-full h-full z-10 
          overflow-y-auto bg-white md:bg-gray-100
        `}
        >
          <h2 className="text-lg font-semibold mb-4 hidden md:block">
            Settings
          </h2>
          <ul className="space-y-2">
            {tabs.map((tab) => (
              <li key={tab.id}>
                <button
                  onClick={() => {
                    setActiveTab(tab.id);
                    setIsMobileMenuOpen(false);
                  }}
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

        {/* Content Area - Responsive */}
        <div className="flex-1 p-6 overflow-y-auto relative">
          <button
            onClick={handleChange}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
          >
            <X className="w-6 h-6" />
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
