"use client";

import Link from "next/link";
import React from "react";
import { MessageCircle, FileText, Settings, Home } from "lucide-react"; // Icons for the links
import UploadDialog from "./UploadDialog"; // Import the new UploadDialog component

interface HomeSidebarProps {
  firstChat: string | null; // Expecting firstChat as a prop
}

const HomeSidebar: React.FC<HomeSidebarProps> = ({ firstChat }) => {
  return (
    <div className="w-full h-full flex flex-col p-4 bg-blue-800 sticky top-0">
      
      {/* Middle: List of Links */}
      <div className="flex-1 mt-4 overflow-y-auto">
        <Link href="/help-filling-forms">
          <div 
            className="rounded-lg p-3 text-white font-bold flex items-center hover:text-slate-400" 
            aria-label="Submit A Claim"
          >
            <FileText className="mr-2" aria-hidden="true" focusable="false" />
            <p className="w-full text-md">Submit A Claim</p>
          </div>
        </Link>

        {/* Conditional rendering for Review Your Docs link */}
        {firstChat ? (
          <Link href={`/pdf-chat/${firstChat}`}>
            <div 
              className="rounded-lg p-3 text-white font-bold flex items-center hover:text-slate-400" 
              aria-label="Review Your Docs"
            >
              <MessageCircle className="mr-2" aria-hidden="true" focusable="false" />
              <p className="w-full text-md">Review Your Docs</p>
            </div>
          </Link>
        ) : (
          // Render the UploadDialog when there are no chats
          <UploadDialog />
        )}
        <Link href="/profile">
          <div 
            className="rounded-lg p-3 text-white font-bold flex items-center hover:text-slate-400" 
            aria-label="Profile / Settings"
          >
            <Settings className="mr-2" aria-hidden="true" focusable="false" />
            <p className="w-full text-md">Profile / Settings</p>
          </div>
        </Link>
      </div>

      {/* Bottom: Home Button */}
      <div className="mt-auto flex justify-center">
        <Link href="/home">
          <div className="rounded-lg p-3 text-white font-bold flex items-center hover:text-slate-400">
            <Home className="mr-2 w-6 h-6" aria-hidden="true" focusable="false" />
            <p className="w-full text-md">Home</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default HomeSidebar;
