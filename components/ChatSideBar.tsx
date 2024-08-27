"use client";
import { DrizzleChat } from "@/lib/db/schema";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { MessageCircle, PlusCircle, Home } from "lucide-react"; // Add Home icon
import { cn } from "@/lib/utils";

type Props = {
  chats: DrizzleChat[];
  chatId: number;
};

const ChatSideBar = ({ chats, chatId }: Props) => {
  return (
    <div className="w-full h-full flex flex-col p-4 text-gray-200 bg-gray-900">
      {/* Top: New Chat Button */}
      <Link href="/">
        <Button className="w-full border-dashed border-white border">
          <PlusCircle className="mr-2 w-4 h-4" />
          New Chat
        </Button>
      </Link>

      {/* Middle: List of Chats */}
      <div className="flex-1 mt-4 overflow-y-auto">
        {chats.map((chat) => (
          <Link key={chat.id} href={`/chat/${chat.id}`}>
            <div
              className={cn("rounded-lg p-3 text-slate-300 flex items-center", {
                "bg-blue-600 text-white": chat.id === chatId,
                "hover:text-white": chat.id !== chatId,
              })}
            >
              <MessageCircle className="mr-2" />
              <p className="w-full overflow-hidden text-sm truncate whitespace-nowrap text-ellipsis">
                {chat.pdfName}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Bottom: Home Button */}
      <div className="mt-auto">
        <Link href="/">
          <Button variant="ghost" className="w-full text-gray-300">
            <Home className="mr-2 w-4 h-4" />
            Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ChatSideBar;
