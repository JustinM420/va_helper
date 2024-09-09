// components/UploadDialog.tsx

"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MessageCircle } from "lucide-react";
import FileUpload from "@/components/fileUpload";

const UploadDialog: React.FC = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div
          className="rounded-lg p-3 text-white font-bold flex items-center hover:text-slate-400 cursor-pointer"
          aria-label="Upload Your Docs"
        >
          <MessageCircle className="mr-2" aria-hidden="true" focusable="false" />
          <p className="w-full text-md">Upload Your Docs</p>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Your Document</DialogTitle>
        </DialogHeader>
        <FileUpload />
      </DialogContent>
    </Dialog>
  );
};

export default UploadDialog;
