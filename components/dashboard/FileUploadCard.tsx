"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; 
import FileUpload from "@/components/fileUpload";

const FileUploadCard: React.FC = () => {
  return (
    <Card className="bg-gradient-to-t from-gray-100 via-gray-50 to-gray-100 bg-opacity-90 backdrop-blur-md shadow-md">
      <CardHeader>
        <CardTitle>Upload A New Document</CardTitle>
      </CardHeader>
      <CardContent>
        <FileUpload />
      </CardContent>
    </Card>
  );
};

export default FileUploadCard;
