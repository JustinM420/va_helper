"use client";

import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { MessageCircle, FileText, Settings, Home } from "lucide-react"; // Icons for the links

const HomeSidebar = () => {
  return (
    <div className="w-full h-full flex flex-col p-4 bg-blue-500 sticky top-0">
      
      {/* Middle: List of Links */}
      <div className="flex-1 mt-4 overflow-y-auto">
        <Link href="/chat-with-va-docs">
          <div className="rounded-lg p-3 text-white font-bold flex items-center hover:text-slate-400">
            <MessageCircle className="mr-2" />
            <p className="w-full text-sm">Chat with Your VA Docs</p>
          </div>
        </Link>

        <Link href="/help-filling-forms">
          <div className="rounded-lg p-3 text-white font-bold flex items-center hover:text-slate-400">
            <FileText className="mr-2" />
            <p className="w-full text-sm">Get Help Filling Forms</p>
          </div>
        </Link>

        <Link href="/settings">
          <div className="rounded-lg p-3 text-white font-bold flex items-center hover:text-slate-400">
            <Settings className="mr-2" />
            <p className="w-full text-sm">Profile / Settings</p>
          </div>
        </Link>
      </div>

      {/* Bottom: Home Button */}
      <div className="mt-auto">
        <Link href="/home">
          <Button variant="ghost" className="w-full text-gray-300">
            <Home className="mr-2 w-4 h-4" />
            Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default HomeSidebar;
